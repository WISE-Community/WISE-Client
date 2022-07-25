import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { Tabulator, EditModule, FormatModule, KeybindingsModule, SortModule } from 'tabulator-tables';
import { TabulatorData } from '../TabulatorData';

@Component({
  selector: 'tabulator-table',
  templateUrl: './tabulator-table.component.html',
  styleUrls: ['./tabulator-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabulatorTableComponent implements OnChanges, AfterViewInit {
  @Input() tabData: TabulatorData;
  @ViewChild('table', { static: false }) tableContainer: ElementRef;

  editableCells: any;
  options: any;
  tableEl = document.createElement('div');
  afterViewInitSubscription: Subscription;
  viewInit$ = new ReplaySubject();

  constructor() {
    Tabulator.registerModule([EditModule, FormatModule, KeybindingsModule, SortModule]);
  }

  ngAfterViewInit(): void {
    this.viewInit$.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.afterViewInitSubscription = this.viewInit$.subscribe(() => {
      this.options = this.tabData.options;
      this.options.columns = this.tabData.columns;
      this.options.columns.forEach((column) => {
        column.editor = 'input';
        column.editable = editCheck;
        column.formatter = cellFormatter;
        column.sorter = 'alphanum';
        column.sorterParams = {
          alignEmptyValues: 'bottom',
        }
      });
      this.options.data = this.tabData.data;
      this.editableCells = this.tabData.editableCells;
      this.drawTable();
    });

    const cellFormatter = (cell, formatterParams) => {
      if (this.isCellEditable(cell)) {
        cell.getElement().classList.add('tabulator-cell-editable');
      }
      return cell.getValue();
    };

    const editCheck = (cell) => {
      return this.isCellEditable(cell);
    };
  }

  isCellEditable(cell) {
    const rowIndex = cell.getRow().getPosition();
    const field = cell.getColumn().getField();
    const row = this.editableCells[rowIndex];
    if (row && row.indexOf(field) > -1) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
    this.afterViewInitSubscription.unsubscribe();
  }

  private drawTable(): void {
    new Tabulator(this.tableEl, this.options);
    this.tableContainer.nativeElement.innerHtml = '';
    this.tableContainer.nativeElement.appendChild(this.tableEl);
  }
}