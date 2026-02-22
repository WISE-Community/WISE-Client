import { Annotation } from '../../common/Annotation';
import { Choice } from '../../components/multipleChoice/Choice';
import { ComponentContent } from '../../common/ComponentContent';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../services/configService';
import { MultipleChoiceSummaryDataPoint } from '../summary-display/summary-data/MultipleChoiceSummaryDataPoint';
import { ProjectService } from '../../services/projectService';
import { provideHttpClient } from '@angular/common/http';
import { ScoreSummaryData } from '../summary-display/summary-data/ScoreSummaryData';
import { ScoreSummaryDataPoint } from '../summary-display/summary-data/ScoreSummaryDataPoint';
import { SeriesData } from '../../common/SeriesData';
import { SeriesDataPoint } from '../../common/SeriesDataPoint';
import { StudentSummaryDisplay } from './student-summary-display.component';
import { SummaryData } from '../summary-display/summary-data/SummaryData';
import { MockProvider, MockProviders } from 'ng-mocks';
import { of } from 'rxjs';
import { StudentDataService } from '../../services/studentDataService';
import { DataService } from '../../../../app/services/data.service';
import { AnnotationService } from '../../services/annotationService';
import { CRaterService } from '../../services/cRaterService';
import { SummaryService } from '../../components/summary/summaryService';

let component: StudentSummaryDisplay;
let fixture: ComponentFixture<StudentSummaryDisplay>;
describe('StudentSummaryDisplayComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudentSummaryDisplay],
      providers: [
        provideHttpClient(),
        MockProvider(StudentDataService, { studentWorkSavedToServer$: of() }),
        { provide: DataService, useClass: StudentDataService },
        MockProviders(AnnotationService, ConfigService, CRaterService, ProjectService),
        SummaryService
      ]
    });
    fixture = TestBed.createComponent(StudentSummaryDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  calculateCountsAndPercentage();
  calculateMaxScore();
  convertObjectToArray();
  createChartConfig();
  createSeriesDataPoint();
  createScoresSummaryData();
  createScoreSummaryDataPoint();
  createSeries();
  filterLatestScoreAnnotations();
  getChartColors();
  getGraphForSelf();
  getGraphTitleForClass();
  getPercentResponded();
  getTotalWorkgroups();
  initializeOtherComponent();
  setCustomLabelColors();
  setLatestAnnotationIfNewer();
  setNumDummySamples();
});

function calculateCountsAndPercentage() {
  describe('calculateCountsAndPercentage', () => {
    it('should calculate counts and percentage', () => {
      const totalWorkgroups = 20;
      spyOn(component, 'getTotalWorkgroups').and.returnValue(totalWorkgroups);
      const dataCount = 10;
      component.calculateCountsAndPercentage(dataCount);
      expect(component.numResponses).toEqual(dataCount);
      expect(component.totalWorkgroups).toEqual(totalWorkgroups);
      expect(component.percentResponded).toEqual(50);
    });
  });
}

function calculateMaxScore() {
  describe('setMinMaxScore', () => {
    it('should not update min and max scores when there are no annotations', () => {
      const annotations = [];
      component.maxScore = 5;
      component.setMinMaxScore(annotations);
      expect(component.studentMaxScore).toEqual(5);
      expect(component.studentMinScore).toEqual(1);
    });
    it('should update min and max scores when there are annotations', () => {
      const annotation1 = new Annotation({
        data: {
          value: 6
        }
      });
      const annotation2 = new Annotation({
        data: {
          value: 0
        }
      });
      const annotation3 = new Annotation({
        data: {
          value: 2
        }
      });
      const annotations = [annotation1, annotation2, annotation3];
      component.maxScore = 5;
      component.setMinMaxScore(annotations);
      expect(component.studentMaxScore).toEqual(6);
      expect(component.studentMinScore).toEqual(0);
    });
  });
}

function getTotalWorkgroups() {
  describe('getTotalWorkgroups', () => {
    it('should get total workgroups when in vle preview mode', () => {
      spyOn(component, 'isVLEPreview').and.returnValue(true);
      const dataCount = 10;
      expect(component.getTotalWorkgroups(dataCount)).toEqual(dataCount);
    });
    it('should get total workgroups when in authoring preview mode', () => {
      spyOn(component, 'isVLEPreview').and.returnValue(false);
      spyOn(component, 'isAuthoringPreview').and.returnValue(true);
      const dataCount = 10;
      expect(component.getTotalWorkgroups(dataCount)).toEqual(dataCount);
    });
    it('should get total workgroups when not in preview mode', () => {
      spyOn(component, 'isVLEPreview').and.returnValue(false);
      spyOn(component, 'isAuthoringPreview').and.returnValue(false);
      const numWorkgroupsInPeriod = 20;
      spyOn(TestBed.inject(ConfigService), 'getNumberOfWorkgroupsInPeriod').and.returnValue(
        numWorkgroupsInPeriod
      );
      const dataCount = 10;
      expect(component.getTotalWorkgroups(dataCount)).toEqual(numWorkgroupsInPeriod);
    });
  });
}

function getPercentResponded() {
  describe('getPercentResponded', () => {
    it('should get percent responded', () => {
      expect(component.getPercentResponded(6, 10)).toEqual(60);
    });
  });
}

function createChartConfig() {
  describe('createChartConfig', () => {
    it('should create chart config', () => {
      const chartType = 'bar';
      const title = 'Favorite Ice Cream Flavors';
      const xAxisType = 'category';
      const total = 10;
      const series = [
        {
          data: [
            createDataPointObject('Vanilla', 1),
            createDataPointObject('Chocolate', 2),
            createDataPointObject('Strawberry', 3)
          ]
        }
      ];
      const colors = component.colors.palette;
      const config = component.createChartConfig(
        chartType,
        title,
        xAxisType,
        total,
        series,
        colors
      );
      expect(config.chart.type).toEqual(chartType);
      expect(config.title.text).toEqual(title);
      expect(config.series).toEqual(series);
      expect(config.xAxis.type).toEqual(xAxisType);
    });
  });
}

function setNumDummySamples() {
  describe('setNumDummySamples', () => {
    it('should set num dummy samples when source is period', () => {
      expectNumDummySamples('period', 10);
    });
    it('should set num dummy samples when source is all periods', () => {
      expectNumDummySamples('allPeriods', 20);
    });
    it('should set num dummy samples when source is self', () => {
      expectNumDummySamples('self', 1);
    });
  });
}

function expectNumDummySamples(source: string, expectedNumDummySamples: number) {
  component.source = source;
  component.setNumDummySamples();
  expect(component.numDummySamples).toEqual(expectedNumDummySamples);
}

function initializeOtherComponent() {
  describe('initializeOtherComponent', () => {
    it('should initialize other component', () => {
      const otherComponentType = 'MultipleChoice';
      const otherComponent = {
        id: 'component2',
        type: otherComponentType
      } as ComponentContent;
      spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue(otherComponent);
      component.initializeOtherComponent();
      expect(component.otherComponent).toEqual(otherComponent);
      expect(component.otherComponentType).toEqual(otherComponentType);
    });
  });
}

function createMultipleChoiceComponentChoice(
  id: string,
  text: string,
  isCorrect: boolean = false
): Choice {
  return new Choice(id, text, isCorrect, '');
}

function createMultipleChoiceSummaryDataPoint(
  id: string,
  count: number
): MultipleChoiceSummaryDataPoint {
  return new MultipleChoiceSummaryDataPoint(id, count);
}

function createSeriesDataPoint() {
  describe('createDataPoint', () => {
    it('should create data point with color', () => {
      const name = 'Strawberry';
      const y = 3;
      const color = 'pink';
      const dataPoint = new SeriesDataPoint(name, y, color);
      expect(dataPoint.name).toEqual(name);
      expect(dataPoint.y).toEqual(y);
      expect(color).toEqual(color);
    });
    it('should create data point without color', () => {
      const name = 'Strawberry';
      const y = 3;
      const dataPoint = new SeriesDataPoint(name, y);
      expect(dataPoint.name).toEqual(name);
      expect(dataPoint.y).toEqual(y);
      expect(dataPoint.color).toBeUndefined();
    });
  });
}

function createScoresSummaryData() {
  describe('createScoresSummaryData', () => {
    it('should create scores summary data', () => {
      const annotations = [
        createScoreAnnotation(1),
        createScoreAnnotation(5),
        createScoreAnnotation(1)
      ];
      const summaryData = new ScoreSummaryData(annotations, 5);
      expectSummaryDataCounts(summaryData, [0, 2, 0, 0, 0, 1]);
    });
  });
}

function createScoreAnnotation(score: number): Annotation {
  return new Annotation({
    data: {
      value: score
    }
  });
}

function expectSummaryDataCounts(summaryData: SummaryData, counts: number[]) {
  for (let score = 0; score < summaryData.getDataPoints().length; score++) {
    expect(summaryData.getDataPointCountById(score)).toEqual(counts[score]);
  }
}

function createScoreSummaryDataPoint() {
  describe('createScoreSummaryData', () => {
    it('should create score summary data', () => {
      const score = 5;
      const dataPoint = new ScoreSummaryDataPoint(5);
      expect(dataPoint.getId()).toEqual(score);
      expect(dataPoint.getCount()).toEqual(0);
    });
  });
}

function createDataPointObject(name: string, y: number): SeriesDataPoint {
  return new SeriesDataPoint(name, y);
}

function setCustomLabelColors() {
  describe('setCustomLabelColors', () => {
    it('should set custom label colors', () => {
      const customLabelColors = [
        { label: 'Blue', color: 'blue' },
        { label: 'Green', color: 'green' },
        { label: 'Red', color: 'red' }
      ];
      const singleSeries = {
        data: [
          createDataPointObject('Red', 1),
          createDataPointObject('Green', 2),
          createDataPointObject('Blue', 3)
        ]
      };
      const multipleSeries = [singleSeries];
      const colors = [];
      component.setCustomLabelColors(multipleSeries, colors, customLabelColors);
      expect(colors[0]).toEqual('red');
      expect(colors[1]).toEqual('green');
      expect(colors[2]).toEqual('blue');
    });
  });
}

function getChartColors() {
  describe('getChartColors', () => {
    it('should get chart colors', () => {
      component.studentMaxScore = 5;
      const colors = component.getChartColors();
      expect(colors).toEqual(['#e7beda', '#d794c2', '#c86baa', '#b94192', '#a9177a']);
    });
  });
}

function getGraphTitleForClass() {
  describe('getGraphTitleForClass', () => {
    it('should get graph title for class when student data type is responses', () => {
      expectGraphTitleForX('responses', 'Responses');
    });
    it('should get graph title for class when student data type is scores', () => {
      expectGraphTitleForX('scores', 'Scores (Mean: 0)');
    });
  });
}

function expectGraphTitleForX(studentDataType: string, expectedTitle: string) {
  setResponseNumbers(component);
  component.studentDataType = studentDataType;
  expect(component.getGraphTitleForClass()).toEqual(expectedTitle);
}

function getGraphForSelf() {
  describe('getGraphTitle', () => {
    it('should get graph title for self when student data type is responses', () => {
      component.source = 'self';
      component.studentDataType = 'responses';
      expect(component.getGraphTitle()).toEqual('Your Response');
    });
    it('should get graph title for self when student data type is scores', () => {
      component.source = 'self';
      component.studentDataType = 'scores';
      expect(component.getGraphTitle()).toEqual('Your Score');
    });
  });
}

function setResponseNumbers(component: any) {
  component.percentResponded = 60;
  component.numResponses = 6;
  component.totalWorkgroups = 10;
}

function createSeries() {
  describe('createSeries', () => {
    it('should create series without correct answer', () => {
      const data = new SeriesData([
        createDataPointObject('Vanilla', 1),
        createDataPointObject('Chocolate', 2),
        createDataPointObject('Strawberry', 3)
      ]);
      const series = component.createSeries(data);
      expect(series.length).toEqual(1);
      expect(series[0].data).toEqual(data.getDataPoints());
    });
    it('should create column series with correct answer', () => {
      const data = new SeriesData([
        createDataPointObject('Patrick', 1),
        createDataPointObject('Spongebob', 2),
        createDataPointObject('Squidward', 3)
      ]);
      component.highlightCorrectAnswer = true;
      component.chartType = 'column';
      const series = component.createSeries(data);
      expect(series.length).toEqual(3);
      expect(series[0].data).toEqual(data.getDataPoints());
      expect(series[1].name).toEqual('Correct');
      expect(series[2].name).toEqual('Incorrect');
    });
  });
}

function convertObjectToArray() {
  describe('convertObjectToArray', () => {
    it('should convert object to array', () => {
      const obj1 = { id: 100 };
      const obj2 = { id: 200 };
      const parentObj = {
        10: obj1,
        20: obj2
      };
      const arr = component.convertObjectToArray(parentObj);
      expect(arr[0]).toEqual(obj1);
      expect(arr[1]).toEqual(obj2);
    });
  });
}

function filterLatestScoreAnnotations() {
  describe('filterLatestScoreAnnotations', () => {
    it('should filter latest score annotations', () => {
      const annotations = [
        createAnnotation(1, 10, 'score', 1000),
        createAnnotation(2, 11, 'score', 2000),
        createAnnotation(3, 12, 'score', 3000),
        createAnnotation(4, 10, 'score', 4000),
        createAnnotation(5, 11, 'score', 5000)
      ];
      const latestAnnotations = component.filterLatestScoreAnnotations(annotations);
      expect(latestAnnotations[0].id).toEqual(4);
      expect(latestAnnotations[1].id).toEqual(5);
      expect(latestAnnotations[2].id).toEqual(3);
    });
  });
}

function createAnnotation(
  id: number,
  toWorkgroupId: number,
  type: string,
  serverSaveTime: number
): Annotation {
  return new Annotation({
    id: id,
    serverSaveTime: serverSaveTime,
    type: type,
    toWorkgroupId: toWorkgroupId
  });
}

function setLatestAnnotationIfNewer() {
  describe('setLatestAnnotationIfNewer', () => {
    let latestAnnotations;
    beforeEach(() => {
      latestAnnotations = {
        10: createAnnotation(1, 10, 'score', 1000),
        11: createAnnotation(2, 11, 'score', 2000),
        12: createAnnotation(3, 12, 'score', 3000)
      };
    });
    it('should set latest annotation if newer when annotation is not newer', () => {
      component.setLatestAnnotationIfNewer(
        latestAnnotations,
        createAnnotation(4, 12, 'score', 2000)
      );
      expect(latestAnnotations[12].id).toEqual(3);
    });
    it('should set latest annotation if newer when annotation is newer', () => {
      component.setLatestAnnotationIfNewer(
        latestAnnotations,
        createAnnotation(4, 12, 'score', 4000)
      );
      expect(latestAnnotations[12].id).toEqual(4);
    });
  });
}
