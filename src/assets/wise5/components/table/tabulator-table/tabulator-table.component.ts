import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { Tabulator, EditModule, FormatModule, KeybindingsModule, ReactiveDataModule, SortModule } from 'tabulator-tables';

@Component({
  selector: 'tabulator-table',
  templateUrl: './tabulator-table.component.html',
  styleUrls: ['./tabulator-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabulatorTableComponent implements OnChanges, AfterViewInit {
  @Input() editableCells: any;
  @Input() isDisabled: boolean;
  @Input() tabColumns: any[]; // see http://tabulator.info/docs/5.3/columns
  @Input() tabData: any[]; // see http://tabulator.info/docs/5.3/data
  @Input() tabOptions: any; // see http://tabulator.info/docs/5.3/options
  @Output() cellChanged = new EventEmitter<Tabulator.CellComponent>();
  @ViewChild('table', { static: false }) tableContainer: ElementRef;

  options: any;
  table: Tabulator;
  tableEl = document.createElement('div');
  subscriptions: Subscription = new Subscription();
  viewInit$ = new ReplaySubject();

  constructor() {
    Tabulator.registerModule([EditModule, FormatModule, KeybindingsModule, ReactiveDataModule, SortModule]);
  }
 
  ngAfterViewInit(): void {
    this.options = this.tabOptions;
    this.options.columns = this.setupColumns(this.tabColumns);
    this.options.data = this.tabData;
    this.editableCells = this.editableCells;
    this.table = new Tabulator(this.tableEl, this.options);
    this.table.on('cellEdited', (cell) => {
      this.cellEdited(cell);
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

  private setupColumns(columns): any[] {
    columns.forEach((column) => {
      column.editor = 'input';
      column.editable = (cell) => {
        return this.isDisabled ? false : this.isCellEditable(cell);
      };
      column.formatter = (cell, formatterParams) => {
        return this.cellFormatter(cell, formatterParams);
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
    return row && row.indexOf(field) > -1;
  }

  private cellFormatter(
    cell: Tabulator.CellComponent,
    formatterParams: Tabulator.formatterParams
  ): any {
    if (this.isCellEditable(cell)) {
      cell.getElement().classList.add('tabulator-cell-editable');
    }
    return cell.getValue();
  }

  private processChanges(changes: SimpleChanges): void {
    if (changes['tabColumns']) {
      this.options.columns = this.setupColumns(this.tabColumns);
      this.table.setColumns(this.tabColumns);
    }
    if (changes['tabData']) {
      this.table.setData(this.tabData);
    }
  }

  private cellEdited(cell: Tabulator.CellComponent) {
    this.cellChanged.emit(cell);
  }
}