import { AnnotationService } from '../../../services/annotationService';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { MatchContent } from '../../../components/match/MatchContent';
import { MatchSummaryData } from '../summary-data/MatchSummaryData';
import { MatchSummaryDataPoint } from '../summary-data/MatchSummaryDataPoint';
import { MatIconModule } from '@angular/material/icon';
import { SummaryDataPoint } from '../../summary-display/summary-data/SummaryDataPoint';
import { SummaryService } from '../../../components/summary/summaryService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';
import { MatCardModule } from '@angular/material/card';
import { CRaterService } from '../../../services/cRaterService';

@Component({
  imports: [CommonModule, MatCardModule, MatIconModule],
  selector: 'match-summary-display',
  styles: `
    h3 {
      margin-bottom: 8px;
    }
    .choice {
      @apply flex gap-1 px-2 py-1 rounded-md bg-gray-100 my-1 text-sm;
    }
    .mat-icon {
      vertical-align: middle;
    }
  `,
  templateUrl: './match-summary-display.component.html'
})
export class MatchSummaryDisplayComponent extends TeacherSummaryDisplayComponent implements OnInit {
  protected bucketData: { value: string; choices: MatchSummaryDataPoint[] }[] = [];
  protected bucketsShowMore: Map<string, boolean> = new Map<string, boolean>();
  private bucketValues: Set<string> = new Set<string>();
  protected matchSummaryData: MatchSummaryData;
  protected isChoiceReuseMatch: boolean;

  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    protected cRaterService: CRaterService,
    protected dataService: TeacherDataService,
    protected projectService: TeacherProjectService,
    protected summaryService: SummaryService
  ) {
    super(
      annotationService,
      configService,
      cRaterService,
      dataService,
      projectService,
      summaryService
    );
  }

  ngOnInit(): void {
    this.setIsChoiceReuseMatch();
    this.getLatestWork().subscribe((componentStates) => {
      this.matchSummaryData = new MatchSummaryData(componentStates);
      this.setBucketValues();
      this.setBucketData();
      this.setBucketShowMore();
    });
  }

  private setIsChoiceReuseMatch(): void {
    this.isChoiceReuseMatch = (
      this.projectService
        .getComponentsFromStep(this.nodeId)
        .find((component) => component.id === this.componentId) as MatchContent
    ).choiceReuseEnabled;
  }

  protected setBucketValues(): void {
    this.matchSummaryData
      .getBucketsData()
      .forEach((bucket) => this.bucketValues.add(bucket.bucketValue));
  }

  protected setBucketData(): void {
    this.bucketValues.forEach((value) =>
      this.bucketData.push({ value: value, choices: this.getBucketDataByValue(value) })
    );
  }

  private getBucketDataByValue(bucketValue: string): MatchSummaryDataPoint[] {
    return this.matchSummaryData
      .getBucketsData()
      .find((bucket) => bucket.bucketValue === bucketValue)
      .bucketDataPoints.map(this.asMatchSummaryDataPoint)
      .sort(this.sortChoices);
  }

  protected sortChoices(choiceA: MatchSummaryDataPoint, choiceB: MatchSummaryDataPoint): number {
    return choiceB.getCount() - choiceA.getCount();
  }

  protected setBucketShowMore(): void {
    this.bucketValues.forEach((value) => this.bucketsShowMore.set(value, false));
  }

  protected getBucketShowMore(bucketValue: string): boolean {
    return this.bucketsShowMore.get(bucketValue);
  }

  protected toggleBucketShowMore(bucketValue: string, event: Event): void {
    event.preventDefault();
    this.bucketsShowMore.set(bucketValue, !this.bucketsShowMore.get(bucketValue));
  }

  private asMatchSummaryDataPoint(dataPoint: SummaryDataPoint): MatchSummaryDataPoint {
    return dataPoint as MatchSummaryDataPoint;
  }
}
