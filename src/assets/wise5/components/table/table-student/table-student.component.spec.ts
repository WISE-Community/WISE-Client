import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { Component } from '../../../common/Component';
import { ProjectService } from '../../../services/projectService';
import { TabulatorDataService } from '../tabulatorDataService';
import { TableStudent } from './table-student.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: TableStudent;
const componentId = 'component1';
let fixture: ComponentFixture<TableStudent>;
const nodeId = 'node1';
const testTableData = createTableData([
  ['Time', 'Position', 'Speed'],
  ['0', '0', '0'],
  ['10', '100', '10'],
  ['20', '200', '10']
]);

describe('TableStudentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [TableStudent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [BrowserModule,
        MatDialogModule,
        NoopAnimationsModule,
        StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(TableStudent);
    spyOn(TestBed.inject(ProjectService), 'isSpaceExists').and.returnValue(false);
    component = fixture.componentInstance;
    const componentContent = {
      cRater: {},
      dataExplorerGraphTypes: [{ name: 'Scatter Plot', value: 'scatter' }],
      dataExplorerDataToColumn: {
        x: 0,
        y: 1,
        y2: 2
      },
      dataExplorerSeriesParams: [
        {
          yAxis: 0
        },
        {
          yAxis: 1
        }
      ],
      id: componentId,
      isDataExplorerEnabled: true,
      isDataExplorerScatterPlotRegressionLineEnabled: false,
      globalCellSize: 10,
      numColumns: 3,
      numDataExplorerSeries: 2,
      numRows: 4,
      prompt: 'Fill in the table.',
      showSaveButton: true,
      showSubmitButton: true,
      tableData: createTestTableData(),
      type: 'Table'
    };
    component.component = new Component(componentContent, nodeId);
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    spyOn(component, 'registerNotebookItemChosenListener').and.callFake(() => {});
    spyOn(component, 'studentDataChanged').and.callFake(() => {});
    fixture.detectChanges();
  });

  appendTable();
  createComponentState();
  createDataExplorerSeries();
  createTableCell();
  createTableRow();
  dataExplorerXColumnChanged();
  dataExplorerYColumnChanged();
  getColumnName();
  getDataExplorerYAxisLabelWhenOneYAxis();
  getTableDataCellValue();
  getXFromDataPoint();
  getYAxisForDataExplorerSeries();
  getYFromDataPoint();
  handleConnectedComponents();
  initializeDataExplorer();
  isAllDataExplorerSeriesSpecified();
  isDataExplorerOneYAxis();
  isTableEmpty();
  isTableReset();
  mergeTableData();
  processConnectedComponentState();
  removeAllCellsFromTableData();
  repopulateDataExplorerData();
  resetTable();
  setDataExplorerSeriesYAxis();
  setDataExplorerXColumnIsDisabled();
  setDataExplorerYAxisLabelWithMultipleYAxes();
  setDataExplorerYColumnIsDisabled();
  setGraphDataIntoTableData();
  setSeriesIntoTable();
  setStudentWork();
  setTableDataCellValue();
  setupTable();
  setXDataToColumn();
  setYDataToColumn();
  updateColumnNames();
  updateDataExplorerSeriesNames();
});

function createCellObject(text: string = '', editable: boolean = true, size: number = null) {
  return {
    editable: editable,
    size: size,
    text: text
  };
}

function createTestTableData() {
  return createTableData([
    ['Time', 'Position', 'Speed'],
    ['0', '0', '0'],
    ['10', '100', '10'],
    ['20', '200', '10']
  ]);
}

function createTableData(rows: any[]): any[] {
  const tableData = [];
  for (const row of rows) {
    const tableDataRow = [];
    for (const cell of row) {
      tableDataRow.push(createCellObject(cell));
    }
    tableData.push(tableDataRow);
  }
  return tableData;
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
      expect(component.tableData).toEqual(createTestTableData());
    });
  });
}

function setStudentWork() {
  describe('setStudentWork', () => {
    it('should set student work', () => {
      const tableData = [[createCellObject('Time'), createCellObject('Position')]];
      const componentState = {
        studentData: {
          tableData: tableData
        }
      };
      component.setStudentWork(componentState);
      expect(component.tableData).toEqual(tableData);
    });
  });
}

function resetTable() {
  describe('resetTable', () => {
    it('should reset table', () => {
      component.tableData = createTestTableData();
      component.tableData[0][0].text = 'Time2';
      const convertTableDataToTabulatorSpy = spyOn(
        TestBed.inject(TabulatorDataService),
        'convertTableDataToTabulator'
      );
      component.resetTable();
      expect(component.tableData[0][0].text).toEqual('Time');
      expect(convertTableDataToTabulatorSpy).toHaveBeenCalled();
    });
  });
}

function createComponentState() {
  describe('createComponentState', () => {
    it(
      'should create component state',
      waitForAsync(() => {
        component.createComponentState('save').then((componentState: any) => {
          expect(componentState.componentId).toEqual(componentId);
          expect(componentState.nodeId).toEqual(nodeId);
          expect(componentState.studentData.tableData).toEqual(
            component.componentContent.tableData
          );
        });
      })
    );
  });
}

function createTableCell() {
  describe('createTableCell', () => {
    it('should create table cell', () => {
      const text = 'Hello';
      const editable = true;
      const size = 10;
      const cell = component.createTableCell(text, editable, size);
      expect(cell.text).toEqual(text);
      expect(cell.editable).toEqual(editable);
      expect(cell.size).toEqual(size);
    });
  });
}

function createTableRow() {
  describe('createTableRow', () => {
    it('should create table row from string array', () => {
      const columns = ['ID', 'Product', 'Price'];
      const row = component.createTableRow(columns);
      expectRowTextValues(row, columns);
    });
    it('should create table row from object array', () => {
      const columns = [
        { text: 'ID', editable: true, size: 10 },
        { text: 'Product', editable: true, size: 10 },
        { text: 'Price', editable: true, size: 10 }
      ];
      const row = component.createTableRow(columns);
      expectRowObjectValues(row, columns);
    });
  });
}

function expectRowTextValues(row: any[], expectedTextValues: string[]) {
  for (let c = 0; c < expectedTextValues.length; c++) {
    expect(row[c].text).toEqual(expectedTextValues[c]);
  }
}

function expectRowObjectValues(row: any[], expectedObjectValues: any[]) {
  for (let c = 0; c < expectedObjectValues.length; c++) {
    expect(row[c].text).toEqual(expectedObjectValues[c].text);
    expect(row[c].editable).toEqual(expectedObjectValues[c].editable);
    expect(row[c].size).toEqual(expectedObjectValues[c].size);
  }
}

function createTableComponentState(data: any[]): any {
  return {
    componentType: 'Table',
    studentData: {
      tableData: data
    }
  };
}

function createGraphComponentState(data: any[]): any {
  return {
    componentType: 'Graph',
    studentData: {
      trials: [
        {
          series: [
            {
              data: data
            }
          ]
        }
      ],
      version: 2
    }
  };
}

function createEmbeddedComponentState(data: any[]): any {
  return {
    componentType: 'Embedded',
    studentData: {
      tableData: data
    }
  };
}

function setGraphDataIntoTableData() {
  describe('setGraphDataIntoTableData', () => {
    it('should set graph data into table data', () => {
      const componentState = createGraphComponentState([
        ['0', '0'],
        ['1', '10'],
        ['2', '20']
      ]);
      component.setGraphDataIntoTableData(componentState, null);
      const expectedTableData = createTableData([
        ['Time', 'Position', 'Speed'],
        ['0', '0', '0'],
        ['1', '10', '10'],
        ['2', '20', '10']
      ]);
      expectTableDataEquals(component.tableData, expectedTableData, true);
    });
  });
}

function setSeriesIntoTable() {
  describe('setSeriesIntoTable', () => {
    it('should set series into table', () => {
      const series = {
        data: [
          ['0', '0'],
          ['1', '10'],
          ['2', '20']
        ]
      };
      component.setSeriesIntoTable(series);
      const expectedTableData = createTableData([
        ['Time', 'Position', 'Speed'],
        ['0', '0', '0'],
        ['1', '10', '10'],
        ['2', '20', '10']
      ]);
      expectTableDataEquals(component.tableData, expectedTableData, true);
    });
  });
}

function expectTableDataEquals(
  tableData: any[],
  expectedTableData: any[],
  expectedIsEquals: boolean
) {
  expect(tableDataEquals(tableData, expectedTableData)).toEqual(expectedIsEquals);
}

function tableDataEquals(table1: any, table2: any): boolean {
  if (table1.length !== table2.length) {
    return false;
  } else {
    for (let r = 0; r < table1.length; r++) {
      for (let c = 0; c < table1[r].length; c++) {
        if (table1[r][c].text !== table2[r][c].text) {
          return false;
        }
      }
    }
  }
  return true;
}

function updateColumnNames() {
  describe('updateColumnNames', () => {
    it('should update column names', () => {
      component.columnNames = [];
      component.updateColumnNames();
      expect(component.columnNames).toEqual(['Time', 'Position', 'Speed']);
    });
  });
}

function getColumnName() {
  describe('getColumnName', () => {
    it('should get column name', () => {
      expect(component.getColumnName(0)).toEqual('Time');
      expect(component.getColumnName(1)).toEqual('Position');
      expect(component.getColumnName(2)).toEqual('Speed');
    });
  });
}

function repopulateDataExplorerData() {
  describe('repopulateDataExplorerData', () => {
    it('should repopulate data explorer data', () => {
      const dataExplorerGraphType = 'scatter';
      const dataExplorerXAxisLabel = 'Time';
      const dataExplorerYAxisLabel = '';
      const dataExplorerYAxisLabels = ['Position', 'Speed'];
      const dataExplorerSeries = [
        {
          name: 'Position',
          xColumn: 0,
          yAxis: 0,
          yColumn: 1
        }
      ];
      const componentState = {
        studentData: {
          dataExplorerGraphType: dataExplorerGraphType,
          dataExplorerXAxisLabel: dataExplorerXAxisLabel,
          dataExplorerYAxisLabel: dataExplorerYAxisLabel,
          dataExplorerYAxisLabels: dataExplorerYAxisLabels,
          dataExplorerSeries: dataExplorerSeries
        }
      };
      component.repopulateDataExplorerData(componentState);
      expect(component.dataExplorerGraphType).toEqual(dataExplorerGraphType);
      expect(component.dataExplorerXAxisLabel).toEqual(dataExplorerXAxisLabel);
      expect(component.dataExplorerYAxisLabel).toEqual(dataExplorerYAxisLabel);
      expect(component.dataExplorerYAxisLabels).toEqual(dataExplorerYAxisLabels);
      expect(component.dataExplorerSeries).toEqual(dataExplorerSeries);
    });
  });
}

function isTableReset() {
  describe('isTableReset', () => {
    it('should check if table is reset when it is not', () => {
      component.setTableDataCellValue(0, 0, component.tableData, '');
      expect(component.isTableReset()).toEqual(false);
    });
    it('should check if table is reset when it is', () => {
      expect(component.isTableReset()).toEqual(true);
    });
  });
}

function isTableEmpty() {
  describe('isTableEmpty', () => {
    it('should check if table is empty when it is not', () => {
      component.tableData = createTableData([
        ['Time', 'Position'],
        ['0', '0']
      ]);
      expect(component.isTableEmpty()).toEqual(false);
    });
    it('should check if table is empty when it is', () => {
      component.tableData = createTableData([['']]);
      expect(component.isTableEmpty()).toEqual(true);
    });
  });
}

function getTableDataCellValue() {
  describe('getTableDataCellValue', () => {
    it('should get table data cell value', () => {
      expect(component.getTableDataCellValue(0, 0)).toEqual('Time');
    });
  });
}

function setTableDataCellValue() {
  describe('setTableDataCellValue', () => {
    it('should set table data cell value', () => {
      expect(component.tableData[0][0].text).toEqual('Time');
      component.setTableDataCellValue(0, 0, null, 'Temperature');
      expect(component.tableData[0][0].text).toEqual('Temperature');
    });
  });
}

function getXFromDataPoint() {
  describe('getXFromDataPoint', () => {
    it('should get x from object data point', () => {
      const dataPoint = { x: 0, y: 10 };
      expect(component.getXFromDataPoint(dataPoint)).toEqual(0);
    });
    it('should get x from array data point', () => {
      const dataPoint = [0, 10];
      expect(component.getXFromDataPoint(dataPoint)).toEqual(0);
    });
  });
}

function getYFromDataPoint() {
  describe('getYFromDataPoint', () => {
    it('should get y from object data point', () => {
      const dataPoint = { x: 0, y: 10 };
      expect(component.getYFromDataPoint(dataPoint)).toEqual(10);
    });
    it('should get y from array data point', () => {
      const dataPoint = [0, 10];
      expect(component.getYFromDataPoint(dataPoint)).toEqual(10);
    });
  });
}

function createDataExplorerSeries() {
  describe('createDataExplorerSeries', () => {
    it('should create data explorer series', () => {
      component.dataExplorerSeries = [];
      component.createDataExplorerSeries();
      expect(component.dataExplorerSeries.length).toEqual(2);
      expect(component.dataExplorerSeries[0]).toEqual({ xColumn: null, yColumn: null, yAxis: 0 });
      expect(component.dataExplorerSeries[1]).toEqual({ xColumn: null, yColumn: null, yAxis: 1 });
    });
  });
}

function setXDataToColumn() {
  describe('setXDataToColumn', () => {
    it('should set x data to column', () => {
      component.createDataExplorerSeries();
      component.setXDataToColumn(0, 0);
      expect(component.dataExplorerSeries[0].xColumn).toEqual(0);
      expect(component.dataExplorerXColumn).toEqual(0);
      expect(component.dataExplorerColumnToIsDisabled['x']).toEqual(true);
      expect(component.dataExplorerXAxisLabel).toEqual('Time');
    });
  });
}

function setYDataToColumn() {
  describe('setYDataToColumn', () => {
    it('should set y data to column', () => {
      component.createDataExplorerSeries();
      component.setYDataToColumn(0, 1);
      expect(component.dataExplorerSeries[0].yColumn).toEqual(1);
      expect(component.dataExplorerSeries[0].name).toEqual('Position');
      expect(component.dataExplorerColumnToIsDisabled['y']).toEqual(true);
      expect(component.dataExplorerYAxisLabel).toEqual('Position');
    });
  });
}

function setDataExplorerXColumnIsDisabled() {
  describe('setDataExplorerXColumnIsDisabled', () => {
    it('should set data explorer x column is disabled', () => {
      delete component.dataExplorerColumnToIsDisabled['x'];
      component.setDataExplorerXColumnIsDisabled();
      expect(component.dataExplorerColumnToIsDisabled['x']).toEqual(true);
    });
  });
}

function setDataExplorerYColumnIsDisabled() {
  describe('setDataExplorerYColumnIsDisabled', () => {
    it('should set data explorer y column is disabled when column number is 1', () => {
      delete component.dataExplorerColumnToIsDisabled['y'];
      component.setDataExplorerYColumnIsDisabled(1);
      expect(component.dataExplorerColumnToIsDisabled['y']).toEqual(true);
    });
    it('should set data explorer y column is disabled when column number is greater than 1', () => {
      delete component.dataExplorerColumnToIsDisabled['y2'];
      component.setDataExplorerYColumnIsDisabled(2);
      expect(component.dataExplorerColumnToIsDisabled['y2']).toEqual(true);
    });
  });
}

function handleConnectedComponents() {
  describe('handleConnectedComponents', () => {
    it('should handle table connected component', () => {
      spyOn(component, 'getConnectedComponentsAndTheirComponentStates').and.returnValue([
        {
          connectedComponent: {},
          componentState: createTableComponentState(testTableData)
        }
      ]);
      component.tableData = null;
      const convertTableDataToTabulatorSpy = spyOn(
        TestBed.inject(TabulatorDataService),
        'convertTableDataToTabulator'
      );
      component.handleConnectedComponents();
      expectTableDataEquals(component.tableData, testTableData, true);
      expect(convertTableDataToTabulatorSpy).toHaveBeenCalled();
    });
    it('should handle graph connected component', () => {
      spyOn(component, 'getConnectedComponentsAndTheirComponentStates').and.returnValue([
        {
          connectedComponent: {},
          componentState: createGraphComponentState([
            ['0', '0'],
            ['1', '10'],
            ['2', '20']
          ])
        }
      ]);
      const convertTableDataToTabulatorSpy = spyOn(
        TestBed.inject(TabulatorDataService),
        'convertTableDataToTabulator'
      );
      component.handleConnectedComponents();
      const expectedTableData = createTableData([
        ['Time', 'Position', 'Speed'],
        ['0', '0', '0'],
        ['1', '10', '10'],
        ['2', '20', '10']
      ]);
      expectTableDataEquals(component.tableData, expectedTableData, true);
      expect(convertTableDataToTabulatorSpy).toHaveBeenCalled();
    });
    it('should handle embedded connected component', () => {
      const tableData = createTableData([
        ['Time', 'Position'],
        ['100', '200']
      ]);
      spyOn(component, 'getConnectedComponentsAndTheirComponentStates').and.returnValue([
        {
          connectedComponent: {},
          componentState: createEmbeddedComponentState(tableData)
        }
      ]);
      const convertTableDataToTabulatorSpy = spyOn(
        TestBed.inject(TabulatorDataService),
        'convertTableDataToTabulator'
      );
      component.handleConnectedComponents();
      expectTableDataEquals(component.tableData, tableData, true);
      expect(convertTableDataToTabulatorSpy).toHaveBeenCalled();
    });
  });
}

function isAllDataExplorerSeriesSpecified() {
  describe('isAllDataExplorerSeriesSpecified', () => {
    it('should check if all data explorer series are specified when it is', () => {
      component.dataExplorerSeries = [
        { xColumn: 0, yColumn: 1 },
        { xColumn: 0, yColumn: 2 }
      ];
      expect(component.isAllDataExplorerSeriesSpecified()).toEqual(true);
    });
    it('should check if all data explorer series are specified when it is not', () => {
      component.dataExplorerSeries = [
        { xColumn: 0, yColumn: 1 },
        { xColumn: 0, yColumn: null }
      ];
      expect(component.isAllDataExplorerSeriesSpecified()).toEqual(false);
    });
  });
}

function processConnectedComponentState() {
  describe('processConnectedComponentState', () => {
    beforeEach(() => {
      spyOn(component.component, 'getConnectedComponent').and.returnValue({
        nodeId: nodeId,
        componentId: componentId
      });
    });
    it('should process table connected component state', () => {
      const componentState = {
        componentId: 'component2',
        nodeId: nodeId,
        studentData: {
          tableData: testTableData
        }
      };
      spyOn(TestBed.inject(ProjectService), 'getComponentType').and.returnValue('Table');
      component.tableData = null;
      component.processConnectedComponentState(componentState);
      expect(component.tableData).toEqual(testTableData);
    });
    it('should process graph connected component state', () => {
      const componentState = {
        componentId: 'component2',
        nodeId: nodeId,
        studentData: {}
      };
      spyOn(TestBed.inject(ProjectService), 'getComponentType').and.returnValue('Graph');
      const setGraphDataIntoTableDataSpy = spyOn(component, 'setGraphDataIntoTableData');
      component.processConnectedComponentState(componentState);
      expect(setGraphDataIntoTableDataSpy).toHaveBeenCalled();
    });
  });
}

function appendTable() {
  describe('appendTable', () => {
    it('should append table', () => {
      expect(component.tableData.length).toEqual(4);
      component.appendTable(createTableData([['30', '300', '10']]));
      expect(component.tableData.length).toEqual(5);
      const expectedTableData = createTableData([
        ['Time', 'Position', 'Speed'],
        ['0', '0', '0'],
        ['10', '100', '10'],
        ['20', '200', '10'],
        ['30', '300', '10']
      ]);
      expect(tableDataEquals(component.tableData, expectedTableData)).toEqual(true);
    });
  });
}

function mergeTableData() {
  describe('mergeTableData', () => {
    it('should merge table data', () => {
      const newTableData = createTableData([
        ['', '', 'Landmark'],
        ['', '', 'Start'],
        ['', '', '100 Meters'],
        ['', '', '200 Meters']
      ]);
      component.mergeTableData(newTableData);
      const expectedTableData = createTableData([
        ['Time', 'Position', 'Landmark'],
        ['0', '0', 'Start'],
        ['10', '100', '100 Meters'],
        ['20', '200', '200 Meters']
      ]);
      expect(tableDataEquals(component.tableData, expectedTableData)).toEqual(true);
    });
  });
}

function dataExplorerXColumnChanged() {
  describe('dataExplorerXColumnChanged', () => {
    it('should handle data explorer x column changed', () => {
      for (const series of component.dataExplorerSeries) {
        expect(series.xColumn).toEqual(0);
      }
      component.dataExplorerXColumn = 1;
      component.dataExplorerXColumnChanged();
      for (const series of component.dataExplorerSeries) {
        expect(series.xColumn).toEqual(1);
      }
    });
  });
}

function dataExplorerYColumnChanged() {
  describe('dataExplorerYColumnChanged', () => {
    it('should handle data explorer y column changed', () => {
      expect(component.dataExplorerSeries[0].name).toEqual('Position');
      component.dataExplorerSeries[0].yColumn = 2;
      component.dataExplorerYColumnChanged(0);
      expect(component.dataExplorerSeries[0].name).toEqual('Speed');
    });
  });
}

function removeAllCellsFromTableData() {
  describe('removeAllCellsFromTableData', () => {
    it('should remove all cells from table data', () => {
      expect(component.tableData).not.toEqual([]);
      component.removeAllCellsFromTableData();
      expect(component.tableData).toEqual([]);
    });
  });
}

function updateDataExplorerSeriesNames() {
  describe('updateDataExplorerSeriesNames', () => {
    it('should update data explorer series names', () => {
      expect(component.dataExplorerSeries[0].name).toEqual('Position');
      expect(component.dataExplorerSeries[1].name).toEqual('Speed');
      component.dataExplorerSeries[0].yColumn = 0;
      component.dataExplorerSeries[1].yColumn = 1;
      component.updateDataExplorerSeriesNames();
      expect(component.dataExplorerSeries[0].name).toEqual('Time');
      expect(component.dataExplorerSeries[1].name).toEqual('Position');
    });
  });
}

function isDataExplorerOneYAxis() {
  describe('isDataExplorerOneYAxis', () => {
    it('should check if data explorer only has one y axis when there is only one y axis', () => {
      component.componentContent.numDataExplorerYAxis = 1;
      expect(component.isDataExplorerOneYAxis()).toEqual(true);
    });
    it('should check if data explorer only has one y axis when there are multiple y axes', () => {
      component.componentContent.numDataExplorerYAxis = 2;
      expect(component.isDataExplorerOneYAxis()).toEqual(false);
    });
  });
}

function getDataExplorerYAxisLabelWhenOneYAxis() {
  describe('getDataExplorerYAxisLabelWhenOneYAxis', () => {
    it('should get data explorer y axis label when there is one y axis', () => {
      expect(component.getDataExplorerYAxisLabelWhenOneYAxis()).toEqual('Position <br/> Speed');
    });
  });
}

function setDataExplorerSeriesYAxis() {
  describe('setDataExplorerSeriesYAxis', () => {
    it('should set data explorer series y axis', () => {
      expect(component.dataExplorerSeries[0].yAxis).toEqual(0);
      component.dataExplorerSeriesParams[0].yAxis = 1;
      component.setDataExplorerSeriesYAxis(0);
      expect(component.dataExplorerSeries[0].yAxis).toEqual(1);
    });
  });
}

function setDataExplorerYAxisLabelWithMultipleYAxes() {
  describe('setDataExplorerYAxisLabelWithMultipleYAxes', () => {
    it('should set data explorer y axis label with multiple y axes', () => {
      expect(component.dataExplorerYAxisLabels[0]).toEqual('');
      const newLabel = 'Temperature';
      component.setDataExplorerYAxisLabelWithMultipleYAxes(0, newLabel);
      expect(component.dataExplorerYAxisLabels[0]).toEqual(newLabel);
    });
  });
}

function getYAxisForDataExplorerSeries() {
  describe('getYAxisForDataExplorerSeries', () => {
    it('should get y axis for data explorer series', () => {
      expect(component.getYAxisForDataExplorerSeries(0)).toEqual(0);
    });
  });
}

function initializeDataExplorer() {
  describe('initializeDataExplorer', () => {
    it('should initialize data explorer', () => {
      component.numDataExplorerSeries = null;
      component.dataExplorerGraphTypes = null;
      component.dataExplorerGraphType = null;
      component.isDataExplorerScatterPlotRegressionLineEnabled = null;
      component.dataExplorerYAxisLabels = null;
      component.dataExplorerSeriesParams = null;
      component.initializeDataExplorer();
      expect(component.numDataExplorerSeries).toEqual(
        component.componentContent.numDataExplorerSeries
      );
      expect(component.dataExplorerGraphTypes).toEqual(
        component.componentContent.dataExplorerGraphTypes
      );
      expect(component.dataExplorerGraphType).toEqual(
        component.componentContent.dataExplorerGraphTypes[0].value
      );
      expect(component.isDataExplorerScatterPlotRegressionLineEnabled).toEqual(
        component.componentContent.isDataExplorerScatterPlotRegressionLineEnabled
      );
      expect(component.dataExplorerYAxisLabels).toEqual(['']);
      expect(component.dataExplorerSeriesParams).toEqual(
        component.componentContent.dataExplorerSeriesParams
      );
    });
  });
}
