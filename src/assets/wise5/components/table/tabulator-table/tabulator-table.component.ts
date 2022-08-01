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
  KeybindingsModule,
  ReactiveDataModule,
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
  @Input() isDisabled: boolean;
  @Input() tabColumns: TabulatorColumn[]; // see http://tabulator.info/docs/5.3/columns
  @Input() tabData: any[]; // see http://tabulator.info/docs/5.3/data
  @Input() tabOptions: any; // see http://tabulator.info/docs/5.3/options
  @Output() cellChanged = new EventEmitter<Tabulator.CellComponent>();
  @ViewChild('table', { static: false }) tableContainer: ElementRef;

  table: Tabulator;
  tableEl = document.createElement('div');
  subscriptions: Subscription = new Subscription();
  viewInit$ = new ReplaySubject();

  constructor() {
    Tabulator.registerModule([
      EditModule,
      FormatModule,
      KeybindingsModule,
      ReactiveDataModule,
      SortModule
    ]);
  }

  ngAfterViewInit(): void {
    this.tabOptions.columns = this.setupColumns(this.tabColumns);
    this.tabOptions.data = this.tabData;
    this.table = new Tabulator(this.tableEl, this.tabOptions);
    this.table.on('cellEdited', (cell) => {
      this.cellChanged.emit(cell);
    });
    this.tableContainer.nativeElement.appendChild(this.tableEl);
    this.viewInit$.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.subscriptions.add(
      this.viewInit$.subscribe(() => {
        if (!changes.tabData.isFirstChange()) {
          this.processChanges(changes);
        }
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
        return this.isDisabled ? false : this.isCellEditable(cell);
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
    const rowIndex = cell.getRow().getPosition();
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
    if (changes['tabColumns']) {
      this.table.setColumns(this.setupColumns(this.tabColumns));
    }
    if (changes['tabData']) {
      this.table.setData(this.tabData);
    }
  }
}
