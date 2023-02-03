import * as Highcharts from 'highcharts';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
import { SummaryService } from '../../components/summary/summaryService';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { copy } from '../../common/object/object';
import { rgbToHex } from '../../common/color/color';

@Component({
  selector: 'summary-display',
  templateUrl: 'summary-display.component.html',
  styleUrls: ['summary-display.component.scss']
})
export abstract class SummaryDisplay {
  chartConfig: any;
  colors = {
    palette: [
      '#1a237e',
      '#701e82',
      '#aa187b',
      '#d72c6c',
      '#f65158',
      '#ff7d43',
      '#ffab32',
      '#fdd835',
      '#ffee58',
      '#ade563',
      '#50d67f',
      '#00c29d',
      '#00aab3',
      '#0090bc',
      '#0074b4',
      '#01579b'
    ],
    singleHue: 'rgb(170, 24, 123)',
    correct: '#00C853',
    incorrect: '#C62828'
  };
  dataService: any = null;
  defaultMaxScore: number = 5;
  hasCorrectness: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  maxScore: number = 5;
  numDummySamples: number;
  numResponses: number;
  otherComponent: any;
  otherComponentType: string;
  percentResponded: number;
  studentWorkSavedToServerSubscription: Subscription;
  totalWorkgroups: number;

  @Input() nodeId: string;
  @Input() componentId: string;
  @Input() highlightCorrectAnswer: boolean;
  @Input() studentDataType: string;
  @Input() source: string;
  @Input() periodId: number;
  @Input() chartType: string;
  @Input() hasWarning: boolean;
  @Input() warningMessage: string;
  @Input() customLabelColors: any[];
  @Input() doRender: boolean;

  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    protected projectService: ProjectService,
    protected summaryService: SummaryService
  ) {}

  ngOnInit() {
    this.setNumDummySamples();
    this.initializeOtherComponent();
    this.initializeDataService();
    this.initializeCustomLabelColors();
    if (this.doRender) {
      this.renderDisplay();
    }
  }

  setNumDummySamples() {
    if (this.isSourcePeriod()) {
      this.numDummySamples = 10;
    } else if (this.isSourceAllPeriods()) {
      this.numDummySamples = 20;
    } else {
      this.numDummySamples = 1;
    }
  }

  initializeOtherComponent() {
    this.otherComponent = this.projectService.getComponent(this.nodeId, this.componentId);
    if (this.otherComponent != null) {
      this.otherComponentType = this.otherComponent.type;
    }
  }

  initializeDataService() {
    // implemented by children
  }

  initializeCustomLabelColors() {
    if (this.customLabelColors == null) {
      this.customLabelColors = [];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.doRender.firstChange) {
      this.renderDisplay();
    }
  }

  isVLEPreview() {
    return this.configService.isPreview();
  }

  isAuthoringPreview() {
    return this.configService.isAuthoring();
  }

  isStudentRun() {
    return this.configService.isStudentRun();
  }

  isClassroomMonitor() {
    return this.configService.isClassroomMonitor();
  }

  renderDisplay() {
    if (this.studentDataType === 'responses') {
      this.renderResponses();
    } else if (this.studentDataType === 'scores') {
      this.renderScores();
    }
  }

  renderResponses() {
    if (this.isSourceSelf() && this.isClassroomMonitor()) {
      this.displaySourceSelfMessageToTeacher();
    } else if (this.isSourceSelf()) {
      this.renderSelfResponse();
    } else {
      this.renderClassResponses();
    }
  }

  displaySourceSelfMessageToTeacher() {
    this.doRender = false;
    this.warningMessage = $localize`The student will see a graph of their individual data here.`;
    this.hasWarning = true;
  }

  renderSelfResponse() {
    const componentStates = [];
    const componentState = this.getResponseForSelf();
    if (componentState != null) {
      componentStates.push(componentState);
    }
    this.processComponentStates(componentStates);
  }

  getResponseForSelf() {
    if (this.isVLEPreview() || this.isStudentRun()) {
      return this.dataService.getLatestComponentStateByNodeIdAndComponentId(
        this.nodeId,
        this.componentId
      );
    } else if (this.isAuthoringPreview()) {
      return this.createDummyComponentState(this.otherComponent);
    }
  }

  renderClassResponses() {
    this.getLatestStudentWork(this.nodeId, this.componentId, this.source, this.periodId).subscribe(
      (componentStates = []) => {
        this.processComponentStates(componentStates);
      }
    );
  }

  getLatestScores(
    nodeId: string,
    componentId: string,
    source: string,
    periodId: number
  ): Observable<any[]> {
    if (this.isVLEPreview()) {
      return this.getDummyStudentScoresForVLEPreview();
    } else if (this.isAuthoringPreview()) {
      return this.getDummyStudentScoresForAuthoringPreview();
    } else {
      return this.summaryService
        .getLatestClassmateScores(
          this.configService.getRunId(),
          periodId,
          nodeId,
          componentId,
          source
        )
        .pipe(
          tap((scoreAnnotations) => {
            return this.filterLatestScoreAnnotations(scoreAnnotations);
          })
        );
    }
  }

  renderScores() {
    if (this.isSourceSelf() && this.isClassroomMonitor()) {
      this.displaySourceSelfMessageToTeacher();
    } else if (this.isSourceSelf()) {
      this.renderSelfScore();
    } else {
      this.renderClassScores();
    }
  }

  renderSelfScore() {
    this.setMaxScore(this.otherComponent);
    const annotation = this.getScoreForSelf();
    const annotations = [];
    if (annotation != null) {
      annotations.push(annotation);
    }
    this.processScoreAnnotations(annotations);
  }

  getScoreForSelf() {
    if (this.isVLEPreview() || this.isStudentRun()) {
      return this.getLatestScoreAnnotationForWorkgroup();
    } else if (this.isAuthoringPreview()) {
      return this.createDummyScoreAnnotation();
    }
  }

  getLatestScoreAnnotationForWorkgroup() {
    return this.annotationService.getLatestScoreAnnotation(
      this.nodeId,
      this.componentId,
      this.configService.getWorkgroupId()
    );
  }

  renderClassScores() {
    this.setMaxScore(this.otherComponent);
    this.getLatestScores(this.nodeId, this.componentId, this.source, this.periodId).subscribe(
      (annotations) => {
        this.processScoreAnnotations(annotations);
      }
    );
  }

  setMaxScore(component) {
    if (component.maxScore != null) {
      this.maxScore = component.maxScore;
    } else {
      this.maxScore = this.defaultMaxScore;
    }
  }

  getLatestStudentWork(
    nodeId: string,
    componentId: string,
    source: string,
    periodId: number
  ): Observable<any> {
    if (this.isVLEPreview()) {
      return this.getDummyStudentWorkForVLEPreview(nodeId, componentId);
    } else if (this.isAuthoringPreview()) {
      return this.getDummyStudentWorkForAuthoringPreview();
    } else {
      return this.summaryService.getLatestClassmateStudentWork(
        this.configService.getRunId(),
        periodId,
        nodeId,
        componentId,
        source
      );
    }
  }

  getPeriodIdValue(periodId: number): number {
    return periodId === -1 ? null : periodId;
  }

  filterLatestScoreAnnotations(annotations) {
    const latestAnnotations = {};
    for (const annotation of annotations) {
      if (annotation.type === 'score' || annotation.type === 'autoScore') {
        this.setLatestAnnotationIfNewer(latestAnnotations, annotation);
      }
    }
    return this.convertObjectToArray(latestAnnotations);
  }

  setLatestAnnotationIfNewer(latestAnnotations, annotation) {
    const workgroupId = annotation.toWorkgroupId;
    const latestAnnotation = latestAnnotations[workgroupId];
    if (latestAnnotation == null || annotation.serverSaveTime > latestAnnotation.serverSaveTime) {
      latestAnnotations[workgroupId] = annotation;
    }
  }

  convertObjectToArray(obj) {
    return Object.keys(obj).map((key) => {
      return obj[key];
    });
  }

  getDummyStudentWorkForVLEPreview(nodeId: string, componentId: string): Observable<any> {
    const componentStates = this.createDummyComponentStates();
    const componentState = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
      nodeId,
      componentId
    );
    if (componentState != null) {
      componentStates.push(componentState);
    }
    return of(componentStates);
  }

  getDummyStudentScoresForVLEPreview(): Observable<any> {
    const annotations = this.createDummyScoreAnnotations();
    const annotation = this.getLatestScoreAnnotationForWorkgroup();
    if (annotation != null) {
      annotations.push(annotation);
    }
    return of(annotations);
  }

  getDummyStudentWorkForAuthoringPreview(): Observable<any> {
    return of(this.createDummyComponentStates());
  }

  getDummyStudentScoresForAuthoringPreview(): Observable<any> {
    return of(this.createDummyScoreAnnotations());
  }

  createDummyComponentStates() {
    const dummyComponentStates = [];
    for (let dummyCounter = 0; dummyCounter < this.numDummySamples; dummyCounter++) {
      dummyComponentStates.push(this.createDummyComponentState(this.otherComponent));
    }
    return dummyComponentStates;
  }

  createDummyComponentState(component) {
    if (this.otherComponentType === 'MultipleChoice') {
      return this.createDummyMultipleChoiceComponentState(component);
    } else if (this.otherComponentType === 'Table') {
      return this.createDummyTableComponentState(component);
    }
  }

  createDummyMultipleChoiceComponentState(component) {
    const choices = component.choices;
    return {
      studentData: {
        studentChoices: [{ id: this.getRandomChoice(choices).id }]
      }
    };
  }

  createDummyTableComponentState(component) {
    if (this.isAuthoringPreview()) {
      return {
        studentData: {
          tableData: this.getDummyTableData()
        }
      };
    } else {
      return {
        studentData: {
          tableData: this.getDummyTableDataSimilarToLatestComponentState()
        }
      };
    }
  }

  getDummyTableData() {
    return [
      [{ text: 'Trait' }, { text: 'Count' }],
      [{ text: 'Blue' }, { text: '3' }],
      [{ text: 'Green' }, { text: '2' }],
      [{ text: 'Red' }, { text: '1' }]
    ];
  }

  getDummyTableDataSimilarToLatestComponentState() {
    let tableData = [];
    const componentState = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    if (componentState != null) {
      tableData = copy(componentState.studentData.tableData);
      for (let r = 1; r < tableData.length; r++) {
        tableData[r][1].text = this.getRandomSimilarNumber(tableData[r][1].text);
      }
    }
    return tableData;
  }

  getRandomSimilarNumber(text) {
    return Math.ceil(this.convertToNumber(text) * Math.random());
  }

  getRandomChoice(choices) {
    return choices[Math.floor(Math.random() * choices.length)];
  }

  createDummyScoreAnnotations() {
    const dummyScoreAnnotations = [];
    for (let dummyCounter = 0; dummyCounter < this.numDummySamples; dummyCounter++) {
      dummyScoreAnnotations.push(this.createDummyScoreAnnotation());
    }
    return dummyScoreAnnotations;
  }

  createDummyScoreAnnotation() {
    return {
      data: {
        value: this.getRandomScore()
      },
      type: 'score'
    };
  }

  getRandomScore() {
    return Math.ceil(Math.random() * this.maxScore);
  }

  processComponentStates(componentStates) {
    if (this.otherComponentType === 'MultipleChoice') {
      const summaryData = this.createChoicesSummaryData(this.otherComponent, componentStates);
      const seriesData = this.createChoicesSeriesData(this.otherComponent, summaryData);
      this.calculateCountsAndPercentage(componentStates.length);
      this.renderGraph(seriesData, componentStates.length);
    } else if (this.otherComponentType === 'Table') {
      const summaryData = this.createTableSummaryData(componentStates);
      const seriesData = this.createTableSeriesData(this.otherComponent, summaryData);
      const totalCount = this.getTotalTableCount(seriesData);
      this.calculateCountsAndPercentage(componentStates.length);
      this.renderGraph(seriesData, totalCount);
    }
  }

  createTableSummaryData(componentStates) {
    const labelToCount = {};
    for (const componentState of componentStates) {
      const tableData = componentState.studentData.tableData;
      for (let r = 1; r < tableData.length; r++) {
        const row = tableData[r];
        const key = row[0].text;
        const value = row[1].text;
        if (key != '') {
          this.accumulateLabel(labelToCount, this.cleanLabel(key), value);
        }
      }
    }
    return labelToCount;
  }

  cleanLabel(label) {
    return (label + '')
      .trim()
      .toLowerCase()
      .split(' ')
      .map((word) => {
        if (word.length > 0) {
          return word[0].toUpperCase() + word.substr(1);
        } else {
          return '';
        }
      })
      .join(' ');
  }

  createTableSeriesData(component, summaryData) {
    const data = [];
    for (const key of Object.keys(summaryData)) {
      const count = summaryData[key];
      const dataPoint = this.createDataPoint(key, count, null);
      data.push(dataPoint);
    }
    return data;
  }

  getTotalTableCount(seriesData) {
    let total = 0;
    for (const dataPoint of seriesData) {
      total += dataPoint.y;
    }
    return total;
  }

  accumulateLabel(labelToCount, key, value) {
    if (labelToCount[key] == null) {
      labelToCount[key] = 0;
    }
    labelToCount[key] += this.convertToNumber(value);
  }

  convertToNumber(value) {
    if (!isNaN(Number(value))) {
      return Number(value);
    } else {
      return 0;
    }
  }

  processScoreAnnotations(annotations) {
    this.updateMaxScoreIfNecessary(annotations);
    const summaryData = this.createScoresSummaryData(annotations);
    const { data, total } = this.createScoresSeriesData(summaryData);
    this.calculateCountsAndPercentage(annotations.length);
    this.renderGraph(data, total);
  }

  updateMaxScoreIfNecessary(annotations) {
    this.maxScore = this.calculateMaxScore(annotations);
  }

  calculateMaxScore(annotations) {
    let maxScoreSoFar = this.maxScore;
    for (const annotation of annotations) {
      const score = this.getScoreFromAnnotation(annotation);
      maxScoreSoFar = Math.max(this.maxScore, score);
    }
    return maxScoreSoFar;
  }

  createChoicesSummaryData(component, componentStates) {
    const summaryData = {};
    for (const choice of component.choices) {
      summaryData[choice.id] = this.createChoiceSummaryData(
        choice.id,
        choice.text,
        choice.isCorrect
      );
    }
    for (const componentState of componentStates) {
      this.addComponentStateDataToSummaryData(summaryData, componentState);
    }
    return summaryData;
  }

  createChoiceSummaryData(id, text, isCorrect) {
    return {
      id: id,
      text: text,
      isCorrect: isCorrect,
      count: 0
    };
  }

  addComponentStateDataToSummaryData(summaryData, componentState) {
    for (const choice of componentState.studentData.studentChoices) {
      this.incrementSummaryData(summaryData, choice.id);
    }
  }

  createChoicesSeriesData(component, summaryData) {
    const data = [];
    this.hasCorrectness = this.hasCorrectAnswer(component);
    for (const choice of component.choices) {
      const count = this.getSummaryDataCount(summaryData, choice.id);
      const color = this.getDataPointColor(choice);
      let text = choice.text;
      if (this.highlightCorrectAnswer && this.chartType === 'pie') {
        text = text + ' (' + (choice.isCorrect ? $localize`Correct` : $localize`Incorrect`) + ')';
      }
      const dataPoint = this.createDataPoint(text, count, color);
      data.push(dataPoint);
    }
    return data;
  }

  hasCorrectAnswer(component) {
    for (const choice of component.choices) {
      if (choice.isCorrect) {
        return true;
      }
    }
    return false;
  }

  getDataPointColor(choice) {
    let color = null;
    if (this.highlightCorrectAnswer) {
      if (choice.isCorrect) {
        color = this.colors.correct;
      } else {
        color = this.colors.incorrect;
      }
    }
    return color;
  }

  createDataPoint(name, y, color = null) {
    if (color) {
      return {
        name: name,
        y: y,
        color: color
      };
    } else {
      return {
        name: name,
        y: y
      };
    }
  }

  createScoresSummaryData(annotations) {
    const summaryData = {};
    for (let scoreValue = 0; scoreValue <= this.maxScore; scoreValue++) {
      summaryData[scoreValue] = this.createScoreSummaryData(scoreValue);
    }
    for (const annotation of annotations) {
      this.addAnnotationDataToSummaryData(summaryData, annotation);
    }
    return summaryData;
  }

  createScoreSummaryData(score) {
    return {
      score: score,
      count: 0
    };
  }

  addAnnotationDataToSummaryData(summaryData, annotation) {
    const score = this.getScoreFromAnnotation(annotation);
    this.incrementSummaryData(summaryData, score);
  }

  getScoreFromAnnotation(annotation) {
    return annotation.data.value;
  }

  incrementSummaryData(summaryData, id) {
    summaryData[id].count += 1;
  }

  createScoresSeriesData(summaryData) {
    const data = [];
    let total = 0;
    for (let scoreValue = 1; scoreValue <= this.maxScore; scoreValue++) {
      const count = this.getSummaryDataCount(summaryData, scoreValue);
      const dataPoint = this.createDataPoint(scoreValue, count, null);
      data.push(dataPoint);
      total += count;
    }
    return { data: data, total: total };
  }

  renderGraph(data, total) {
    const chartType = this.chartType;
    const title = this.getGraphTitle();
    const xAxisType = 'category';
    const series = this.createSeries(data);
    const colors = this.getChartColors();
    this.setCustomLabelColors(series, colors, this.customLabelColors);
    this.chartConfig = this.createChartConfig(chartType, title, xAxisType, total, series, colors);
  }

  createSeries(data) {
    const series: any[] = [
      {
        data: data,
        dataLabels: {
          enabled: true
        }
      }
    ];
    if (this.highlightCorrectAnswer && this.chartType === 'column') {
      series[0].showInLegend = false;
      series.push(
        {
          name: $localize`Correct`,
          color: this.colors.correct
        },
        {
          name: $localize`Incorrect`,
          color: this.colors.incorrect
        }
      );
    }
    return series;
  }

  getGraphTitle() {
    if (this.isSourceSelf()) {
      return this.getGraphTitleForSelf();
    } else if (this.isSourcePeriod()) {
      return this.getGraphTitleForPeriod();
    } else {
      return this.getGraphTitleForClass();
    }
  }

  getGraphTitleForSelf() {
    if (this.isStudentDataTypeResponses()) {
      return $localize`Your Response`;
    } else if (this.isStudentDataTypeScores()) {
      return $localize`Your Score`;
    }
  }

  getGraphTitleForPeriod() {
    if (this.isStudentDataTypeResponses()) {
      return this.getGraphTitleWithLabelAndPercent(
        $localize`Period Responses`,
        this.getPercentOfClassRespondedText()
      );
    } else if (this.isStudentDataTypeScores()) {
      return this.getGraphTitleWithLabelAndPercent(
        $localize`Period Scores`,
        this.getPercentOfClassRespondedText()
      );
    }
  }

  getGraphTitleForClass() {
    if (this.isStudentDataTypeResponses()) {
      return this.getGraphTitleWithLabelAndPercent(
        $localize`Class Responses`,
        this.getPercentOfClassRespondedText()
      );
    } else if (this.isStudentDataTypeScores()) {
      return this.getGraphTitleWithLabelAndPercent(
        $localize`Class Scores`,
        this.getPercentOfClassRespondedText()
      );
    }
  }

  getGraphTitleWithLabelAndPercent(label: string, percentDisplayText: string): string {
    return `${label} | ${percentDisplayText}`;
  }

  getPercentOfClassRespondedText(): string {
    return $localize`${this.percentResponded}% Responded (${this.numResponses}/${this.totalWorkgroups})`;
  }

  getChartColors() {
    if (this.studentDataType === 'responses') {
      return this.colors.palette;
    } else {
      let colors = [];
      const step = (100 / this.maxScore / 100) * 0.9;
      let opacity = 0.1;
      for (let i = 0; i < this.maxScore; i++) {
        opacity = opacity + step;
        const color = rgbToHex(this.colors.singleHue, opacity);
        colors.push(color);
      }
      return colors;
    }
  }

  setCustomLabelColors(series, colors, customLabelColors) {
    for (const customLabelColor of customLabelColors) {
      const index = this.getIndexByName(series, customLabelColor.label);
      if (index != null) {
        colors[index] = customLabelColor.color;
      }
    }
  }

  getIndexByName(series, name) {
    for (const singleSeries of series) {
      if (singleSeries.data != null) {
        for (const [i, dataPoint] of singleSeries.data.entries()) {
          if (this.cleanLabel(dataPoint.name) === this.cleanLabel(name)) {
            return i;
          }
        }
      }
    }
    return null;
  }

  isStudentDataTypeResponses() {
    return this.isStudentDataType('responses');
  }

  isStudentDataTypeScores() {
    return this.isStudentDataType('scores');
  }

  isStudentDataType(studentDataType) {
    return this.studentDataType === studentDataType;
  }

  createChartConfig(chartType, title, xAxisType, total, series, colors) {
    const thisSummaryDisplay: any = this;
    thisSummaryDisplay.total = total;
    const fontFamily = 'Roboto,Helvetica Neue,sans-serif';
    const options: any = {
      chart: {
        type: chartType
      },
      colors: colors,
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          colorByPoint: true,
          dataLabels: {
            formatter: function () {
              if (chartType === 'pie') {
                const pct = Math.round((this.y / this.total) * 100);
                return this.key + ': ' + pct + '%';
              } else {
                return this.y;
              }
            },
            style: { fontSize: '12px' }
          }
        },
        column: {
          maxPointWidth: 80
        }
      },
      series: series,
      title: {
        text: title,
        style: {
          fontFamily: fontFamily,
          fontSize: '16px',
          fontWeight: '500'
        }
      },
      tooltip: {
        formatter: function (s, point) {
          if (chartType === 'pie') {
            return '<b>' + this.key + '</b>: ' + this.y;
          } else {
            const pct = Math.round((this.y / thisSummaryDisplay.total) * 100);
            return '<b>' + this.key + '</b>: ' + pct + '%';
          }
        }
      },
      xAxis: {
        type: xAxisType,
        labels: {
          style: { fontFamily: fontFamily, fontSize: '14px' }
        }
      },
      yAxis: {
        title: {
          text: $localize`Count`,
          style: { fontFamily: fontFamily, fontSize: '14px' }
        }
      }
    };
    if (this.highlightCorrectAnswer) {
      options.legend.enabled = true;
      options.plotOptions.series.colorByPoint = false;
      options.plotOptions.series.grouping = false;
      options.plotOptions.series.events = {
        legendItemClick: function () {
          return false;
        }
      };
    }
    return options;
  }

  calculateCountsAndPercentage(dataCount) {
    this.numResponses = dataCount;
    this.totalWorkgroups = this.getTotalWorkgroups(dataCount);
    this.percentResponded = this.getPercentResponded(dataCount, this.totalWorkgroups);
  }

  getTotalWorkgroups(dataCount) {
    if (this.isVLEPreview() || this.isAuthoringPreview()) {
      return dataCount;
    } else {
      const numWorkgroups = this.configService.getNumberOfWorkgroupsInPeriod(this.periodId);
      return Math.max(numWorkgroups, dataCount);
    }
  }

  getPercentResponded(numResponses, totalWorkgroups) {
    return Math.floor((100 * numResponses) / totalWorkgroups);
  }

  getSummaryDataCount(summaryData, id) {
    return summaryData[id].count;
  }

  isSourceSelf() {
    return this.source === 'self';
  }

  isSourcePeriod() {
    return this.source === 'period';
  }

  isSourceAllPeriods() {
    return this.source === 'allPeriods';
  }
}
