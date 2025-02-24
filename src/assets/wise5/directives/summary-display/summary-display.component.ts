import * as Highcharts from 'highcharts';
import { Annotation } from '../../common/Annotation';
import { AnnotationService } from '../../services/annotationService';
import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ComponentContent } from '../../common/ComponentContent';
import { ComponentState } from '../../../../app/domain/componentState';
import { ConfigService } from '../../services/configService';
import { DataService } from '../../../../app/services/data.service';
import { MatCardModule } from '@angular/material/card';
import { MultipleChoiceContent } from '../../components/multipleChoice/MultipleChoiceContent';
import { Observable } from 'rxjs';
import { ProjectService } from '../../services/projectService';
import { rgbToHex } from '../../common/color/color';
import { SummaryService } from '../../components/summary/summaryService';
import { tap } from 'rxjs/operators';
import { SeriesData } from '../../common/SeriesData';
import { SeriesDataPoint } from '../../common/SeriesDataPoint';

@Component({
  imports: [CommonModule, MatCardModule],
  standalone: true,
  styleUrl: 'summary-display.component.scss',
  templateUrl: 'summary-display.component.html'
})
export abstract class SummaryDisplayComponent {
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
  private defaultMaxScore: number = 5;
  hasCorrectness: boolean = false;
  protected Highcharts: typeof Highcharts = Highcharts;
  maxScore: number = 5;

  numResponses: number;
  otherComponent: ComponentContent;
  otherComponentType: string;
  percentResponded: number;
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
    protected dataService: DataService,
    protected projectService: ProjectService,
    protected summaryService: SummaryService
  ) {}

  ngOnInit(): void {
    this.initializeOtherComponent();
    this.initializeCustomLabelColors();
    if (this.doRender) {
      this.renderDisplay();
    }
  }

  initializeOtherComponent(): void {
    this.otherComponent = this.projectService.getComponent(this.nodeId, this.componentId);
    if (this.otherComponent != null) {
      this.otherComponentType = this.otherComponent.type;
    }
  }

  private initializeCustomLabelColors(): void {
    if (this.customLabelColors == null) {
      this.customLabelColors = [];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.doRender.firstChange) {
      this.renderDisplay();
    }
  }

  isVLEPreview(): boolean {
    return this.configService.isPreview();
  }

  isAuthoringPreview(): boolean {
    return this.configService.isAuthoring();
  }

  isStudentRun(): boolean {
    return this.configService.isStudentRun();
  }

  protected renderDisplay(): void {
    if (this.studentDataType === 'responses') {
      this.renderResponses();
    } else if (this.studentDataType === 'scores') {
      this.renderScores();
    }
  }

  private renderResponses(): void {
    this.renderResponsesOrScores(true);
  }

  protected abstract renderResponsesOrScores(isRenderingResponses: boolean): void;

  protected renderClassResponses(): void {
    this.getLatestWork().subscribe((componentStates = []) => {
      const [seriesData, count] = this.processComponentStates(componentStates);
      this.renderGraph(seriesData, count);
    });
  }

  protected abstract getLatestScores(): Observable<Annotation[]>;

  protected getLatestStudentScores(): Observable<Annotation[]> {
    return this.summaryService
      .getLatestClassmateScores(
        this.configService.getRunId(),
        this.periodId,
        this.nodeId,
        this.componentId,
        this.source
      )
      .pipe(
        tap((scoreAnnotations) => {
          return this.filterLatestScoreAnnotations(scoreAnnotations);
        })
      );
  }

  private renderScores(): void {
    this.renderResponsesOrScores(false);
  }

  protected getLatestScoreAnnotationForWorkgroup(): Annotation {
    return this.annotationService.getLatestScoreAnnotation(
      this.nodeId,
      this.componentId,
      this.configService.getWorkgroupId()
    );
  }

  protected renderClassScores(): void {
    this.setMaxScore();
    this.getLatestScores().subscribe((annotations) => {
      this.processScoreAnnotations(annotations);
    });
  }

  protected setMaxScore(): void {
    if (this.otherComponent.maxScore != null) {
      this.maxScore = this.otherComponent.maxScore;
    } else {
      this.maxScore = this.defaultMaxScore;
    }
    // this.maxScore = this.otherComponent?.maxScore ?? this.defaultMaxScore;
  }

  protected abstract getLatestWork(): Observable<ComponentState[]>;

  protected getLatestStudentWork(): Observable<ComponentState[]> {
    return this.summaryService.getLatestClassmateStudentWork(
      this.configService.getRunId(),
      this.periodId,
      this.nodeId,
      this.componentId,
      this.source
    );
  }

  filterLatestScoreAnnotations(annotations: Annotation[]): any[] {
    const latestAnnotations = new Annotation();
    for (const annotation of annotations) {
      if (annotation.type === 'score' || annotation.type === 'autoScore') {
        this.setLatestAnnotationIfNewer(latestAnnotations, annotation);
      }
    }
    return this.convertObjectToArray(latestAnnotations);
  }

  setLatestAnnotationIfNewer(latestAnnotations: Annotation, annotation: Annotation): void {
    const workgroupId = annotation.toWorkgroupId;
    const latestAnnotation = latestAnnotations[workgroupId];
    if (latestAnnotation == null || annotation.serverSaveTime > latestAnnotation.serverSaveTime) {
      latestAnnotations[workgroupId] = annotation;
    }
  }

  convertObjectToArray(obj: any): any[] {
    return Object.keys(obj).map((key) => {
      return obj[key];
    });
  }

  // MOVE renderGraph() TO renderClass/SelfResponse(s)()
  protected processComponentStates(componentStates: ComponentState[]): [SeriesData, number] {
    let seriesData: SeriesData;
    let count: number;
    if (this.otherComponentType === 'MultipleChoice') {
      // PUT THIS DATA IN SOMETHING LIKE A MultipleChoiceSummaryData (maybe)
      const summaryData = this.createChoicesSummaryData(
        this.otherComponent as MultipleChoiceContent,
        componentStates
      );
      seriesData = this.createChoicesSeriesData(
        this.otherComponent as MultipleChoiceContent,
        summaryData
      );
      count = componentStates.length;
    } else if (this.otherComponentType === 'Table') {
      const summaryData = this.createTableSummaryData(componentStates);
      seriesData = this.createTableSeriesData(summaryData);
      count = this.getTotalTableCount(seriesData);
    }
    this.calculateCountsAndPercentage(componentStates.length);
    // this.renderGraph(seriesData, count); // REMOVE THIS LATER
    return [seriesData, count];
  }

  createTableSummaryData(componentStates: ComponentState[]): any {
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

  cleanLabel(label: string): string {
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

  createTableSeriesData(summaryData: any): SeriesData {
    const seriesData = new SeriesData();
    for (const key of Object.keys(summaryData)) {
      const count = summaryData[key];
      const dataPoint = new SeriesDataPoint(key, count);
      seriesData.addDataPoint(dataPoint);
    }
    return seriesData;
  }

  getTotalTableCount(seriesData: SeriesData): number {
    let total = 0;
    seriesData.getDataPoints().forEach((dataPoint) => (total += dataPoint.y));
    return total;
  }

  accumulateLabel(labelToCount: {}, key: string, value: any): void {
    if (labelToCount[key] == null) {
      labelToCount[key] = 0;
    }
    labelToCount[key] += this.convertToNumber(value);
  }

  convertToNumber(value: any): number {
    if (!isNaN(Number(value))) {
      return Number(value);
    } else {
      return 0;
    }
  }

  protected processScoreAnnotations(annotations: Annotation[]): void {
    this.updateMaxScoreIfNecessary(annotations);
    const summaryData = this.createScoresSummaryData(annotations);
    const [seriesData, total] = this.createScoresSeriesData(summaryData);
    this.calculateCountsAndPercentage(annotations.length);
    this.renderGraph(seriesData, total);
  }

  private updateMaxScoreIfNecessary(annotations: Annotation[]): void {
    this.maxScore = this.calculateMaxScore(annotations);
  }

  calculateMaxScore(annotations: Annotation[]): number {
    let maxScoreSoFar = this.maxScore;
    for (const annotation of annotations) {
      const score = this.getScoreFromAnnotation(annotation);
      maxScoreSoFar = Math.max(this.maxScore, score);
    }
    return maxScoreSoFar;
  }

  // component should not be any, but ComponentContent.choices doesn't exist for some reason
  private createChoicesSummaryData(
    componentState: MultipleChoiceContent,
    componentStates: ComponentState[]
  ): any {
    const summaryData = {};
    for (const choice of componentState.choices) {
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

  // These should obviously not be any, but component is any for now...
  createChoiceSummaryData(id: any, text: any, isCorrect: any): any {
    return {
      id: id,
      text: text,
      isCorrect: isCorrect,
      count: 0
    };
  }

  private addComponentStateDataToSummaryData(
    summaryData: {},
    componentState: ComponentState
  ): void {
    for (const choice of componentState.studentData.studentChoices) {
      this.incrementSummaryData(summaryData, choice.id);
    }
  }

  // Not any
  createChoicesSeriesData(component: MultipleChoiceContent, summaryData: any): SeriesData {
    let seriesData = new SeriesData();
    this.hasCorrectness = this.hasCorrectAnswer(component);
    component.choices.forEach((choice) => {
      const count = this.getSummaryDataCount(summaryData, choice.id);
      const color = this.getDataPointColor(choice);
      let text = choice.text;
      if (this.highlightCorrectAnswer && this.chartType === 'pie') {
        text = text + ' (' + (choice.isCorrect ? $localize`Correct` : $localize`Incorrect`) + ')';
      }
      const dataPoint = new SeriesDataPoint(text, count, color);
      seriesData.addDataPoint(dataPoint);
    });
    return seriesData;
  }

  // Not any
  hasCorrectAnswer(component: any): boolean {
    for (const choice of component.choices) {
      if (choice.isCorrect) {
        return true;
      }
    }
    return false;
  }

  // Not any
  getDataPointColor(choice: any): string | null {
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

  // Not any
  createScoresSummaryData(annotations: Annotation[]): any {
    const summaryData = {};
    for (let scoreValue = 0; scoreValue <= this.maxScore; scoreValue++) {
      summaryData[scoreValue] = this.createScoreSummaryData(scoreValue);
    }
    for (const annotation of annotations) {
      this.addAnnotationDataToSummaryData(summaryData, annotation);
    }
    return summaryData;
  }

  createScoreSummaryData(score: number): any {
    return {
      score: score,
      count: 0
    };
  }

  // Not any
  private addAnnotationDataToSummaryData(summaryData: any, annotation: Annotation): void {
    const score = this.getScoreFromAnnotation(annotation);
    this.incrementSummaryData(summaryData, score);
  }

  // Not any
  private getScoreFromAnnotation(annotation: Annotation): any {
    return annotation.data.value;
  }

  // Not any
  private incrementSummaryData(summaryData: any, id: any): void {
    summaryData[id].count += 1;
  }

  // Not any
  private createScoresSeriesData(summaryData: any): [SeriesData, number] {
    const seriesData = new SeriesData();
    let total = 0;
    for (let scoreValue = 1; scoreValue <= this.maxScore; scoreValue++) {
      const count = this.getSummaryDataCount(summaryData, scoreValue);
      const dataPoint = new SeriesDataPoint(scoreValue, count);
      seriesData.addDataPoint(dataPoint);
      total += count;
    }
    return [seriesData, total];
  }

  protected renderGraph(seriesData: SeriesData, total: number): void {
    const chartType = this.chartType;
    const title = this.getGraphTitle();
    const xAxisType = 'category';
    const series = this.createSeries(seriesData);
    const colors = this.getChartColors();
    this.setCustomLabelColors(series, colors, this.customLabelColors);
    this.chartConfig = this.createChartConfig(chartType, title, xAxisType, total, series, colors);
  }

  createSeries(seriesData: SeriesData): any[] {
    const series: any[] = [
      {
        data: seriesData.getDataPoints(),
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

  getGraphTitle(): string {
    let graphTitle: string;
    switch (this.source) {
      case 'self':
        graphTitle = this.getGraphTitleForSelf();
        break;
      case 'period':
        graphTitle = this.getGraphTitleForPeriod();
        break;
      default:
        graphTitle = this.getGraphTitleForClass();
    }
    return graphTitle;
  }

  private getGraphTitleForSelf(): string {
    if (this.isStudentDataTypeResponses()) {
      return $localize`Your Response`;
    } else if (this.isStudentDataTypeScores()) {
      return $localize`Your Score`;
    }
  }

  getGraphTitleForPeriod(): string {
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

  getGraphTitleForClass(): string {
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

  private getGraphTitleWithLabelAndPercent(label: string, percentDisplayText: string): string {
    return `${label} | ${percentDisplayText}`;
  }

  getPercentOfClassRespondedText(): string {
    return $localize`${this.percentResponded}% Responded (${this.numResponses}/${this.totalWorkgroups})`;
  }

  getChartColors(): string[] {
    if (this.studentDataType === 'responses') {
      return this.colors.palette;
    } else {
      let colors: string[] = [];
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

  setCustomLabelColors(series: any[], colors: string[], customLabelColors: any[]): void {
    for (const customLabelColor of customLabelColors) {
      const index = this.getIndexByName(series, customLabelColor.label);
      if (index != null) {
        colors[index] = customLabelColor.color;
      }
    }
  }

  getIndexByName(series: any[], name: string): any {
    series.forEach((singleSeries) => {
      if (singleSeries.data != null) {
        singleSeries.data.entries().forEach(([i, dataPoint]) => {
          if (this.cleanLabel(dataPoint.name) === this.cleanLabel(name)) {
            return i;
          }
        });
      }
    });
    return null;
  }

  private isStudentDataTypeResponses(): boolean {
    return this.isStudentDataType('responses');
  }

  private isStudentDataTypeScores(): boolean {
    return this.isStudentDataType('scores');
  }

  private isStudentDataType(studentDataType: string): boolean {
    return this.studentDataType === studentDataType;
  }

  createChartConfig(
    chartType: string,
    title: string,
    xAxisType: string,
    total: number,
    series: any[],
    colors: string[]
  ): any {
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

  calculateCountsAndPercentage(dataCount: number): void {
    this.numResponses = dataCount;
    this.totalWorkgroups = this.getTotalWorkgroups(dataCount);
    this.percentResponded = this.getPercentResponded(dataCount, this.totalWorkgroups);
  }

  getTotalWorkgroups(dataCount: number): number {
    if (this.isVLEPreview() || this.isAuthoringPreview()) {
      return dataCount;
    } else {
      const numWorkgroups = this.configService.getNumberOfWorkgroupsInPeriod(this.periodId);
      return Math.max(numWorkgroups, dataCount);
    }
  }

  getPercentResponded(numResponses: number, totalWorkgroups: number): number {
    return Math.floor((100 * numResponses) / totalWorkgroups);
  }

  getSummaryDataCount(summaryData: any, id: any): number {
    return summaryData[id].count;
  }

  protected isSourceSelf(): boolean {
    return this.source === 'self';
  }
}
