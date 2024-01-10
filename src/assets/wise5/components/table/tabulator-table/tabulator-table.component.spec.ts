import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabulatorTableComponent } from './tabulator-table.component';
import { Tabulator } from 'tabulator-tables';
import { TabulatorColumn } from '../TabulatorData';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';

let component: TabulatorTableComponent;
let fixture: ComponentFixture<TabulatorTableComponent>;
let element: Element;
const editableCells = {
  0: ['1', '2'],
  1: ['1', '2'],
  2: ['1', '2']
};
const tabColumns = [
  new TabulatorColumn({ title: 'Age', field: '0' }),
  new TabulatorColumn({ title: 'Height', field: '1' }),
  new TabulatorColumn({ title: 'Hours homework per day', field: '2', width: 200 })
];
const tabData = [
  { 0: '6', 1: '36', 2: '' },
  { 0: '10', 1: '', 2: '' },
  { 0: '12', 1: '', 2: '' }
];
const tabOptions = {
  layout: 'fitDataTable',
  maxHeight: '500px',
  reactiveData: true
};

describe('TabulatorTableComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudentTeacherCommonServicesModule],
      declarations: [TabulatorTableComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(TabulatorTableComponent);
    component = fixture.componentInstance;
    component.tabColumns = tabColumns;
    component.tabData = tabData;
    component.tabOptions = tabOptions;
    component.editableCells = editableCells;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterViewInit();
  onChanges();
});

function afterViewInit() {
  describe('afterViewInit', () => {
    it('should create Tabulator table after view is initialized', async () => {
      component.table.on('tableBuilt', () => {
        expect(component.table.getRows().length).toBe(3);
        expect(component.table.getColumns().length).toBe(3);
        expect(component.table.getRows()[0].getCell(1).getValue()).toBe('36');
      });
    });
  });
}

function onChanges() {
  describe('onChanges', () => {
    it('should update Tabulator columns and data on changes', async () => {
      component.table = new Tabulator(component.tableEl, {});
      component.table.on('tableBuilt', () => {
        const newTabColumns = [
          { title: 'Age', field: '0' },
          { title: 'Height', field: '1' }
        ];
        const newTabData = [
          { 0: '10', 1: '', 2: '' },
          { 0: '12', 1: '', 2: '' }
        ];
        component.ngOnChanges({
          tabColumns: new SimpleChange(null, newTabColumns, false),
          tabData: new SimpleChange(null, newTabData, false)
        });
        component.table.on('dataChanged', function (data) {
          expect(component.table.getRows().length).toBe(2);
          expect(component.table.getColumns().length).toBe(2);
          expect(component.table.getRows()[0].getCell(0).getValue()).toBe('10');
        });
        fixture.detectChanges();
      });
    });
  });
}
