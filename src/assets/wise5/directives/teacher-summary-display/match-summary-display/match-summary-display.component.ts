import { AnnotationService } from '../../../services/annotationService';
import { Component, Input } from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { MatchSummaryData } from '../summary-data/MatchSummaryData';
import { MatchSummaryDataPoint } from '../summary-data/MatchSummaryDataPoint';
import { SummaryDataPoint } from '../../summary-display/summary-data/SummaryDataPoint';
import { SummaryService } from '../../../components/summary/summaryService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';

@Component({
  styleUrl: './match-summary-display.component.scss',
  templateUrl: './match-summary-display.component.html'
})
export abstract class MatchSummaryDisplayComponent extends TeacherSummaryDisplayComponent {
  private bucketData: { value: string; choices: MatchSummaryDataPoint[] }[] = [];
  protected bucketsShowMore: Map<string, boolean> = new Map<string, boolean>();
  private bucketValues: Set<string> = new Set<string>();
  @Input() protected isOrderedMatch: boolean;
  protected matchSummaryData: MatchSummaryData;

  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    protected dataService: TeacherDataService,
    protected projectService: TeacherProjectService,
    protected summaryService: SummaryService
  ) {
    super(annotationService, configService, dataService, projectService, summaryService);
  }

  protected setBucketValues(): void {
    this.matchSummaryData
      .getDataPoints()
      .map(this.asMatchSummaryDataPoint)
      .forEach((data) => {
        this.bucketValues.add(data.getBucketValue());
      });
  }

  protected setBucketData(): void {
    this.bucketValues.forEach((value) =>
      this.bucketData.push({ value: value, choices: this.getBucketDataByValue(value) })
    );
  }

  protected getBucketData(): {
    value: string;
    choices: MatchSummaryDataPoint[];
  }[] {
    return this.bucketData;
  }

  private getBucketDataByValue(bucketValue: string): MatchSummaryDataPoint[] {
    return this.matchSummaryData
      .getDataPoints()
      .map(this.asMatchSummaryDataPoint)
      .filter((choice) => choice.getBucketValue() === bucketValue)
      .sort(this.sortChoices);
  }

  protected abstract sortChoices(
    choiceA: MatchSummaryDataPoint,
    choiceB: MatchSummaryDataPoint
  ): number;

  protected setBucketShowMore(): void {
    this.bucketValues.forEach((value) => this.bucketsShowMore.set(value, false));
  }

  protected getBucketShowMore(bucketValue: string): boolean {
    return this.bucketsShowMore.get(bucketValue);
  }

  protected toggleBucketShowMore(bucketValue: string): void {
    this.bucketsShowMore.set(bucketValue, !this.bucketsShowMore.get(bucketValue));
  }

  private asMatchSummaryDataPoint(dataPoint: SummaryDataPoint): MatchSummaryDataPoint {
    return dataPoint as MatchSummaryDataPoint;
  }
}
