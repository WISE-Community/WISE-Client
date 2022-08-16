import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
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
  @Input() selectedRowIndeces: number[] = [];
  @Input() tabColumns: TabulatorColumn[]; // see http://tabulator.info/docs/5.3/columns
  @Input() tabData: any[]; // see http://tabulator.info/docs/5.3/data
  @Input() tabOptions: any; // see http://tabulator.info/docs/5.3/options
  @Output() cellChanged = new EventEmitter<Tabulator.CellComponent>();
  @Output() rowSelectionChanged = new EventEmitter<Tabulator.CellComponent>();
  @ViewChild('table', { static: false }) tableContainer: ElementRef;

  table: Tabulator;
  tableBuilt: boolean = false;
  tableEl = document.createElement('div');
  subscriptions: Subscription = new Subscription();
  viewInit$ = new ReplaySubject();

  constructor() {
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
    if (this.enableRowSelection) {
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
    this.tabOptions.data = this.tabData;
    this.table = new Tabulator(this.tableEl, this.tabOptions);
    this.table.on('cellEdited', (cell) => {
      this.cellChanged.emit(cell);
    });
    this.table.on('tableBuilt', () => {
      this.onTableBuilt();
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

  private processChanges(changes: SimpleChanges): void {
    if (changes['tabColumns'] && !changes['tabColumns'].isFirstChange()) {
      this.table.setColumns(this.setupColumns(this.tabColumns));
    }
    if (changes['tabData'] && !changes['tabData'].isFirstChange()) {
      this.table.setData(this.tabData);
    }
    if (changes['selectedRowIndeces'] && !changes['selectedRowIndeces'].isFirstChange()) {
      this.processSelectedRowChanges(changes['selectedRowIndeces']);
    }
  }

  private onTableBuilt(): void {
    if (this.enableRowSelection) {
      if (this.selectedRowIndeces != null && this.selectedRowIndeces.length > 0) {
        this.table.selectRow(this.selectedRowIndeces);
      }
      this.table.on('rowSelectionChanged', (data, rows) => {
        this.rowSelectionChanged.emit(rows);
      });
    }
  }

  processSelectedRowChanges(change: SimpleChange): void {
    const currentChange = change.currentValue;
  }
}
