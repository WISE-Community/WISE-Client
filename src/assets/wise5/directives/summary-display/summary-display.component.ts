import * as Highcharts from 'highcharts';
import { Annotation } from '../../common/Annotation';
import { AnnotationService } from '../../services/annotationService';
import { Directive, Input, SimpleChanges } from '@angular/core';
import { ComponentContent } from '../../common/ComponentContent';
import { ComponentState } from '../../../../app/domain/componentState';
import { ConfigService } from '../../services/configService';
import { DataService } from '../../../../app/services/data.service';
import { MultipleChoiceContent } from '../../components/multipleChoice/MultipleChoiceContent';
import { Observable } from 'rxjs';
import { ProjectService } from '../../services/projectService';
import { rgbToHex } from '../../common/color/color';
import { SummaryService } from '../../components/summary/summaryService';
import { tap } from 'rxjs/operators';
import { SeriesData } from '../../common/SeriesData';
import { SeriesDataPoint } from '../../common/SeriesDataPoint';
import { MultipleChoiceSummaryData } from './summary-data/MultipleChoiceSummaryData';
import { ScoreSummaryData } from './summary-data/ScoreSummaryData';
import { TableSummaryData } from './summary-data/TableSummaryData';
import { Choice } from '../../components/multipleChoice/Choice';
import { SummaryData } from './summary-data/SummaryData';
import { CRaterService } from '../../services/cRaterService';

@Directive()
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
  private defaultMaxScore: number = 0;
  hasCorrectness: boolean = false;
  protected Highcharts: typeof Highcharts = Highcharts;
  maxScore: number = 0;
  studentMaxScore: number = 0;
  studentMinScore: number = 1;
  private meanScore: number = 0;

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
    protected cRaterService: CRaterService,
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
    if (changes.doRender != null && !changes.doRender.firstChange) {
      this.renderDisplay();
    } else if (changes.componentId || changes.periodId) {
      this.initializeOtherComponent();
      this.initializeCustomLabelColors();
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
    if (this.isSourceSelf()) {
      this.renderSelfDisplay();
    } else {
      switch (this.studentDataType) {
        case 'responses':
          this.renderClassResponses();
          break;
        case 'scores':
          this.renderClassScores();
      }
    }
  }

  protected abstract renderSelfDisplay(): void;

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

  protected getLatestScoreAnnotationForWorkgroup(): Annotation {
    return this.annotationService.getLatestScoreAnnotation(
      this.nodeId,
      this.componentId,
      this.configService.getWorkgroupId()
    );
  }

  protected renderClassScores(): void {
    this.setMaxScore();
    this.getLatestScores().subscribe((annotations) => this.processScoreAnnotations(annotations));
  }

  protected setMaxScore(): void {
    const isCRaterEnabled = this.cRaterService.isCRaterEnabled(
      this.projectService.getComponent(this.nodeId, this.componentId)
    );
    this.maxScore = this.otherComponent?.maxScore ?? (isCRaterEnabled ? 5 : this.defaultMaxScore);
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

  protected processComponentStates(componentStates: ComponentState[]): [SeriesData, number] {
    let seriesData: SeriesData;
    let count: number;
    if (this.otherComponentType === 'MultipleChoice') {
      const summaryData = new MultipleChoiceSummaryData(
        this.otherComponent as MultipleChoiceContent,
        componentStates
      );
      seriesData = this.createChoicesSeriesData(
        this.otherComponent as MultipleChoiceContent,
        summaryData
      );
      count = componentStates.length;
    } else if (this.otherComponentType === 'Table') {
      const summaryData = new TableSummaryData(componentStates, this.summaryService);
      seriesData = this.createTableSeriesData(summaryData);
      count = this.getTotalTableCount(seriesData);
    }
    this.calculateCountsAndPercentage(componentStates.length);
    return [seriesData, count];
  }

  createTableSeriesData(summaryData: TableSummaryData): SeriesData {
    const seriesData = new SeriesData();
    for (const key of Object.keys(summaryData)) {
      summaryData.getDataPoints().forEach((summaryDataPoint) => {
        const key = summaryDataPoint.getId();
        const count = summaryDataPoint.getCount();
        const seriesDataPoint = new SeriesDataPoint(key, count);
        seriesData.addDataPoint(seriesDataPoint);
      });
    }
    return seriesData;
  }

  getTotalTableCount(seriesData: SeriesData): number {
    let total = 0;
    seriesData.getDataPoints().forEach((dataPoint) => (total += dataPoint.y));
    return total;
  }

  protected processScoreAnnotations(annotations: Annotation[]): void {
    this.setMinMaxScore(annotations);
    const summaryData = new ScoreSummaryData(annotations, this.studentMaxScore);
    const [seriesData, total] = this.createScoresSeriesData(summaryData);
    this.calculateCountsAndPercentage(annotations.length);
    this.renderGraph(seriesData, total);
  }

  setMinMaxScore(annotations: Annotation[]): void {
    let maxScoreSoFar = this.maxScore;
    let minScoreSoFar = this.studentMinScore;
    for (const annotation of annotations) {
      const score = this.getScoreFromAnnotation(annotation);
      maxScoreSoFar = Math.max(maxScoreSoFar, score);
      minScoreSoFar = Math.min(minScoreSoFar, score);
    }
    this.studentMaxScore = maxScoreSoFar;
    this.studentMinScore = minScoreSoFar;
  }

  createChoicesSeriesData(
    component: MultipleChoiceContent,
    summaryData: MultipleChoiceSummaryData
  ): SeriesData {
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

  hasCorrectAnswer(component: MultipleChoiceContent): boolean {
    return component.choices.some((choice) => choice.isCorrect);
  }

  getDataPointColor(choice: Choice): string | null {
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

  private getScoreFromAnnotation(annotation: Annotation): number {
    return annotation.data.value;
  }

  private createScoresSeriesData(summaryData: ScoreSummaryData): [SeriesData, number] {
    const seriesData = new SeriesData();
    let sum = 0;
    let total = 0;
    for (let scoreValue = this.studentMinScore; scoreValue <= this.studentMaxScore; scoreValue++) {
      const count = this.getSummaryDataCount(summaryData, scoreValue);
      const dataPoint = new SeriesDataPoint(scoreValue, count);
      seriesData.addDataPoint(dataPoint);
      sum += count * scoreValue;
      total += count;
    }
    this.meanScore = Math.round((sum / total) * 100) / 100;
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

  getGraphTitleForClass(): string {
    if (this.isStudentDataTypeResponses()) {
      return $localize`Responses`;
    } else if (this.isStudentDataTypeScores()) {
      return this.maxScore
        ? `${$localize`Scores`} (${$localize`Mean: `}${this.meanScore}/${this.maxScore})`
        : `${$localize`Scores`} (${$localize`Mean: `}${this.meanScore})`;
    }
  }

  getChartColors(): string[] {
    if (this.studentDataType === 'responses') {
      return this.colors.palette;
    } else {
      let colors: string[] = [];
      const rangeMax = this.studentMinScore === 0 ? this.studentMaxScore + 1 : this.studentMaxScore;
      const step = (100 / rangeMax / 100) * 0.9;
      let opacity = 0.1;
      for (let i = 0; i < rangeMax; i++) {
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
      if (index !== -1) {
        colors[index] = customLabelColor.color;
      }
    }
  }

  private getIndexByName(series: any[], name: string): number {
    let index;
    series
      .filter((singleSeries) => singleSeries.data != null)
      .forEach((singleSeries) => {
        index = singleSeries.data.findIndex(
          (dataPoint) =>
            this.summaryService.cleanLabel(dataPoint.name) === this.summaryService.cleanLabel(name)
        );
      });
    return index;
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
        enabled: function () {
          return chartType === 'pie' ? true : false;
        }
      },
      plotOptions: {
        series: {
          colorByPoint: true,
          dataLabels: {
            formatter: function () {
              if (chartType === 'pie') {
                const pct = Math.round((this.y / this.total) * 100);
                return pct + '%';
              } else {
                const pct = Math.round((this.y / thisSummaryDisplay.total) * 100);
                return this.y + ' (' + pct + '%)';
              }
            },
            style: { fontSize: '12px' },
            enabled: true
          }
        },
        column: {
          maxPointWidth: 80
        },
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            distance: -30
          }
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
            const pct = Math.round((this.y / this.total) * 100);
            return this.key + '<br><b>' + this.y + ' (' + pct + '%)</br>';
          } else {
            const pct = Math.round((this.y / thisSummaryDisplay.total) * 100);
            return '<b>' + this.key + '</b><br>Count:<b>' + this.y + '</b>';
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

  getSummaryDataCount(summaryData: SummaryData, id: any): number {
    return summaryData.getDataPointCountById(id);
  }

  protected isSourceSelf(): boolean {
    return this.source === 'self';
  }
}
