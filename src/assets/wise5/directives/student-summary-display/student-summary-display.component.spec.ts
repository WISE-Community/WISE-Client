import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { ComponentContent } from '../../common/ComponentContent';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
import { StudentSummaryDisplay } from './student-summary-display.component';

let component: StudentSummaryDisplay;
let fixture: ComponentFixture<StudentSummaryDisplay>;

describe('StudentSummaryDisplayComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      declarations: [StudentSummaryDisplay],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(StudentSummaryDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  accumulateLabel();
  calculateCountsAndPercentage();
  calculateMaxScore();
  cleanLabel();
  convertObjectToArray();
  convertToNumber();
  createChartConfig();
  createChoicesSummaryData();
  createChoicesSeriesData();
  createDataPoint();
  createScoresSummaryData();
  createScoreSummaryData();
  createSeries();
  createTableSummaryData();
  createTableSeriesData();
  filterLatestScoreAnnotations();
  getChartColors();
  getDataPointColor();
  getGraphForSelf();
  getGraphTitleForPeriod();
  getGraphTitleForClass();
  getIndexByName();
  getPercentOfClassRespondedText();
  getPercentResponded();
  getSummaryDataCount();
  getTotalTableCount();
  getTotalWorkgroups();
  hasCorrectAnswer();
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
  describe('calculateMaxScore', () => {
    it('should calculate max score when there are no annotations', () => {
      const annotations = [];
      component.maxScore = 5;
      expect(component.calculateMaxScore(annotations)).toEqual(5);
    });
    it('should calculate max score when there are annotations', () => {
      const annotations = [
        {
          data: {
            value: 6
          }
        }
      ];
      component.maxScore = 5;
      expect(component.calculateMaxScore(annotations)).toEqual(6);
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

function cleanLabel() {
  describe('cleanLabel', () => {
    it('should clean the label', () => {
      expect(component.cleanLabel('hello world')).toEqual('Hello World');
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
            { name: 'Vanilla', y: 1 },
            { name: 'Chocolate', y: 2 },
            { name: 'Strawberry', y: 3 }
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

function createChoicesSummaryData() {
  describe('createChoiceSummaryData', () => {
    it('should create choice summary data', () => {
      const id = 'choice1';
      const text = 'Vanilla';
      const data = component.createChoiceSummaryData('choice1', 'Vanilla', null);
      expect(data).toEqual({ id: id, text: text, isCorrect: null, count: 0 });
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

function createChoicesSeriesData() {
  describe('createChoicesSeriesData', () => {
    it('should create choices series data', () => {
      const choices = [
        createMultipleChoiceComponentChoice('choice1', 'Vanilla'),
        createMultipleChoiceComponentChoice('choice2', 'Chocolate'),
        createMultipleChoiceComponentChoice('choice3', 'Strawberry')
      ];
      const multipleChoiceComponent = createMultipleChoiceComponent('component2', choices);
      const summaryData = {
        choice1: createMultipleChoiceSummaryDataChoice('choice1', 'Vanilla', false, 1),
        choice2: createMultipleChoiceSummaryDataChoice('choice2', 'Chocolate', false, 2),
        choice3: createMultipleChoiceSummaryDataChoice('choice3', 'Strawberry', false, 3)
      };
      const data = component.createChoicesSeriesData(multipleChoiceComponent, summaryData);
      const expectedData = [
        { name: 'Vanilla', y: 1 },
        { name: 'Chocolate', y: 2 },
        { name: 'Strawberry', y: 3 }
      ];
      expect(data).toEqual(expectedData);
    });
  });
}

function createMultipleChoiceComponent(id: string, choices: any[]) {
  return {
    choices: choices,
    id: id
  };
}

function createMultipleChoiceComponentChoice(
  id: string,
  text: string,
  isCorrect: boolean = false
): any {
  return {
    id: id,
    isCorrect: isCorrect,
    text: text
  };
}

function createMultipleChoiceSummaryDataChoice(
  id: string,
  text: string,
  isCorrect: boolean = false,
  count: number
): any {
  const choice = createMultipleChoiceComponentChoice(id, text, isCorrect);
  choice.count = count;
  return choice;
}

function hasCorrectAnswer() {
  describe('hasCorrectAnswer', () => {
    it('should check if there is a correct answer when there is none', () => {
      const choices = [
        createMultipleChoiceComponentChoice('choice1', 'Vanilla'),
        createMultipleChoiceComponentChoice('choice2', 'Chocolate'),
        createMultipleChoiceComponentChoice('choice3', 'Strawberry')
      ];
      const multipleChoiceComponent = createMultipleChoiceComponent('component2', choices);
      expect(component.hasCorrectAnswer(multipleChoiceComponent)).toEqual(false);
    });
    it('should check if there is a correct answer when there is one', () => {
      const choices = [
        createMultipleChoiceComponentChoice('choice1', 'Patrick'),
        createMultipleChoiceComponentChoice('choice2', 'Spongebob', true),
        createMultipleChoiceComponentChoice('choice3', 'Squidward')
      ];
      const multipleChoiceComponent = createMultipleChoiceComponent('component2', choices);
      expect(component.hasCorrectAnswer(multipleChoiceComponent)).toEqual(true);
    });
  });
}

function getDataPointColor() {
  describe('getDataPointColor', () => {
    it('should get data point color when the choice is correct', () => {
      component.highlightCorrectAnswer = true;
      const color = component.getDataPointColor(
        createMultipleChoiceComponentChoice('choice2', 'Spongebob', true)
      );
      expect(color).toEqual('#00C853');
    });
    it('should get data point color when the choice is incorrect', () => {
      component.highlightCorrectAnswer = true;
      const color = component.getDataPointColor(
        createMultipleChoiceComponentChoice('choice1', 'Patrick', false)
      );
      expect(color).toEqual('#C62828');
    });
  });
}

function createDataPoint() {
  describe('createDataPoint', () => {
    it('should create data point with color', () => {
      const name = 'Strawberry';
      const y = 3;
      const color = 'pink';
      const dataPoint = component.createDataPoint(name, y, color);
      expect(dataPoint).toEqual({ name: name, y: y, color: color });
    });
    it('should create data point without color', () => {
      const name = 'Strawberry';
      const y = 3;
      const dataPoint = component.createDataPoint(name, y);
      expect(dataPoint).toEqual({ name: name, y: y });
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
      const summaryData = component.createScoresSummaryData(annotations);
      expectSummaryDataCounts(summaryData, [0, 2, 0, 0, 0, 1]);
    });
  });
}

function createScoreAnnotation(score: number) {
  return {
    data: {
      value: score
    }
  };
}

function expectSummaryDataCounts(summaryData: any, counts: number[]) {
  for (let score = 0; score < summaryData.length; score++) {
    expect(summaryData[score].count).toEqual(counts[score]);
  }
}

function createScoreSummaryData() {
  describe('createScoreSummaryData', () => {
    it('should create score summary data', () => {
      const score = 5;
      expect(component.createScoreSummaryData(score)).toEqual({ score: score, count: 0 });
    });
  });
}

function getSummaryDataCount() {
  describe('getSummaryDataCount', () => {
    it('should get summary data count', () => {
      const summaryData = {
        0: {
          count: 0
        },
        1: {
          count: 2
        }
      };
      expect(component.getSummaryDataCount(summaryData, 0)).toEqual(0);
      expect(component.getSummaryDataCount(summaryData, 1)).toEqual(2);
    });
  });
}

function getIndexByName() {
  describe('getIndexByName', () => {
    it('should get index by name', () => {
      const singleSeries = {
        data: [
          createDataPointObject('Vanilla', 1),
          createDataPointObject('Chocolate', 2),
          createDataPointObject('Strawberry', 3)
        ]
      };
      const multipleSeries = [singleSeries];
      expect(component.getIndexByName(multipleSeries, 'Vanilla')).toEqual(0);
      expect(component.getIndexByName(multipleSeries, 'Chocolate')).toEqual(1);
      expect(component.getIndexByName(multipleSeries, 'Strawberry')).toEqual(2);
    });
  });
}

function createDataPointObject(name: string, y: number) {
  return {
    name: name,
    y: y
  };
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
      const colors = component.getChartColors();
      expect(colors).toEqual(['#e7beda', '#d794c2', '#c86baa', '#b94192', '#a9177a']);
    });
  });
}

function getGraphTitleForPeriod() {
  describe('getGraphTitleForPeriod', () => {
    it('should get graph title for period when student data type is responses', () => {
      expectGraphTitleForX('Period', 'responses');
    });
    it('should get graph title for period when student data type is scores', () => {
      expectGraphTitleForX('Period', 'scores');
    });
  });
}

function getGraphTitleForClass() {
  describe('getGraphTitleForClass', () => {
    it('should get graph title for class when student data type is responses', () => {
      expectGraphTitleForX('Class', 'responses');
    });
    it('should get graph title for class when student data type is scores', () => {
      expectGraphTitleForX('Class', 'scores');
    });
  });
}

function expectGraphTitleForX(source: string, studentDataType: string) {
  setResponseNumbers(component);
  component.studentDataType = studentDataType;
  let title: string;
  if (source === 'Period') {
    title = component.getGraphTitleForPeriod();
  } else {
    title = component.getGraphTitleForClass();
  }
  const upperCaseStudentDataType = studentDataType[0].toUpperCase() + studentDataType.substring(1);
  expect(title).toEqual(`${source} ${upperCaseStudentDataType} | 60% Responded (6/10)`);
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

function getPercentOfClassRespondedText() {
  describe('getPercentOfClassRespondedText', () => {
    it('should get percent of class responded text', () => {
      setResponseNumbers(component);
      component.studentDataType = 'responses';
      const text = component.getPercentOfClassRespondedText();
      expect(text).toEqual(`60% Responded (6/10)`);
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
      const data = [
        createDataPointObject('Vanilla', 1),
        createDataPointObject('Chocolate', 2),
        createDataPointObject('Strawberry', 3)
      ];
      const series = component.createSeries(data);
      expect(series.length).toEqual(1);
      expect(series[0].data).toEqual(data);
    });
    it('should create column series with correct answer', () => {
      const data = [
        createDataPointObject('Patrick', 1),
        createDataPointObject('Spongebob', 2),
        createDataPointObject('Squidward', 3)
      ];
      component.highlightCorrectAnswer = true;
      component.chartType = 'column';
      const series = component.createSeries(data);
      expect(series.length).toEqual(3);
      expect(series[0].data).toEqual(data);
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

function createAnnotation(id: number, toWorkgroupId: number, type: string, serverSaveTime: number) {
  return {
    id: id,
    serverSaveTime: serverSaveTime,
    type: type,
    toWorkgroupId: toWorkgroupId
  };
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

function accumulateLabel() {
  describe('accumulateLabel', () => {
    it('should accumulate label', () => {
      const labelToCount = {};
      component.accumulateLabel(labelToCount, 'Cats', 1);
      component.accumulateLabel(labelToCount, 'Cats', '1');
      expect(labelToCount['Cats']).toEqual(2);
    });
  });
}

function createTableSummaryData() {
  describe('createTableSummaryData', () => {
    it('should create table summary data', () => {
      const componentStates = [
        createTableComponentState([
          ['Object', 'Count'],
          ['Cats', '1']
        ]),
        createTableComponentState([
          ['Object', 'Count'],
          ['Cats', '2']
        ]),
        createTableComponentState([
          ['Object', 'Count'],
          ['Dogs', '2']
        ])
      ];
      const labelToCount = component.createTableSummaryData(componentStates);
      expect(labelToCount['Cats']).toEqual(3);
      expect(labelToCount['Dogs']).toEqual(2);
    });
  });
}

function createTableComponentState(textTableData: any[]) {
  return {
    studentData: {
      tableData: createTableDataFromArray(textTableData)
    }
  };
}

function createTableDataFromArray(textRows: any[]) {
  const tableData = [];
  for (const textRow of textRows) {
    const row = [];
    for (const textCell of textRow) {
      row.push(createTableCell(textCell));
    }
    tableData.push(row);
  }
  return tableData;
}

function createTableCell(text: string) {
  return {
    text: text
  };
}

function createTableSeriesData() {
  describe('createTableSeriesData', () => {
    it('should create table series data', () => {
      const summaryData = {
        Cats: 3,
        Dogs: 2
      };
      const data = component.createTableSeriesData({}, summaryData);
      expect(data).toEqual([
        { name: 'Cats', y: 3 },
        { name: 'Dogs', y: 2 }
      ]);
    });
  });
}

function getTotalTableCount() {
  describe('getTotalTableCount', () => {
    it('should get total table count', () => {
      const seriesData = [{ y: 1 }, { y: 2 }, { y: 3 }];
      expect(component.getTotalTableCount(seriesData)).toEqual(6);
    });
  });
}

function convertToNumber() {
  describe('convertToNumber', () => {
    it('should convert to number when value is an empty string', () => {
      expect(component.convertToNumber('')).toEqual(0);
    });
    it('should convert to number when value is not a number', () => {
      expect(component.convertToNumber('a')).toEqual(0);
    });
    it('should convert to number when value is a number string', () => {
      expect(component.convertToNumber('1')).toEqual(1);
    });
    it('should convert to number when value is a number', () => {
      expect(component.convertToNumber(1)).toEqual(1);
    });
  });
}
