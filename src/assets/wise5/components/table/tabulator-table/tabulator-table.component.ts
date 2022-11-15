import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import {
  Tabulator,
  EditModule,
  FormatModule,
  FrozenColumnsModule,
  InteractionModule,
  KeybindingsModule,
  ReactiveDataModule,
  SelectRowModule,
  SortModule
} from 'tabulator-tables';
import { UtilService } from '../../../services/utilService';
import { TabulatorColumn } from '../TabulatorData';

@Component({
  selector: 'tabulator-table',
  templateUrl: './tabulator-table.component.html',
  styleUrls: ['./tabulator-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabulatorTableComponent implements OnChanges, AfterViewInit {
  @Input() editableCells: any;
  @Input() enableRowSelection: boolean;
  @Input() disabled: boolean;
  @Input() selectedRowIndices: number[] = [];
  @Input() tabColumns: TabulatorColumn[]; // see http://tabulator.info/docs/5.3/columns
  @Input() tabData: any[]; // see http://tabulator.info/docs/5.3/data
  @Input() tabOptions: any; // see http://tabulator.info/docs/5.3/options
  @Input() tabSorters: any; // see https://tabulator.info/docs/5.4/sort#intial
  @Output() cellChanged = new EventEmitter<Tabulator.CellComponent>();
  @Output() ready = new EventEmitter<void>();
  @Output() rowSelectionChanged = new EventEmitter<Tabulator.RowComponent>();
  @Output() rowSortChanged = new EventEmitter<{ sortOrder: number[]; tabSorters: [] }>();
  @ViewChild('table', { static: false }) tableContainer: ElementRef;

  table: Tabulator;
  tableEl = document.createElement('div');
  subscriptions: Subscription = new Subscription();
  viewInit$ = new ReplaySubject();

  constructor(protected UtilService: UtilService) {
    Tabulator.registerModule([
      EditModule,
      FormatModule,
      FrozenColumnsModule,
      InteractionModule,
      KeybindingsModule,
      ReactiveDataModule,
      SelectRowModule,
      SortModule
    ]);
  }

  ngAfterViewInit(): void {
    this.tabOptions.columns = this.setupColumns(this.tabColumns);
    this.initializeRowSelection();
    this.tabOptions.data = this.tabData;
    this.tabOptions.initialSort = this.UtilService.makeCopyOfJSONObject(this.tabSorters);
    this.table = new Tabulator(this.tableEl, this.tabOptions);
    this.table.on('cellEdited', (cell) => {
      this.cellChanged.emit(cell);
    });
    this.table.on('tableBuilt', () => {
      if (this.enableRowSelection) {
        this.setupRowSelection();
      }
      this.setupSorting();
      this.ready.emit();
    });
    this.tableContainer.nativeElement.appendChild(this.tableEl);
    this.viewInit$.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.subscriptions.add(
      this.viewInit$.subscribe(() => {
        this.processChanges(changes);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setupColumns(columns: TabulatorColumn[]): TabulatorColumn[] {
    columns.forEach((column: TabulatorColumn) => {
      column.editor = 'input';
      column.editable = (cell) => {
        return this.disabled ? false : this.isCellEditable(cell);
      };
      column.formatter = (cell) => {
        return this.cellFormatter(cell);
      };
      column.sorter = 'alphanum';
      column.sorterParams = {
        alignEmptyValues: 'bottom'
      };
    });
    return columns;
  }

  private isCellEditable(cell: Tabulator.CellComponent): boolean {
    const rowIndex = cell.getRow().getIndex() + 1;
    const field = cell.getColumn().getField();
    const row = this.editableCells[rowIndex];
    return row && row.includes(field);
  }

  private cellFormatter(cell: Tabulator.CellComponent): any {
    if (this.isCellEditable(cell)) {
      cell.getElement().classList.add('tabulator-cell-editable');
    }
    return cell.getValue();
  }

  private initializeRowSelection(): void {
    if (this.enableRowSelection && !this.disabled) {
      this.tabOptions.columns.unshift({
        formatter: 'rowSelection',
        titleFormatter: 'rowSelection',
        hozAlign: 'center',
        headerSort: false,
        frozen: true,
        cellClick: (e, cell) => {
          cell.getRow().toggleSelect();
        }
      });
    }
  }

  private processChanges(changes: SimpleChanges): void {
    if (changes['tabColumns'] && !changes['tabColumns'].isFirstChange()) {
      this.table.setColumns(this.setupColumns(this.tabColumns));
    }
    if (changes['tabData'] && !changes['tabData'].isFirstChange()) {
      this.table.setData(this.tabData);
    }
  }

  private setupRowSelection(): void {
    if (this.selectedRowIndices.length > 0) {
      this.table.selectRow(this.selectedRowIndices);
    }
    this.table.on('rowSelectionChanged', (data, rows) => {
      this.rowSelectionChanged.emit(rows);
    });
  }

  private setupSorting(): void {
    this.table.on('dataSorted', (sorters, rows) => {
      const prevRowIndices: number[] = [];
      for (const row of rows) {
        prevRowIndices.push(row.getIndex());
      }
      this.rowSortChanged.emit({
        sortOrder: prevRowIndices,
        tabSorters: this.sortersToJson(sorters)
      });
    });
  }

  private sortersToJson(sorters: any[]): any {
    const sortersJson = [];
    for (const sorter of sorters) {
      sortersJson.push({
        column: sorter.field,
        dir: sorter.dir,
        params: sorter.params
      });
    }
    return sortersJson;
  }
}
