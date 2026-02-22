import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentContent } from '../../../common/ComponentContent';
import { ProjectService } from '../../../services/projectService';
import { TabulatorDataService } from '../tabulatorDataService';
import { TableShowWorkComponent } from './table-show-work.component';
import { MockComponent, MockProviders } from 'ng-mocks';
import { NodeService } from '../../../services/nodeService';
import { TabulatorTableComponent } from '../tabulator-table/tabulator-table.component';
import { TabulatorData } from '../TabulatorData';

let fixture: ComponentFixture<TableShowWorkComponent>;
let component: TableShowWorkComponent;
describe('TableShowWorkComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableShowWorkComponent, MockComponent(TabulatorTableComponent)],
      providers: [MockProviders(NodeService, ProjectService, TabulatorDataService)]
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
    const projectService = TestBed.inject(ProjectService);
    spyOn(projectService, 'getComponent').and.returnValue(componentContent);
    spyOn(projectService, 'injectAssetPaths').and.callFake((arg) => arg);
    spyOn(TestBed.inject(TabulatorDataService), 'convertTableDataToTabulator').and.returnValue(
      {} as TabulatorData
    );
    component = fixture.componentInstance;
    component.componentContent = {};
    component.componentState = { studentData: { tableData: [] } };
    fixture.detectChanges();
    component.componentContent = { globalCellSize: 10 };
  });

  calculateColumnNames();
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
      const columnNames = component['calculateColumnNames'](componentState);
      expect(columnNames.length).toEqual(2);
      expect(columnNames[0]).toEqual(columnName1);
      expect(columnNames[1]).toEqual(columnName2);
    });
  });
}
