import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { Point } from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { configureTestSuite } from 'ng-bullet';
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

class MockNotebookService {
  addNote() {}
  getNotebookConfig() {}
}
class MockNodeService {
  createNewComponentState() {
    return {};
  }
}

let component: GraphStudent;
const componentId = 'component1';
let fixture: ComponentFixture<GraphStudent>;
const nodeId = 'node1';
const sampleData = [
  [0, 0],
  [10, 20]
];

describe('GraphStudent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        HighchartsChartModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        UpgradeModule
      ],
      declarations: [GraphStudent],
      providers: [
        AnnotationService,
        ComponentService,
        ConfigService,
        GraphService,
        { provide: NodeService, useClass: MockNodeService },
        { provide: NotebookService, useClass: MockNotebookService },
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphStudent);
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({
      score: 0,
      comment: ''
    });
    spyOn(TestBed.inject(ProjectService), 'isSpaceExists').and.returnValue(false);
    component = fixture.componentInstance;
    component.nodeId = nodeId;
    component.componentContent = {
      enableTrials: true,
      id: componentId,
      series: [],
      type: 'Graph',
      xAxis: {
        min: 0,
        max: 100
      },
      yAxis: {
        min: 0,
        max: 50
      }
    };
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

  convertRowDataToSeriesData();
  createChartConfig();
  createComponentState();
  deleteTrial();
  getHighestTrial();
  getMinMaxValues();
  getNextSeriesId();
  getTrialNumbers();
  handleDeleteKeyPressed();
  handleTableConnectedComponentStudentDataChanged();
  isTrialHasEmptySeries();
  isYAxisLocked();
  makePointsUnique();
  makeSureXIsWithinXMinMaxLimits();
  makeSureYIsWithinYMinMaxLimits();
  newTrial();
  parseLatestTrial();
  removePointFromSeries();
  resetGraph();
  resetSeriesHelper();
  setStudentWork();
  setVerticalPlotLine();
  showOrHideTrials();
  undoClicked();
});

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
      component.yAxis.max = 100;
      component.resetGraph();
      expect(component.series).toEqual([]);
      expect(component.xAxis.max).toEqual(100);
      expect(component.yAxis.max).toEqual(50);
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
      makeSureWithinLimit('makeSureYIsWithinYMinMaxLimits', 50, 50);
      makeSureWithinLimit('makeSureYIsWithinYMinMaxLimits', 51, 50);
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
