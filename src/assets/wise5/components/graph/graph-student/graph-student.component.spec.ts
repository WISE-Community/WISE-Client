import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Point } from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ProjectService } from '../../../services/projectService';
import { GraphStudent } from './graph-student.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { Component } from '../../../common/Component';
import { XPlotLine } from '../domain/xPlotLine';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: GraphStudent;
const componentId = 'component1';
let fixture: ComponentFixture<GraphStudent>;
const nodeId = 'node1';
const sampleData = [
  [0, 0],
  [10, 20]
];
let studentDataChangedSpy: jasmine.Spy;

describe('GraphStudentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphStudent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        BrowserModule,
        HighchartsChartModule,
        MatDialogModule,
        NoopAnimationsModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    fixture = TestBed.createComponent(GraphStudent);
    spyOn(TestBed.inject(ProjectService), 'isSpaceExists').and.returnValue(false);
    component = fixture.componentInstance;
    const componentContent = createComponentContent();
    component.component = new Component(componentContent, nodeId);
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    spyOn(component, 'registerNotebookItemChosenListener').and.callFake(() => {});
    spyOn(component, 'createChartCallback').and.callFake(() => {
      return () => {};
    });
    studentDataChangedSpy = spyOn(component, 'studentDataChanged');
    studentDataChangedSpy.and.callFake(() => {});
    fixture.detectChanges();
  });

  addPointToSeries();
  convertRowDataToSeriesData();
  checkIfASeriesIsEditable();
  checkIfASeriesIsEmpty();
  checkIfASeriesIsTheActiveSeries();
  checkIfATrialHasAnEmptySeries();
  checkIfThereIsAnEditableSeries();
  checkIfYAxisIsLockedWithMultipleYAxesFalse();
  checkIfYAxisIsLockedWithMultipleYAxesTrue();
  checkIfYAxisIsLockedWithOneYAxisFalse();
  checkIfYAxisIsLockedWithOneYAxisTrue();
  clearSeriesIds();
  clickUndo();
  convertNullSelectedCellsToEmptyArrayOfTrialIds();
  convertSelectedCellsToTrialIds();
  copyASeries();
  copyNameIntoTrial();
  copySeriesIntoTrial();
  createANewTrial();
  createANewTrialObject();
  createChartConfig();
  createComponentState();
  createTheChartConfig();
  deleteTrial();
  deleteTrialById();
  deleteTrialsById();
  getEventYValueWhenThereIsOneYAxis();
  getEventYValueWhenThereAreMultipleYAxes();
  getHighestTrial();
  getMinMaxValues();
  getNextSeriesId();
  getSeriesByIndex();
  getSeriesYAxisIndexWhenItHasItSet();
  getSeriesYAxisIndexWhenItHasNoneSet();
  getTheHighestShownTrial();
  getTheLatestEditableSeriesIndex();
  getTheLatestMouseOverPointX();
  getTheLatestMouseOverPointY();
  getTheLatestStudentDataTrial();
  getTheTrialById();
  getTheTrialIndex();
  getTheXColumnValueFromParams();
  getTheXValueFromDataPoint();
  getTheYColumnValueFromParams();
  getTheYValueFromDataPoint();
  getTrialNumbers();
  handleDeleteKeyPressed();
  handleTableConnectedComponentStudentDataChanged();
  handleTrialIdsToShowChanged();
  handleTrialIdsToShowChangedWhenTheLatestTrialIsNotEditable();
  hideAllTrials();
  importGraphSettings();
  isTrialHasEmptySeries();
  isYAxisLocked();
  makePointsUnique();
  makeSureXIsWithinXMinMaxLimits();
  makeSureYIsWithinYMinMaxLimits();
  makeTheHighestTrialActive();
  mergeComponentState();
  mouseDownEventOccurred();
  newTrial();
  notCreateNewTrialWhenNotNecessary();
  notSetTheActiveTrialAndSeriesIfTheTrialCanNotBeEdited();
  parseLatestTrial();
  performRounding();
  readCSVIntoActiveSeries();
  readTheConnectedComponentField();
  removeDefaultTrialIfNecessary();
  resetSeriesHelper();
  setActiveTrialAndSeriesByTrialIdsToShow();
  setStudentWork();
  setTheDefaultActiveSeries();
  setTheTrialIdsToShow();
  showOrHideTrials();
  showTrialsAndHideTheCurrentlyActiveTrial();
  turnOffXAxisDecimals();
  turnOffYAxisDecimalsWhenThereIsOneYAxis();
  turnOffYAxisDecimalsWhenThereAreMultipleYAxes();
  undoClicked();
  updateMinMaxAxisValues();
});

function createComponentContent() {
  return {
    id: componentId,
    type: 'Graph',
    prompt: 'Plot points on the graph.',
    showSaveButton: false,
    showSubmitButton: false,
    graphType: 'line',
    xAxis: {
      title: {
        text: 'Time (seconds)'
      },
      min: 0,
      max: 100,
      units: 's',
      locked: true,
      type: 'limits'
    },
    yAxis: {
      title: {
        text: 'Position (meters)'
      },
      min: 0,
      max: 100,
      units: 'm',
      locked: true
    },
    series: [
      {
        id: 'series-0',
        name: 'Prediction',
        data: [],
        color: 'blue',
        canEdit: true
      }
    ],
    showMouseXPlotLine: true
  };
}

function isYAxisLocked() {
  describe('isYAxisLocked', () => {
    it('should check if y axis is locked when there is one y axis and it is not locked', () => {
      component.componentContent.yAxis.locked = true;
      expect(component.isYAxisLocked()).toEqual(true);
    });
    it('should check if y axis is locked when there is one y axis and it is locked', () => {
      component.componentContent.yAxis.locked = false;
      expect(component.isYAxisLocked()).toEqual(false);
    });
    it(`should check if y axis is locked when there are multiple y axes and they are all not
        locked`, () => {
      expectIsMultipleYAxisLocked(true, true, true);
    });
    it(`should check if y axis is locked when there are multiple y axes and one is locked and one is
        not locked`, () => {
      expectIsMultipleYAxisLocked(true, false, false);
    });
    it(`should check if y axis is locked when there are multiple y axes and they are all
        locked`, () => {
      expectIsMultipleYAxisLocked(false, false, false);
    });
  });
}

function expectIsMultipleYAxisLocked(
  isYAxis1Locked: boolean,
  isYAxis2Locked: boolean,
  expectedIsYAxisLocked
) {
  component.componentContent.yAxis = [
    {
      locked: isYAxis1Locked
    },
    {
      locked: isYAxis2Locked
    }
  ];
  expect(component.isYAxisLocked()).toEqual(expectedIsYAxisLocked);
}

function convertRowDataToSeriesData() {
  describe('convertRowDataToSeriesData', () => {
    it('should convert row data to series data', () => {
      const rows = createTable([
        ['Time', 'Position'],
        [0, 0],
        [10, 5],
        [20, 10]
      ]);
      const params = {
        skipFirstRow: true,
        xColumn: 0,
        yColumn: 1
      };
      const seriesData = component.convertRowDataToSeriesData(rows, params);
      expect(seriesData).toEqual([
        { x: 0, y: 0 },
        { x: 10, y: 5 },
        { x: 20, y: 10 }
      ]);
    });
  });
}

function createTable(rows: any[]): any[] {
  const table = [];
  for (const row of rows) {
    const newRow = [];
    for (const cell of row) {
      newRow.push(createTableCell(cell));
    }
    table.push(newRow);
  }
  return table;
}

function createTableCell(text: string): any {
  return {
    text: text
  };
}

function newTrial() {
  describe('newTrial', () => {
    it('should create new trial', () => {
      component.newTrial();
      expect(component.trials.length).toEqual(2);
      expect(component.trials[1].name).toEqual('Trial 2');
    });
  });
}

function getTrialNumbers() {
  describe('getTrialNumbers', () => {
    it('should get trial numbers', () => {
      component.newTrial();
      component.newTrial();
      const trialNumbers = component.getTrialNumbers();
      expect(trialNumbers.length).toEqual(3);
      expect(trialNumbers[0]).toEqual(1);
      expect(trialNumbers[1]).toEqual(2);
      expect(trialNumbers[2]).toEqual(3);
    });
  });
}

function deleteTrial() {
  describe('deleteTrial', () => {
    it('should delete trial', () => {
      component.newTrial();
      expect(component.trials.length).toEqual(2);
      component.deleteTrial(0);
      expect(component.trials.length).toEqual(1);
      expect(component.trials[0].name).toEqual('Trial 2');
    });
  });
}

function createComponentStateObject(trials: any[]): any {
  return {
    studentData: {
      trials: trials
    }
  };
}

function createTrial(id: string, series: any[]) {
  return {
    id: id,
    series: series
  };
}

function createSeries(name: string, data: any[]): any {
  return {
    data: data,
    name: name
  };
}

function createComponentStateFromData(name: string, data: any[]): any {
  const series = createSeries(name, data);
  const trial = createTrial('trial1', [series]);
  return createComponentStateObject([trial]);
}

function undoClicked() {
  describe('undoClicked', () => {
    it('should undo', () => {
      const componentState1 = createComponentStateObject([
        { name: 'Trial 1' },
        { name: 'Trial 2' }
      ]);
      expect(component.trials.length).toEqual(1);
      component.undoStack = [componentState1];
      component.undoClicked();
      expect(component.trials.length).toEqual(2);
    });
  });
}

function createChartConfig() {
  describe('createChartConfig', () => {
    it('should create chart config', () => {
      const title = 'My Graph Title';
      const subtitle = 'My Graph Subtitle';
      const xAxis = {
        min: 0,
        max: 100
      };
      const yAxis = {
        min: 0,
        max: 50
      };
      const series = [
        {
          data: sampleData
        }
      ];
      const config = component.createChartConfig(() => {}, title, subtitle, xAxis, yAxis, series);
      expect(config.title.text).toEqual(title);
      expect(config.xAxis).toEqual(xAxis);
      expect(config.yAxis).toEqual(yAxis);
      expect(config.series).toEqual(series);
    });
  });
}

function createTableConnectedComponent(): any {
  return {
    skipFirstRow: true,
    xColumn: 0,
    yColumn: 1
  };
}

function createDataExplorerStudentData(): any {
  return {
    isDataExplorerEnabled: true,
    dataExplorerGraphType: 'scatter',
    tableData: [
      [{ text: 'ID' }, { text: 'Age' }, { text: 'Score' }],
      [{ text: '1' }, { text: '10' }, { text: '100' }],
      [{ text: '2' }, { text: '20' }, { text: '200' }],
      [{ text: '3' }, { text: '30' }, { text: '300' }]
    ],
    dataExplorerSeries: [{ xColumn: 0, yColumn: 1, name: 'The series name' }],
    dataExplorerXAxisLabel: 'Hello',
    dataExplorerYAxisLabel: 'World'
  };
}

function handleTableConnectedComponentStudentDataChanged() {
  describe('handleTableConnectedComponentStudentDataChanged', () => {
    it('should handle table connected component student data changed', () => {
      const connectedComponent = createTableConnectedComponent();
      const dataRows: any[] = sampleData;
      const tableDataRows: any[] = [['Time', 'Position']].concat(dataRows);
      const componentState = {
        studentData: {
          tableData: createTable(tableDataRows)
        }
      };
      component.handleTableConnectedComponentStudentDataChanged(connectedComponent, componentState);
      expect(component.activeTrial.series[0].data).toEqual([
        { x: 0, y: 0 },
        { x: 10, y: 20 }
      ]);
    });
    it('should handle table connected component student data changed with selected rows', () => {
      const connectedComponent = createTableConnectedComponent();
      const dataRows: any[] = [
        [0, 0],
        [10, 20],
        [20, 40],
        [30, 80]
      ];
      const tableDataRows: any[] = [['Time', 'Position']].concat(dataRows);
      const componentState = {
        studentData: {
          tableData: createTable(tableDataRows),
          selectedRowIndices: [0, 2]
        }
      };
      component.handleTableConnectedComponentStudentDataChanged(connectedComponent, componentState);
      expect(component.activeTrial.series[0].data).toEqual([
        { x: 0, y: 0 },
        { x: 20, y: 40 }
      ]);
    });
    it('should handle table connected component student data changed with sorted rows', () => {
      const connectedComponent = createTableConnectedComponent();
      const dataRows: any[] = [
        [0, 0],
        [10, 20],
        [20, 40],
        [30, 80]
      ];
      const tableDataRows: any[] = [['Time', 'Position']].concat(dataRows);
      const componentState = {
        studentData: {
          tableData: createTable(tableDataRows),
          sortOrder: [2, 1, 0, 3]
        }
      };
      component.handleTableConnectedComponentStudentDataChanged(connectedComponent, componentState);
      expect(component.activeTrial.series[0].data).toEqual([
        { x: 20, y: 40 },
        { x: 10, y: 20 },
        { x: 0, y: 0 },
        { x: 30, y: 80 }
      ]);
    });
    it('should handle table connected component student data changed with selected and sorted rows', () => {
      const connectedComponent = createTableConnectedComponent();
      const dataRows: any[] = [
        [0, 0],
        [10, 20],
        [20, 40],
        [30, 80]
      ];
      const tableDataRows: any[] = [['Time', 'Position']].concat(dataRows);
      const componentState = {
        studentData: {
          tableData: createTable(tableDataRows),
          selectedRowIndices: [0, 2],
          sortOrder: [2, 1, 0, 3]
        }
      };
      component.handleTableConnectedComponentStudentDataChanged(connectedComponent, componentState);
      expect(component.activeTrial.series[0].data).toEqual([
        { x: 20, y: 40 },
        { x: 0, y: 0 }
      ]);
    });
    it('should handle connected data explorer student data changed', () => {
      const connectedComponent = createTableConnectedComponent();
      const studentData = createDataExplorerStudentData();
      const componentState = {
        studentData: studentData
      };
      component.activeTrial = {};
      component.handleTableConnectedComponentStudentDataChanged(connectedComponent, componentState);
      expect(component.xAxis.title.text).toEqual('Hello');
      expect(component.yAxis.title.text).toEqual('World');
      expect(component.activeTrial.series.length).toEqual(1);
      const series = component.activeTrial.series[0];
      expect(series.type).toEqual('scatter');
      expect(series.name).toEqual('The series name');
      expect(series.color).toEqual('blue');
      expect(series.data).toEqual([
        { x: 1, y: 10 },
        { x: 2, y: 20 },
        { x: 3, y: 30 }
      ]);
    });
    it('should handle connected data explorer student data changed with selected rows', () => {
      const connectedComponent = createTableConnectedComponent();
      const studentData = createDataExplorerStudentData();
      studentData.selectedRowIndices = [0, 2];
      const componentState = {
        studentData: studentData
      };
      component.activeTrial = {};
      component.handleTableConnectedComponentStudentDataChanged(connectedComponent, componentState);
      expect(component.xAxis.title.text).toEqual('Hello');
      expect(component.yAxis.title.text).toEqual('World');
      expect(component.activeTrial.series.length).toEqual(1);
      const series = component.activeTrial.series[0];
      expect(series.type).toEqual('scatter');
      expect(series.name).toEqual('The series name');
      expect(series.color).toEqual('blue');
      expect(series.data).toEqual([
        { x: 1, y: 10 },
        { x: 3, y: 30 }
      ]);
    });
  });
}

function parseLatestTrial() {
  describe('parseLatestTrial', () => {
    it('should parse latest trial', () => {
      const data = [
        { x: 0, y: 0 },
        { x: 10, y: 20 }
      ];
      const studentData = {
        trial: {
          series: [
            {
              data: data
            }
          ]
        }
      };
      const params = {};
      component.parseLatestTrial(studentData, params);
      expect(component.activeTrial.series[0].data).toEqual(data);
    });
  });
}

function isTrialHasEmptySeries() {
  describe('isTrialHasEmptySeries', () => {
    it('should check if trial has empty series when series is empty', () => {
      const trial = {
        series: []
      };
      expect(component.isTrialHasEmptySeries(trial)).toEqual(true);
    });
    it('should check if trial has empty series when series is not empty', () => {
      const trial = {
        series: [{ data: [10, 20] }]
      };
      expect(component.isTrialHasEmptySeries(trial)).toEqual(false);
    });
  });
}

function getMinMaxValues() {
  describe('getMinMaxValues', () => {
    it('should get min max values from object points', () => {
      const series = [
        {
          data: [{ x: 10, y: 20 }]
        }
      ];
      const minMaxValues = component.getMinMaxValues(series);
      expectMinMaxValues(minMaxValues, 0, 10, 0, 20);
    });
    it('should get min max values from array points', () => {
      const series = [
        {
          data: [[10, 20]]
        }
      ];
      const minMaxValues = component.getMinMaxValues(series);
      expectMinMaxValues(minMaxValues, 0, 10, 0, 20);
    });
  });
}

function expectMinMaxValues(
  minMaxValues: any,
  expectedXMin: number,
  expectedXMax: number,
  expectedYMin: number,
  expectedYMax: number
) {
  expect(minMaxValues.xMin).toEqual(expectedXMin);
  expect(minMaxValues.xMax).toEqual(expectedXMax);
  expect(minMaxValues.yMin).toEqual(expectedYMin);
  expect(minMaxValues.yMax).toEqual(expectedYMax);
}

function handleDeleteKeyPressed() {
  describe('handleDeleteKeyPressed', () => {
    it('should handle delete key pressed', () => {
      spyOn(component, 'getSelectedPoints').and.returnValue([{ index: 1, x: 10, y: 20 } as Point]);
      component.activeSeries = {
        canEdit: true,
        data: [
          [0, 0],
          [10, 20],
          [20, 40]
        ]
      };
      component.handleDeleteKeyPressed();
      expect(component.activeSeries.data.length).toEqual(2);
      expect(component.activeSeries.data).toEqual([
        [0, 0],
        [20, 40]
      ]);
    });
  });
}

function resetSeriesHelper() {
  describe('resetSeriesHelper', () => {
    it('should reset series', () => {
      const componentContentSeries1 = createSeries('Prediction', []);
      const componentContentSeries2 = createSeries('Actual', []);
      component.componentContent.series = [componentContentSeries1, componentContentSeries2];
      const studentSeries1 = createSeries('Prediction', [sampleData]);
      const studentSeriesData2 = [
        [0, 0],
        [10, 100]
      ];
      const studentSeries2 = createSeries('Actual', [studentSeriesData2]);
      component.activeSeries = studentSeries1;
      component.series = [studentSeries1, studentSeries2];
      component.resetSeriesHelper();
      expect(component.activeSeries.data).toEqual([]);
      expect(component.series[0].data).toEqual([]);
      expect(component.series[1].data).toEqual([studentSeriesData2]);
    });
  });
}

function setStudentWork() {
  describe('setStudentWork', () => {
    it('should set student work', () => {
      const data = [sampleData];
      const componentState = createComponentStateFromData('Prediction', data);
      component.setStudentWork(componentState);
      expect(component.activeTrial.series[0].data).toEqual(data);
    });
  });
}

function getNextSeriesId() {
  describe('getNextSeriesId', () => {
    it('should get next series id', () => {
      const usedSeriesIds = ['series-0', 'series-1'];
      const nextSeriesId = component.getNextSeriesId(usedSeriesIds);
      expect(nextSeriesId).toEqual('series-2');
    });
  });
}

function getHighestTrial() {
  describe('getHighestTrial', () => {
    it('should get highest trial', () => {
      const trialId1 = 'trial1';
      const trialId2 = 'trial2';
      component.trialIdsToShow = [trialId1, trialId2];
      component.trials = [createTrial(trialId1, []), createTrial(trialId2, [])];
      const highestTrial = component.getHighestTrial();
      expect(highestTrial.id).toEqual(trialId2);
    });
  });
}

function makeSureXIsWithinXMinMaxLimits() {
  describe('makeSureXIsWithinXMinMaxLimits', () => {
    it('should make sure x is within x min max limits', () => {
      makeSureWithinLimit('makeSureXIsWithinXMinMaxLimits', -1, 0);
      makeSureWithinLimit('makeSureXIsWithinXMinMaxLimits', 50, 50);
      makeSureWithinLimit('makeSureXIsWithinXMinMaxLimits', 101, 100);
    });
  });
}

function makeSureYIsWithinYMinMaxLimits() {
  describe('makeSureYIsWithinYMinMaxLimits', () => {
    it('should make sure y is within y min max limits', () => {
      makeSureWithinLimit('makeSureYIsWithinYMinMaxLimits', -1, 0);
      makeSureWithinLimit('makeSureYIsWithinYMinMaxLimits', 100, 100);
      makeSureWithinLimit('makeSureYIsWithinYMinMaxLimits', 101, 100);
    });
  });
}

function makeSureWithinLimit(functionName: string, inputValue: number, expectedValue: number) {
  expect(component[functionName](inputValue)).toEqual(expectedValue);
}

function makePointsUnique() {
  describe('makePointsUnique', () => {
    it('should make points unique', () => {
      const points = [
        [0, 0],
        [10, 20],
        [10, 30],
        [20, 40],
        [20, 50]
      ];
      const uniquePoints = component.makePointsUnique(points);
      expect(uniquePoints.length).toEqual(3);
      expect(uniquePoints[0]).toEqual([0, 0]);
      expect(uniquePoints[1]).toEqual([10, 20]);
      expect(uniquePoints[2]).toEqual([20, 40]);
    });
  });
}

function createComponentState() {
  describe('createComponentState', () => {
    it('should create component state', waitForAsync(() => {
      const trials = [createTrial('trial1', []), createTrial('trial2', [])];
      component.trials = trials;
      component.createComponentState('save').then((componentState: any) => {
        expect(componentState.componentId).toEqual(componentId);
        expect(componentState.nodeId).toEqual(nodeId);
        expect(componentState.componentType).toEqual('Graph');
        expect(componentState.studentData.trials).toEqual(trials);
      });
    }));
  });
}

function showOrHideTrials() {
  describe('showOrHideTrials', () => {
    it('should show or hide trials', () => {
      const trialId1 = 'trial1';
      const trialId2 = 'trial2';
      component.trialIdsToShow = [trialId1, trialId2];
      component.trials = [createTrial(trialId1, []), createTrial(trialId2, [])];
      const trialIdsToShow = ['trial2'];
      component.showOrHideTrials(trialIdsToShow);
      expect(component.trials[0].show).toEqual(false);
      expect(component.trials[1].show).toEqual(true);
    });
  });
}

function createYAxis(color) {
  return {
    labels: {
      style: {
        color: color
      }
    },
    title: {
      style: {
        color: color
      }
    }
  };
}

function performRounding() {
  it('should perform rounding', () => {
    const number = 10.234;
    component.componentContent.roundValuesTo = 'integer';
    expect(component.performRounding(number)).toEqual(10);
    component.componentContent.roundValuesTo = 'tenth';
    expect(component.performRounding(number)).toEqual(10.2);
    component.componentContent.roundValuesTo = 'hundredth';
    expect(component.performRounding(number)).toEqual(10.23);
  });
}

function setTheDefaultActiveSeries() {
  it('should set the default active series', () => {
    component.series = [
      {
        name: 'Series 1',
        canEdit: false,
        data: []
      },
      {
        name: 'Series 2',
        canEdit: true,
        data: []
      }
    ];
    component.setDefaultActiveSeries();
    expect(component.activeSeries.name).toEqual('Series 2');
  });
}

function getSeriesByIndex() {
  it('should get series by index', () => {
    component.series = [
      {
        name: 'Series 1',
        canEdit: false,
        data: []
      },
      {
        name: 'Series 2',
        canEdit: true,
        data: []
      }
    ];
    expect(component.getSeriesByIndex(1).name).toEqual('Series 2');
  });
}

function getTheXColumnValueFromParams() {
  it('should get the x column value from params', () => {
    const params1 = {
      skipFirstRow: true,
      xColumn: 1,
      yColumn: 2
    };
    expect(component.getXColumnValue(params1)).toEqual(1);
    const params2 = {};
    expect(component.getXColumnValue(params2)).toEqual(0);
  });
}

function getTheYColumnValueFromParams() {
  it('should get the y column value from params', () => {
    const params1 = {
      skipFirstRow: true,
      xColumn: 1,
      yColumn: 2
    };
    expect(component.getYColumnValue(params1)).toEqual(2);
    const params2 = {};
    expect(component.getYColumnValue(params2)).toEqual(1);
  });
}

function checkIfASeriesIsTheActiveSeries() {
  it('should check if a series is the active series', () => {
    const series1 = {};
    const series2 = {};
    component.series = [series1, series2];
    component.activeSeries = series2;
    expect(component.isActiveSeries(series2)).toEqual(true);
  });
}

function createANewTrial() {
  it('should create a new trial', () => {
    const series1 = {};
    const series2 = {};
    component.series = [series1, series2];
    component.activeSeries = series1;
    expect(component.trials.length).toEqual(1);
    component.newTrial();
    expect(component.trials.length).toEqual(2);
  });
}

function makeTheHighestTrialActive() {
  it('should make the highest trial active', () => {
    component.trials = [
      { name: 'Trial 1', id: 'aaaaaaaaaa', series: [] },
      { name: 'Trial 2', id: 'bbbbbbbbbb', series: [] },
      { name: 'Trial 3', id: 'cccccccccc', series: [] }
    ];
    component.trialIdsToShow = ['aaaaaaaaaa', 'bbbbbbbbbb'];
    expect(component.activeTrial).not.toEqual(component.trials[1]);
    component.makeHighestTrialActive();
    expect(component.activeTrial).toEqual(component.trials[1]);
  });
}

function getTheHighestShownTrial() {
  it('should get the highest shown trial', () => {
    component.trials = [
      { name: 'Trial 1', id: 'aaaaaaaaaa' },
      { name: 'Trial 2', id: 'bbbbbbbbbb' },
      { name: 'Trial 3', id: 'cccccccccc' }
    ];
    expect(component.activeTrial).not.toEqual(component.trials[1]);
    component.trialIdsToShow = ['aaaaaaaaaa', 'bbbbbbbbbb'];
    const highestTrial = component.getHighestTrial();
    expect(highestTrial).toEqual(component.trials[1]);
  });
}

function setTheTrialIdsToShow() {
  it('should set the trial ids to show', () => {
    expect(component.trialIdsToShow.length).toEqual(1);
    component.trials = [
      { name: 'Trial 1', id: 'aaaaaaaaaa', show: true },
      { name: 'Trial 2', id: 'bbbbbbbbbb', show: false },
      { name: 'Trial 3', id: 'cccccccccc', show: true }
    ];
    component.setTrialIdsToShow();
    expect(component.trialIdsToShow.length).toEqual(2);
    expect(component.trialIdsToShow[0]).toEqual('aaaaaaaaaa');
    expect(component.trialIdsToShow[1]).toEqual('cccccccccc');
  });
}

function deleteTrialsById() {
  it('should delete trials by id', () => {
    component.trials = [
      { name: 'Trial 1', id: 'aaaaaaaaaa' },
      { name: 'Trial 2', id: 'bbbbbbbbbb' },
      { name: 'Trial 3', id: 'cccccccccc' }
    ];
    expect(component.trials.length).toEqual(3);
    component.deleteTrialsByTrialId(['aaaaaaaaaa', 'bbbbbbbbbb']);
    expect(component.trials.length).toEqual(1);
  });
}

function deleteTrialById() {
  it('should delete trial by id', () => {
    component.trials = [
      { name: 'Trial 1', id: 'aaaaaaaaaa' },
      { name: 'Trial 2', id: 'bbbbbbbbbb' },
      { name: 'Trial 3', id: 'cccccccccc' }
    ];
    expect(component.trials.length).toEqual(3);
    component.deleteTrialId('bbbbbbbbbb');
    expect(component.trials.length).toEqual(2);
  });
}

function getTheLatestStudentDataTrial() {
  it('should get the latest student data trial', () => {
    const studentData = {
      trials: [
        { name: 'Trial 1', id: 'aaaaaaaaaa' },
        { name: 'Trial 2', id: 'bbbbbbbbbb' }
      ]
    };
    const latestTrial = component.getLatestStudentDataTrial(studentData);
    expect(latestTrial.id).toEqual('bbbbbbbbbb');
  });
}

function hideAllTrials() {
  it('should hide all trials', () => {
    component.trials = [
      { name: 'Trial 1', id: 'aaaaaaaaaa', show: true },
      { name: 'Trial 2', id: 'bbbbbbbbbb', show: true }
    ];
    expect(component.trials[0].show).toEqual(true);
    expect(component.trials[1].show).toEqual(true);
    component.hideAllTrials();
    expect(component.trials[0].show).toEqual(false);
    expect(component.trials[1].show).toEqual(false);
  });
}

function createANewTrialObject() {
  it('should create a new trial object', () => {
    const trial = component.createNewTrial('aaaaaaaaaa');
    expect(trial.id).toEqual('aaaaaaaaaa');
    expect(trial.name).toEqual('');
    expect(trial.series.length).toEqual(0);
    expect(trial.show).toEqual(true);
  });
}

function copyASeries() {
  it('should copy a series', () => {
    const series = {
      name: 'Series 1',
      data: [],
      color: 'blue',
      canEdit: true,
      allowPointSelect: true
    };
    const newSeries = component.copySeries(series);
    expect(newSeries.name).toEqual('Series 1');
    expect(newSeries.data.length).toEqual(0);
    expect(newSeries.color).toEqual('blue');
    expect(newSeries.canEdit).toEqual(false);
    expect(newSeries.allowPointSelect).toEqual(false);
  });
}

function removeDefaultTrialIfNecessary() {
  it('should remove default trial if necessary', () => {
    component.trials = [{ name: 'Trial 1', id: 'aaaaaaaaaa', series: [] }];
    expect(component.trials.length).toEqual(1);
    const latestStudentDataTrialId = 2;
    component.removeDefaultTrialIfNecessary(latestStudentDataTrialId);
    expect(component.trials.length).toEqual(0);
  });
}

function checkIfATrialHasAnEmptySeries() {
  it('should check if a trial has an empty series', () => {
    const trial1 = { series: [] };
    expect(component.isTrialHasEmptySeries(trial1)).toEqual(true);
    const trial2 = { series: [{ id: 'series-0' }, { id: 'series-1' }] };
    expect(component.isTrialHasEmptySeries(trial2)).toEqual(false);
  });
}

function checkIfASeriesIsEmpty() {
  it('should check if a series is empty', () => {
    const series1 = [{ data: [] }];
    expect(component.isSeriesEmpty(series1)).toEqual(true);
    const series2 = [{ id: 'series-0', data: [[0, 10]] }];
    expect(component.isSeriesEmpty(series2)).toEqual(false);
  });
}

function shouldCreateNewTrialIfNecessary() {
  it('should create new trial if necessary', () => {
    component.trials = [{ name: 'Trial 1', id: 'aaaaaaaaaa', show: true }];
    const trialId = 2;
    component.createNewTrialIfNecessary(trialId);
    expect(component.trials.length).toEqual(2);
  });
}

function notCreateNewTrialWhenNotNecessary() {
  it('should not create new trial when not necessary', () => {
    component.trials = [{ name: 'Trial 1', id: 'aaaaaaaaaa', show: true }];
    const trialId = 'aaaaaaaaaa';
    component.createNewTrialIfNecessary(trialId);
    expect(component.trials.length).toEqual(1);
  });
}

function copySeriesIntoTrial() {
  it('should copy series into trial', () => {
    const oldTrial = {
      series: [{ id: 'series-0' }]
    };
    const newTrial = {
      series: []
    };
    const studentData = {};
    const params = {};
    expect(newTrial.series.length).toEqual(0);
    component.copySeriesIntoTrial(oldTrial, newTrial, studentData, params);
    expect(newTrial.series.length).toEqual(1);
  });
}

function copyNameIntoTrial() {
  it('should copy name into trial', () => {
    const oldTrial = {
      name: 'Trial 1'
    };
    const newTrial = {
      name: 'Trial 2'
    };
    expect(newTrial.name).toEqual('Trial 2');
    component.copyTrialNameIntoTrial(oldTrial, newTrial);
    expect(newTrial.name).toEqual('Trial 1');
  });
}

function getTheTrialById() {
  it('should get the trial by id', () => {
    const trial1 = { name: 'Trial 1', id: 'aaaaaaaaaa' };
    const trial2 = { name: 'Trial 2', id: 'bbbbbbbbbb' };
    const trial3 = { name: 'Trial 3', id: 'cccccccccc' };
    component.trials = [trial1, trial2, trial3];
    expect(component.getTrialById('aaaaaaaaaa')).toEqual(trial1);
    expect(component.getTrialById('bbbbbbbbbb')).toEqual(trial2);
    expect(component.getTrialById('cccccccccc')).toEqual(trial3);
  });
}

function checkIfThereIsAnEditableSeries() {
  it('should check if there is an editable series', () => {
    component.series = [{ id: 'series-0', canEdit: false }];
    expect(component.hasEditableSeries()).toEqual(false);
    component.series = [{ id: 'series-0', canEdit: true }];
    expect(component.hasEditableSeries()).toEqual(true);
    const trial0 = {
      id: 'trial0',
      series: [
        {
          id: 'series0',
          canEdit: false
        },
        {
          id: 'series1',
          canEdit: false
        }
      ]
    };
    expect(component.hasEditableSeries(trial0.series)).toEqual(false);
    const trial1 = {
      id: 'trial1',
      series: [
        {
          id: 'series0',
          canEdit: true
        },
        {
          id: 'series1',
          canEdit: false
        }
      ]
    };
    expect(component.hasEditableSeries(trial1.series)).toEqual(true);
  });
}

function updateMinMaxAxisValues() {
  it('should update min max axis values', () => {
    const series = [
      {
        id: 'series-0',
        data: [
          [-10, -20],
          [1000, 2000]
        ]
      }
    ];
    const xAxis = { min: 0, max: 100 };
    const yAxis = { min: 0, max: 100 };
    component.updateMinMaxAxisValues(series, xAxis, yAxis);
    expect(xAxis.min).toEqual(null);
    expect(xAxis.max).toEqual(null);
    expect(yAxis.min).toEqual(null);
    expect(yAxis.max).toEqual(null);
  });
}

function clearSeriesIds() {
  it('should clear series ids', () => {
    const series = [{ id: 'series-0' }, { id: 'series-1' }];
    component.clearSeriesIds(series);
    expect(series[0].id).toEqual(null);
    expect(series[1].id).toEqual(null);
  });
}

function readCSVIntoActiveSeries() {
  it('should read csv into active series', () => {
    const csvString = `0,100
    10, 200`;
    component.activeSeries = {};
    component.readCSVIntoActiveSeries(csvString);
    expect(component.activeSeries.data[0][0]).toEqual(0);
    expect(component.activeSeries.data[0][1]).toEqual(100);
    expect(component.activeSeries.data[1][0]).toEqual(10);
    expect(component.activeSeries.data[1][1]).toEqual(200);
  });
}

function mergeComponentState() {
  it('should merge component state', () => {
    const baseComponentState = {
      studentData: {
        trials: [{ id: 'aaaaaaaaaa', name: 'Trial 1', series: [] }]
      }
    };
    const connectedComponentState = {
      studentData: {
        trials: [{ id: 'bbbbbbbbbb', name: 'Trial 2', series: [] }]
      }
    };
    const mergeFields = [
      {
        name: 'trials',
        when: 'always',
        action: 'write'
      }
    ];
    const firstTime = false;
    expect(baseComponentState.studentData.trials[0].name).toEqual('Trial 1');
    component.mergeComponentState(
      baseComponentState,
      connectedComponentState,
      mergeFields,
      firstTime
    );
    expect(baseComponentState.studentData.trials[0].name).toEqual('Trial 2');
  });
}

function convertSelectedCellsToTrialIds() {
  it('should convert selected cells to trial ids', () => {
    const selectedCells = [
      {
        airTemp: 'Warm',
        bevTemp: 'Hot',
        material: 'Aluminum',
        dateAdded: 1556233173611
      },
      {
        airTemp: 'Warm',
        bevTemp: 'Cold',
        material: 'Aluminum',
        dateAdded: 1556233245396
      }
    ];
    const selectedTrialIds = component.convertSelectedCellsToTrialIds(selectedCells);
    expect(selectedTrialIds.length).toEqual(2);
    expect(selectedTrialIds[0]).toEqual('Aluminum-HotLiquid');
    expect(selectedTrialIds[1]).toEqual('Aluminum-ColdLiquid');
  });
}

function convertNullSelectedCellsToEmptyArrayOfTrialIds() {
  it('should convert null selected cells to empty array of trial ids', () => {
    const selectedCells = null;
    const selectedTrialIds = component.convertSelectedCellsToTrialIds(selectedCells);
    expect(selectedTrialIds.length).toEqual(0);
  });
}

function readTheConnectedComponentField() {
  it('should read the connected component field', () => {
    const studentData = {
      selectedCells: [
        {
          airTemp: 'Warm',
          bevTemp: 'Hot',
          material: 'Aluminum',
          dateAdded: 1556233173611
        },
        {
          airTemp: 'Warm',
          bevTemp: 'Cold',
          material: 'Aluminum',
          dateAdded: 1556233245396
        }
      ]
    };
    const params = {};
    const name = 'selectedCells';
    component.trials = [
      { id: 'Aluminum-HotLiquid' },
      { id: 'Aluminum-ColdLiquid' },
      { id: 'Wood-HotLiquid' },
      { id: 'Wood-ColdLiquid' }
    ];
    component.readConnectedComponentFieldFromStudentData(studentData, params, name);
    expect(component.trials[0].show).toEqual(true);
    expect(component.trials[1].show).toEqual(true);
    expect(component.trials[2].show).toEqual(false);
    expect(component.trials[3].show).toEqual(false);
  });
}

function clickUndo() {
  it('should click undo', () => {
    component.trials = [{ id: 'aaaaaaaaaa' }];
    const componentState = {
      studentData: {
        trials: [{ id: 'aaaaaaaaaa' }, { id: 'bbbbbbbbbb' }]
      }
    };
    component.undoStack = [componentState];
    component.undoClicked();
    expect(component.undoStack.length).toEqual(0);
    expect(component.previousComponentState).toEqual(componentState);
    expect(component.trials[0].id).toEqual('aaaaaaaaaa');
    expect(component.trials[1].id).toEqual('bbbbbbbbbb');
  });
}

function getTheXValueFromDataPoint() {
  it('should get the x value from data point', () => {
    const dataPointObject = { x: 10, y: 20 };
    const dataPointArray = [100, 200];
    expect(component.getXValueFromDataPoint(dataPointObject)).toEqual(10);
    expect(component.getXValueFromDataPoint(dataPointArray)).toEqual(100);
  });
}

function getTheYValueFromDataPoint() {
  it('should get the y value from data point', () => {
    const dataPointObject = { x: 10, y: 20 };
    const dataPointArray = [100, 200];
    expect(component.getYValueFromDataPoint(dataPointObject)).toEqual(20);
    expect(component.getYValueFromDataPoint(dataPointArray)).toEqual(200);
  });
}

function getTheLatestMouseOverPointX() {
  it('should get the latest mouse over point x', () => {
    component.mouseOverPoints = [
      { x: 10, y: 20 },
      { x: 11, y: 22 }
    ];
    expect(component.getLatestMouseOverPointX()).toEqual(11);
    component.mouseOverPoints = [
      [100, 200],
      [111, 222]
    ];
    expect(component.getLatestMouseOverPointX()).toEqual(111);
  });
}

function getTheLatestMouseOverPointY() {
  it('should get the latest mouse over point y', () => {
    component.mouseOverPoints = [
      { x: 10, y: 20 },
      { x: 11, y: 22 }
    ];
    expect(component.getLatestMouseOverPointY()).toEqual(22);
    component.mouseOverPoints = [
      [100, 200],
      [111, 222]
    ];
    expect(component.getLatestMouseOverPointY()).toEqual(222);
  });
}

function addPointToSeries() {
  it('should add point to series', () => {
    const series = {
      data: [
        [10, 20],
        [100, 200]
      ]
    };
    expect(series.data.length).toEqual(2);
    component.addPointToSeries(series, 1000, 2000);
    expect(series.data.length).toEqual(3);
    expect(series.data[2][0]).toEqual(1000);
    expect(series.data[2][1]).toEqual(2000);
  });
}

function getTheTrialIndex() {
  it('should get the trial index', () => {
    const trial0 = {};
    const trial1 = {};
    const trial2 = {};
    component.trials = [trial0, trial1, trial2];
    expect(component.getTrialIndex(trial0)).toEqual(0);
    expect(component.getTrialIndex(trial1)).toEqual(1);
    expect(component.getTrialIndex(trial2)).toEqual(2);
  });
}

function createTheChartConfig() {
  it('should create the chart config', () => {
    const trial0 = {};
    const trial1 = {};
    const trial2 = {};
    component.trials = [trial0, trial1, trial2];
    const deferred = {};
    const title = 'My Graph';
    const subtitle = 'My Subtitle';
    const xAxis = {
      min: 0,
      max: 100
    };
    const yAxis = {
      min: 0,
      max: 50
    };
    const series = [
      [10, 20],
      [100, 200]
    ];
    const zoomType = null;
    const chartConfig = component.createChartConfig(
      deferred,
      title,
      subtitle,
      xAxis,
      yAxis,
      series
    );
    expect(chartConfig.title.text).toEqual('My Graph');
    expect(chartConfig.xAxis.min).toEqual(0);
    expect(chartConfig.xAxis.max).toEqual(100);
    expect(chartConfig.yAxis.min).toEqual(0);
    expect(chartConfig.yAxis.max).toEqual(50);
    expect(chartConfig.series).toEqual(series);
  });
}

function checkIfASeriesIsEditable() {
  it('should check if a series is editable', () => {
    const multipleSeries = [
      { id: 'series0', canEdit: true },
      { id: 'series1', canEdit: false },
      { id: 'series2', canEdit: true }
    ];
    expect(component.isSeriesEditable(multipleSeries, 0)).toEqual(true);
    expect(component.isSeriesEditable(multipleSeries, 1)).toEqual(false);
    expect(component.isSeriesEditable(multipleSeries, 2)).toEqual(true);
  });
}

function getTheLatestEditableSeriesIndex() {
  it('should get the latest editable series index', () => {
    const multipleSeries0 = [
      { id: 'series0', canEdit: true },
      { id: 'series1', canEdit: false },
      { id: 'series2', canEdit: false }
    ];
    expect(component.getLatestEditableSeriesIndex(multipleSeries0)).toEqual(0);
    const multipleSeries1 = [
      { id: 'series0', canEdit: true },
      { id: 'series1', canEdit: true },
      { id: 'series2', canEdit: false }
    ];
    expect(component.getLatestEditableSeriesIndex(multipleSeries1)).toEqual(1);
    const multipleSeries2 = [
      { id: 'series0', canEdit: true },
      { id: 'series1', canEdit: false },
      { id: 'series2', canEdit: true }
    ];
    expect(component.getLatestEditableSeriesIndex(multipleSeries2)).toEqual(2);
    const multipleSeries3 = [
      { id: 'series0', canEdit: false },
      { id: 'series1', canEdit: false },
      { id: 'series2', canEdit: false }
    ];
    expect(component.getLatestEditableSeriesIndex(multipleSeries3)).toEqual(null);
  });
}

function handleTrialIdsToShowChanged() {
  it('should handle trial ids to show changed', () => {
    const trial0 = {
      id: 'aaaaaaaaaa',
      show: true,
      series: [
        {
          id: '1111111111',
          canEdit: true
        }
      ]
    };
    const trial1 = {
      id: 'bbbbbbbbbb',
      show: true,
      series: [
        {
          id: '2222222222',
          canEdit: true
        }
      ]
    };
    const trial2 = {
      id: 'cccccccccc',
      show: true,
      series: [
        {
          id: '3333333333',
          canEdit: true
        }
      ]
    };
    component.trials = [trial0, trial1, trial2];
    component.activeTrial = trial1;
    component.activeSeries = trial1.series[0];
    component.previousTrialIdsToShow = ['aaaaaaaaaa', 'bbbbbbbbbb'];
    component.trialIdsToShow = ['aaaaaaaaaa', 'bbbbbbbbbb', 'cccccccccc'];
    studentDataChangedSpy.and.callFake(() => {});
    component.trialIdsToShowChanged();
    expect(component.activeTrial).toEqual(trial2);
    expect(component.activeSeries).toEqual(trial2.series[0]);
    expect(studentDataChangedSpy).toHaveBeenCalled();
  });
}

function handleTrialIdsToShowChangedWhenTheLatestTrialIsNotEditable() {
  it('should handle trial ids to show changed when the latest trial is not editable', () => {
    const trial0 = {
      id: 'aaaaaaaaaa',
      show: true,
      series: [
        {
          id: '1111111111',
          canEdit: true
        }
      ]
    };
    const trial1 = {
      id: 'bbbbbbbbbb',
      show: true,
      series: [
        {
          id: '2222222222',
          canEdit: true
        }
      ]
    };
    const trial2 = {
      id: 'cccccccccc',
      show: true,
      series: [
        {
          id: '3333333333',
          canEdit: false
        }
      ]
    };
    component.trials = [trial0, trial1, trial2];
    component.activeTrial = trial1;
    component.activeSeries = trial1.series[0];
    const trialIdsToShow = ['aaaaaaaaaa', 'bbbbbbbbbb', 'cccccccccc'];
    component.trialIdsToShow = trialIdsToShow;
    component.previousTrialIdsToShow = trialIdsToShow;
    component.trialIdsToShowChanged();
    expect(component.activeTrial).toEqual(trial1);
    expect(component.activeSeries).toEqual(trial1.series[0]);
  });
}

function showTrialsAndHideTheCurrentlyActiveTrial() {
  it('should show trials and hide the currently active trial', () => {
    const trial0 = {
      id: 'aaaaaaaaaa',
      show: true,
      series: [
        {
          id: '1111111111',
          canEdit: true
        }
      ]
    };
    const trial1 = {
      id: 'bbbbbbbbbb',
      show: true,
      series: [
        {
          id: '2222222222',
          canEdit: true
        }
      ]
    };
    const trial2 = {
      id: 'cccccccccc',
      show: true,
      series: [
        {
          id: '3333333333',
          canEdit: false
        }
      ]
    };
    component.trials = [trial0, trial1, trial2];
    component.series = trial1.series;
    component.activeTrial = trial1;
    component.activeSeries = trial1.series[0];
    const trialIdsToShow = ['aaaaaaaaaa', 'cccccccccc'];
    component.showOrHideTrials(trialIdsToShow);
    expect(trial0.show).toEqual(true);
    expect(trial1.show).toEqual(false);
    expect(trial2.show).toEqual(true);
    expect(component.series).toEqual([]);
    expect(component.activeTrial).toEqual(null);
    expect(component.activeSeries).toEqual(null);
  });
}

function setActiveTrialAndSeriesByTrialIdsToShow() {
  it('should set active trial and series by trial ids to show', () => {
    const trial0 = {
      id: 'aaaaaaaaaa',
      show: true,
      series: [
        {
          id: '1111111111',
          canEdit: true
        }
      ]
    };
    const trial1 = {
      id: 'bbbbbbbbbb',
      show: true,
      series: [
        {
          id: '2222222222',
          canEdit: true
        }
      ]
    };
    const trial2 = {
      id: 'cccccccccc',
      show: true,
      series: [
        {
          id: '3333333333',
          canEdit: false
        }
      ]
    };
    component.trials = [trial0, trial1, trial2];
    component.series = trial2.series;
    component.activeTrial = trial2;
    component.activeSeries = trial2.series[0];
    const trialIdsToShow = ['aaaaaaaaaa', 'bbbbbbbbbb'];
    component.setActiveTrialAndSeriesByTrialIdsToShow(trialIdsToShow);
    expect(component.series).toEqual(trial1.series);
    expect(component.activeTrial).toEqual(trial1);
    expect(component.activeSeries).toEqual(trial1.series[0]);
  });
}

function notSetTheActiveTrialAndSeriesIfTheTrialCanNotBeEdited() {
  it('should not set the active trial and series if the trial can not be edited', () => {
    const trial0 = {
      id: 'aaaaaaaaaa',
      show: true,
      series: [
        {
          id: '1111111111',
          canEdit: true
        }
      ]
    };
    const trial1 = {
      id: 'bbbbbbbbbb',
      show: true,
      series: [
        {
          id: '2222222222',
          canEdit: true
        }
      ]
    };
    const trial2 = {
      id: 'cccccccccc',
      show: true,
      series: [
        {
          id: '3333333333',
          canEdit: false
        }
      ]
    };
    component.trials = [trial0, trial1, trial2];
    component.series = trial1.series;
    component.activeTrial = trial1;
    component.activeSeries = trial1.series[0];
    const trialIdsToShow = ['aaaaaaaaaa', 'bbbbbbbbbb', 'cccccccccc'];
    component.setActiveTrialAndSeriesByTrialIdsToShow(trialIdsToShow);
    expect(component.series).toEqual(trial1.series);
    expect(component.activeTrial).toEqual(trial1);
    expect(component.activeSeries).toEqual(trial1.series[0]);
  });
}

function checkIfYAxisIsLockedWithOneYAxisTrue() {
  it('should check if Y axis is locked with one Y axis true', () => {
    expect(component.isYAxisLocked()).toEqual(true);
  });
}

function checkIfYAxisIsLockedWithOneYAxisFalse() {
  it('should check if Y axis is locked with one Y axis false', () => {
    component.componentContent.yAxis.locked = false;
    expect(component.isYAxisLocked()).toEqual(false);
  });
}

function checkIfYAxisIsLockedWithMultipleYAxesTrue() {
  it('should check if Y axis is locked with multiple Y axes true', () => {
    const firstYAxis = {
      title: {
        text: 'Count'
      },
      min: 0,
      max: 100,
      units: '',
      locked: true
    };
    const secondYAxis = {
      title: {
        text: 'Price'
      },
      min: 0,
      max: 1000,
      units: '',
      locked: true,
      opposite: true
    };
    component.componentContent.yAxis = [firstYAxis, secondYAxis];
    expect(component.isYAxisLocked()).toEqual(true);
  });
}

function checkIfYAxisIsLockedWithMultipleYAxesFalse() {
  it('should check if Y axis is locked with multiple Y axes false', () => {
    const firstYAxis = {
      title: {
        text: 'Count'
      },
      min: 0,
      max: 100,
      units: '',
      locked: false
    };
    const secondYAxis = {
      title: {
        text: 'Price'
      },
      min: 0,
      max: 1000,
      units: '',
      locked: false,
      opposite: true
    };
    component.componentContent.yAxis = [firstYAxis, secondYAxis];
    expect(component.isYAxisLocked()).toEqual(false);
  });
}
function getEventYValueWhenThereIsOneYAxis() {
  it('should get event y value when there is one y axis', () => {
    const event = {
      yAxis: [{ value: 10 }]
    };
    expect(component.getEventYValue(event)).toEqual(10);
  });
}

function getEventYValueWhenThereAreMultipleYAxes() {
  it('should get event y value when there are multiple y axes', () => {
    const event = {
      yAxis: [{ value: 10 }, { value: 20 }]
    };
    component.yAxis = [
      {
        title: { text: 'Y Axis 1' }
      },
      {
        title: { text: 'Y Axis 2' }
      }
    ];
    component.activeSeries = {
      yAxis: 1
    };
    expect(component.getEventYValue(event)).toEqual(20);
  });
}

function turnOffXAxisDecimals() {
  it('should turn off x axis decimals', () => {
    component.xAxis = {
      title: { text: 'X Axis' }
    };
    component.turnOffXAxisDecimals();
    expect(component.xAxis.allowDecimals).toEqual(false);
  });
}

function turnOffYAxisDecimalsWhenThereIsOneYAxis() {
  it('should turn off y axis decimals when there is one y axis', () => {
    component.yAxis = {
      title: { text: 'Y Axis' }
    };
    component.turnOffYAxisDecimals();
    expect(component.yAxis.allowDecimals).toEqual(false);
  });
}

function turnOffYAxisDecimalsWhenThereAreMultipleYAxes() {
  it('should turn off y axis decimals when there are multiple y axes', () => {
    component.yAxis = [
      {
        title: { text: 'Y Axis 1' }
      },
      {
        title: { text: 'Y Axis 2' }
      }
    ];
    component.turnOffYAxisDecimals();
    expect(component.yAxis[0].allowDecimals).toEqual(false);
    expect(component.yAxis[1].allowDecimals).toEqual(false);
  });
}

function getSeriesYAxisIndexWhenItHasNoneSet() {
  it('should get series y axis index when it has none set', () => {
    component.yAxis = [
      {
        title: { text: 'Y Axis 1' }
      },
      {
        title: { text: 'Y Axis 2' }
      }
    ];
    const series = {};
    expect(component.getSeriesYAxisIndex(series)).toEqual(0);
  });
}

function getSeriesYAxisIndexWhenItHasItSet() {
  it('should get series y axis index when it has it set', () => {
    component.yAxis = [
      {
        title: { text: 'Y Axis 1' }
      },
      {
        title: { text: 'Y Axis 2' }
      }
    ];
    const series = {
      yAxis: 1
    };
    expect(component.getSeriesYAxisIndex(series)).toEqual(1);
  });
}

function importGraphSettings() {
  it('should import graph settings', () => {
    component.title = 'Graph 1 Title';
    component.subtitle = 'Graph 1 Subtitle';
    component.width = 100;
    component.height = 200;
    component.xAxis = {
      title: { text: 'X Axis 1' }
    };
    component.yAxis = {
      title: { text: 'Y Axis 1' }
    };
    const graph2Title = 'Graph 2 Title';
    const graph2Subtitle = 'Graph 2 Subtitle';
    const graph2Width = 300;
    const graph2Height = 400;
    const xAxis2Title = 'X Axis 2';
    const yAxis2Title = 'Y Axis 2';
    const componentContent = {
      title: graph2Title,
      subtitle: graph2Subtitle,
      width: graph2Width,
      height: graph2Height
    };
    const componentState = {
      studentData: {
        xAxis: {
          title: { text: xAxis2Title }
        },
        yAxis: {
          title: { text: yAxis2Title }
        }
      }
    };
    component.importGraphSettings(componentContent, componentState);
    expect(component.title).toEqual(graph2Title);
    expect(component.subtitle).toEqual(graph2Subtitle);
    expect(component.width).toEqual(graph2Width);
    expect(component.height).toEqual(graph2Height);
    expect(component.xAxis.title.text).toEqual(xAxis2Title);
    expect(component.yAxis.title.text).toEqual(yAxis2Title);
  });
}

function mouseDownEventOccurred() {
  describe('mouseDownEventOccurred()', () => {
    it('should draw an x plot line', () => {
      const chart = component.getChartById(component.chartId);
      expect(chart.xAxis[0].userOptions.plotLines).toEqual([]);
      component.mouseDownEventOccurred({ offsetX: 1000 });
      expect(chart.xAxis[0].userOptions.plotLines).toEqual([new XPlotLine(100, '') as any]);
    });
  });
}
