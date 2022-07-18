import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Point } from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { NotificationService } from '../../../services/notificationService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { UtilService } from '../../../services/utilService';
import { ComponentService } from '../../componentService';
import { GraphService } from '../graphService';
import { GraphStudent } from './graph-student.component';
import { of } from 'rxjs';
import { ComponentServiceLookupServiceModule } from '../../../services/componentServiceLookupServiceModule';

class MockNodeService {
  createNewComponentState() {
    return {};
  }
  broadcastDoneRenderingComponent() {}
}

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
      imports: [
        BrowserModule,
        ComponentServiceLookupServiceModule,
        HighchartsChartModule,
        HttpClientTestingModule,
        MatDialogModule,
        NoopAnimationsModule
      ],
      declarations: [GraphStudent],
      providers: [
        AnnotationService,
        ComponentService,
        ConfigService,
        GraphService,
        { provide: NodeService, useClass: MockNodeService },
        NotebookService,
        NotificationService,
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        UtilService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(GraphStudent);
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({
      score: 0,
      comment: ''
    });
    spyOn(TestBed.inject(ProjectService), 'isSpaceExists').and.returnValue(false);
    component = fixture.componentInstance;
    component.nodeId = nodeId;
    component.componentContent = createComponentContent();
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
  calculateRegressionLine();
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
  checkIfYAxisLabelIsBlankWithSingleYAxisFalse();
  checkIfYAxisLabelIsBlankWithSingleYAxisTrue();
  checkIfYAxisLabelIsBlankWithMultipleYAxesFalse();
  checkIfYAxisLabelIsBlankWithMultipleYAxesTrue();
  clearSeriesIds();
  clickUndo();
  convertDataExplorerDataToSeriesData();
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
  generateDataExplorerSeries();
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
  getValuesInColumn();
  getYAxisColor();
  handleDataExplorer();
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
  newTrial();
  notCreateNewTrialWhenNotNecessary();
  notSetTheActiveTrialAndSeriesIfTheTrialCanNotBeEdited();
  parseLatestTrial();
  performRounding();
  readCSVIntoActiveSeries();
  readTheConnectedComponentField();
  removeDefaultTrialIfNecessary();
  removePointFromSeries();
  resetGraph();
  resetSeriesHelper();
  setActiveTrialAndSeriesByTrialIdsToShow();
  setAllSeriesColorsToMatchYAxes();
  setSeriesYIndex();
  setSingleSeriesColorsToMatchYAxisWhenYAxisIsNotSet();
  setSingleSeriesColorsToMatchYAxisWhenYAxisIsSet();
  setStudentWork();
  setTheDefaultActiveSeries();
  setTheTrialIdsToShow();
  setVerticalPlotLine();
  setYAxisLabelsWhenMultipleYAxes();
  setYAxisLabelsWhenSingleYAxis();
  showOrHideTrials();
  showTrialsAndHideTheCurrentlyActiveTrial();
  sortLineData();
  turnOffXAxisDecimals();
  turnOffYAxisDecimalsWhenThereIsOneYAxis();
  turnOffYAxisDecimalsWhenThereAreMultipleYAxes();
  undoClicked();
  updateMinMaxAxisValues();
  getTrialsFromClassmates();
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
    ]
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
        [0, 0],
        [10, 5],
        [20, 10]
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

function setVerticalPlotLine() {
  describe('setVerticalPlotLine', () => {
    it('should set vertical plot line', () => {
      component.setVerticalPlotLine(10);
      expect(component.plotLines.length).toEqual(1);
      expect(component.plotLines[0].value).toEqual(10);
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

function handleTableConnectedComponentStudentDataChanged() {
  describe('handleTableConnectedComponentStudentDataChanged', () => {
    it('should handle table connected component student data changed', () => {
      const connectedComponent = {
        skipFirstRow: true,
        xColumn: 0,
        yColumn: 1
      };
      const dataRows: any[] = [sampleData];
      const tableDataRows: any[] = [['Time', 'Position']].concat(dataRows);
      const componentState = {
        studentData: {
          tableData: createTable(tableDataRows)
        }
      };
      component.handleTableConnectedComponentStudentDataChanged(connectedComponent, componentState);
      expect(component.activeTrial.series[0].data).toEqual(dataRows);
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

function resetGraph() {
  describe('resetGraph', () => {
    it('should reset graph', () => {
      component.series = [
        {
          data: [
            [0, 0],
            [10, 20],
            [20, 40]
          ]
        }
      ];
      component.xAxis.max = 200;
      component.yAxis.max = 50;
      component.resetGraph();
      expect(component.series[0].data).toEqual([]);
      expect(component.xAxis.max).toEqual(100);
      expect(component.yAxis.max).toEqual(100);
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

function removePointFromSeries() {
  describe('removePointFromSeries', () => {
    it('should remove point from series', () => {
      const series = createSeries('series1', [
        [0, 0],
        [10, 20],
        [20, 40]
      ]);
      component.removePointFromSeries(series, 10);
      expect(series.data.length).toEqual(2);
      expect(series.data[0]).toEqual([0, 0]);
      expect(series.data[1]).toEqual([20, 40]);
    });
  });
}

function createComponentState() {
  describe('createComponentState', () => {
    it(
      'should create component state',
      waitForAsync(() => {
        const trials = [createTrial('trial1', []), createTrial('trial2', [])];
        component.trials = trials;
        component.createComponentState('save').then((componentState: any) => {
          expect(componentState.componentId).toEqual(componentId);
          expect(componentState.nodeId).toEqual(nodeId);
          expect(componentState.componentType).toEqual('Graph');
          expect(componentState.studentData.trials).toEqual(trials);
        });
      })
    );
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

function handleDataExplorer() {
  it('should handle data explorer', () => {
    const studentData = {
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
    component.activeTrial = {};
    component.handleDataExplorer(studentData);
    expect(component.xAxis.title.text).toEqual('Hello');
    expect(component.yAxis.title.text).toEqual('World');
    expect(component.activeTrial.series.length).toEqual(1);
    const series = component.activeTrial.series[0];
    expect(series.type).toEqual('scatter');
    expect(series.name).toEqual('The series name');
    expect(series.color).toEqual('blue');
    expect(series.data[0][0]).toEqual(1);
    expect(series.data[0][1]).toEqual(10);
  });
}

function generateDataExplorerSeries() {
  it('should generate data explorer series', () => {
    const tableData = [
      [{ text: 'ID' }, { text: 'Age' }, { text: 'Score' }],
      [{ text: '1' }, { text: '10' }, { text: '100' }],
      [{ text: '2' }, { text: '20' }, { text: '200' }],
      [{ text: '3' }, { text: '30' }, { text: '300' }]
    ];
    const xColumn = 0;
    const yColumn = 1;
    const graphType = 'scatter';
    const name = 'Age';
    const color = 'blue';
    const yAxis = {};
    const series = component.generateDataExplorerSeries(
      tableData,
      xColumn,
      yColumn,
      graphType,
      name,
      color,
      yAxis
    );
    expect(series.name).toEqual('Age');
    expect(series.type).toEqual('scatter');
    expect(series.color).toEqual('blue');
    expect(series.data.length).toEqual(3);
    expect(series.data[0][0]).toEqual(1);
    expect(series.data[0][1]).toEqual(10);
    expect(series.data[1][0]).toEqual(2);
    expect(series.data[1][1]).toEqual(20);
    expect(series.data[2][0]).toEqual(3);
    expect(series.data[2][1]).toEqual(30);
  });
}

function calculateRegressionLine() {
  it('should calculate regression line', () => {
    const tableData = [
      [{ text: 'ID' }, { text: 'Age' }, { text: 'Score' }],
      [{ text: '1' }, { text: '10' }, { text: '100' }],
      [{ text: '2' }, { text: '20' }, { text: '200' }],
      [{ text: '3' }, { text: '30' }, { text: '300' }]
    ];
    const regressionLineData = component.calculateRegressionLineData(tableData, 0, 1);
    expect(regressionLineData[0][0]).toEqual(1);
    expect(regressionLineData[0][1]).toEqual(10);
    expect(regressionLineData[1][0]).toEqual(3);
    expect(regressionLineData[1][1]).toEqual(30);
  });
}

function getValuesInColumn() {
  it('should get values in column', () => {
    const tableData = [
      [{ text: 'ID' }, { text: 'Age' }, { text: 'Score' }],
      [{ text: '1' }, { text: '10' }, { text: '100' }],
      [{ text: '2' }, { text: '20' }, { text: '200' }],
      [{ text: '3' }, { text: '30' }, { text: '300' }]
    ];
    const column0 = component.getValuesInColumn(tableData, 0);
    const column1 = component.getValuesInColumn(tableData, 1);
    const column2 = component.getValuesInColumn(tableData, 2);
    expect(column0[0]).toEqual(1);
    expect(column0[1]).toEqual(2);
    expect(column0[2]).toEqual(3);
    expect(column1[0]).toEqual(10);
    expect(column1[1]).toEqual(20);
    expect(column1[2]).toEqual(30);
    expect(column2[0]).toEqual(100);
    expect(column2[1]).toEqual(200);
    expect(column2[2]).toEqual(300);
  });
}

function sortLineData() {
  it('should sort line data', () => {
    const line = [
      [1, 10],
      [2, 20],
      [3, 30],
      [3, 40]
    ];
    expect(component.sortLineData(line[0], line[1])).toEqual(-1);
    expect(component.sortLineData(line[1], line[0])).toEqual(1);
    expect(component.sortLineData(line[0], line[0])).toEqual(0);
    expect(component.sortLineData(line[2], line[3])).toEqual(-1);
  });
}

function convertDataExplorerDataToSeriesData() {
  it('should convert data explorer data to series data', () => {
    const rows = [
      [{ text: 'ID' }, { text: 'Age' }, { text: 'Score' }],
      [{ text: '1' }, { text: '10' }, { text: '100' }],
      [{ text: '2' }, { text: '20' }, { text: '200' }],
      [{ text: '3' }, { text: '30' }, { text: '300' }]
    ];
    const xColumn = 0;
    const yColumn = 1;
    const data = component.convertDataExplorerDataToSeriesData(rows, xColumn, yColumn);
    expect(data.length).toEqual(3);
    expect(data[0][0]).toEqual(1);
    expect(data[0][1]).toEqual(10);
    expect(data[1][0]).toEqual(2);
    expect(data[1][1]).toEqual(20);
    expect(data[2][0]).toEqual(3);
    expect(data[2][1]).toEqual(30);
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

function setYAxisLabelsWhenSingleYAxis() {
  it('should set y axis labels when there is one y axis', () => {
    component.yAxis = {
      title: {
        text: ''
      }
    };
    const studentData = {
      dataExplorerYAxisLabel: 'Count'
    };
    component.setYAxisLabels(studentData);
    expect(component.yAxis.title.text).toEqual('Count');
  });
}

function setYAxisLabelsWhenMultipleYAxes() {
  it('should set y axis labels when there are multiple y axes', () => {
    component.yAxis = [
      {
        title: {
          style: {
            color: ''
          },
          text: ''
        }
      },
      {
        title: {
          style: {
            color: ''
          },
          text: ''
        }
      }
    ];
    const studentData = {
      dataExplorerYAxisLabels: ['Count', 'Price']
    };
    component.setYAxisLabels(studentData);
    expect(component.yAxis[0].title.text).toEqual('Count');
    expect(component.yAxis[1].title.text).toEqual('Price');
  });
}

function setSeriesYIndex() {
  it('should set series Y index', () => {
    const firstYAxis = {
      title: {
        text: ''
      },
      min: 0,
      max: 100,
      units: '',
      locked: false
    };
    const secondYAxis = {
      title: {
        text: ''
      },
      min: 0,
      max: 1000,
      units: '',
      locked: false,
      opposite: true
    };
    component.yAxis = [firstYAxis, secondYAxis];
    const seriesOne: any = {};
    const seriesTwo: any = {};
    component.setSeriesYAxisIndex(seriesOne, 0);
    component.setSeriesYAxisIndex(seriesTwo, 1);
    expect(seriesOne.yAxis).toEqual(0);
    expect(seriesTwo.yAxis).toEqual(1);
  });
}

function checkIfYAxisLabelIsBlankWithSingleYAxisFalse() {
  it('should check if Y Axis label is blank with single y axis false', () => {
    const yAxis = {
      title: {
        text: 'Count'
      },
      min: 0,
      max: 100,
      units: '',
      locked: false
    };
    expect(component.isYAxisLabelBlank(yAxis, null)).toEqual(false);
  });
}

function checkIfYAxisLabelIsBlankWithSingleYAxisTrue() {
  it('should check if Y Axis label is blank with single Y axis true', () => {
    const yAxis = {
      title: {
        text: ''
      },
      min: 0,
      max: 100,
      units: '',
      locked: false
    };
    expect(component.isYAxisLabelBlank(yAxis, null)).toEqual(true);
  });
}

function checkIfYAxisLabelIsBlankWithMultipleYAxesFalse() {
  it('should check if Y Axis label is blank with multiple y axes false', () => {
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
    const yAxis = [firstYAxis, secondYAxis];
    expect(component.isYAxisLabelBlank(yAxis, 0)).toEqual(false);
    expect(component.isYAxisLabelBlank(yAxis, 1)).toEqual(false);
  });
}

function checkIfYAxisLabelIsBlankWithMultipleYAxesTrue() {
  it('should check if Y Axis label is blank with multiple y axes true', () => {
    const firstYAxis = {
      title: {
        text: ''
      },
      min: 0,
      max: 100,
      units: '',
      locked: false
    };
    const secondYAxis = {
      title: {
        text: ''
      },
      min: 0,
      max: 1000,
      units: '',
      locked: false,
      opposite: true
    };
    const yAxis = [firstYAxis, secondYAxis];
    expect(component.isYAxisLabelBlank(yAxis, 0)).toEqual(true);
    expect(component.isYAxisLabelBlank(yAxis, 1)).toEqual(true);
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

function getYAxisColor() {
  it('should get y axis color', () => {
    component.yAxis = [
      createYAxis('blue'),
      createYAxis('red'),
      createYAxis('green'),
      createYAxis('orange')
    ];
    expect(component.getYAxisColor(0)).toEqual('blue');
    expect(component.getYAxisColor(1)).toEqual('red');
    expect(component.getYAxisColor(2)).toEqual('green');
    expect(component.getYAxisColor(3)).toEqual('orange');
  });
}

function setSingleSeriesColorsToMatchYAxisWhenYAxisIsNotSet() {
  it('should set single series colors to match y axis when y axis is not set', () => {
    component.yAxis = [
      createYAxis('blue'),
      createYAxis('red'),
      createYAxis('green'),
      createYAxis('orange')
    ];
    const series: any = {};
    component.setSinglSeriesColorsToMatchYAxis(series);
    expect(series.color).toEqual('blue');
  });
}

function setSingleSeriesColorsToMatchYAxisWhenYAxisIsSet() {
  it('should set single series colors to match y axis when y axis is set', () => {
    component.yAxis = [
      createYAxis('blue'),
      createYAxis('red'),
      createYAxis('green'),
      createYAxis('orange')
    ];
    const series: any = { yAxis: 1 };
    component.setSinglSeriesColorsToMatchYAxis(series);
    expect(series.color).toEqual('red');
  });
}

function setAllSeriesColorsToMatchYAxes() {
  it('should set all series colors to match y axes', () => {
    component.yAxis = [
      createYAxis('blue'),
      createYAxis('red'),
      createYAxis('green'),
      createYAxis('orange')
    ];
    const series: any[] = [{ yAxis: 0 }, { yAxis: 1 }, { yAxis: 2 }, { yAxis: 3 }];
    component.setAllSeriesColorsToMatchYAxes(series);
    expect(series[0].color).toEqual('blue');
    expect(series[1].color).toEqual('red');
    expect(series[2].color).toEqual('green');
    expect(series[3].color).toEqual('orange');
  });
}

function getTrialsFromClassmates() {
  it('should get trials from classmates', fakeAsync(() => {
    const name1 = 'Step 1';
    const trial1 = { name: name1, show: true };
    const trials = [trial1];
    const componentState1 = createComponentStateObject(trials);
    spyOn(TestBed.inject(ProjectService), 'getNodePositionAndTitleByNodeId').and.returnValue(name1);
    spyOn(TestBed.inject(GraphService), 'getClassmateStudentWork').and.returnValue(
      of([componentState1])
    );
    component
      .getTrialsFromClassmates('node2', 'component2', 100, 'node1', 'component1', 'period')
      .then((mergedTrials) => {
        expect(mergedTrials).toEqual(trials);
      });
  }));
}
