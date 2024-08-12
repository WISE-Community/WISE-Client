import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ComponentContent } from '../../../common/ComponentContent';
import { ProjectService } from '../../../services/projectService';
import { TabulatorDataService } from '../tabulatorDataService';
import { TableShowWorkComponent } from './table-show-work.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let fixture: ComponentFixture<TableShowWorkComponent>;
let component: TableShowWorkComponent;

describe('TableShowWorkComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [TableShowWorkComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(TableShowWorkComponent);
    const componentContent = {
      id: 'component1',
      isDataExplorerEnabled: false,
      nodeId: 'node1',
      prompt: 'prompt',
      rubric: 'rubric',
      type: 'table'
    } as ComponentContent;
    spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue(componentContent);
    component = fixture.componentInstance;
    component.componentContent = {};
    component.componentState = { studentData: { tableData: [] } };
    fixture.detectChanges();
    component.componentContent = { globalCellSize: 10 };
  });

  calculateColumnNames();
  setupTable();
});

function createCell(text: string): any {
  return { text: text };
}

function createComponentState(tableData: any): any {
  return {
    studentData: {
      tableData: tableData
    }
  };
}

function calculateColumnNames() {
  describe('calculateColumnNames', () => {
    it('should calculate column names', () => {
      const columnName1 = 'Year';
      const columnName2 = 'Price';
      const tableData = [
        [createCell(columnName1), createCell(columnName2)],
        [createCell('2020'), createCell('100')]
      ];
      const componentState = createComponentState(tableData);
      const columnNames = component.calculateColumnNames(componentState);
      expect(columnNames.length).toEqual(2);
      expect(columnNames[0]).toEqual(columnName1);
      expect(columnNames[1]).toEqual(columnName2);
    });
  });
}

function setupTable() {
  describe('setupTable', () => {
    it('should setup table', () => {
      component.tableData = null;
      const convertTableDataToTabulatorSpy = spyOn(
        TestBed.inject(TabulatorDataService),
        'convertTableDataToTabulator'
      );
      component.setupTable();
      expect(convertTableDataToTabulatorSpy).toHaveBeenCalled();
    });
  });
}
