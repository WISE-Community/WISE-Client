import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatchContent } from '../../../components/match/MatchContent';
import { MatchSummaryData } from '../summary-data/MatchSummaryData';
import { MatchSummaryDataPoint } from '../summary-data/MatchSummaryDataPoint';
import { MatIconModule } from '@angular/material/icon';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';

@Component({
  imports: [CommonModule, MatIconModule],
  selector: 'match-summary-display',
  styles: `
    @reference "tailwindcss";
    h3,
    .mat-subtitle-1 {
      margin-bottom: 8px;
      margin-top: 0;
    }
    .bucket {
      @apply p-2 mb-2 rounded-md;
    }
    .choice {
      @apply flex gap-1 px-2 py-1 mt-1 rounded-md bg-white border border-neutral-200 text-sm;
    }
    .mat-icon {
      vertical-align: middle;
    }
    ul {
      list-style-type: none;
      margin-block-start: 0;
      padding-inline-start: 0;
    }
  `,
  templateUrl: './match-summary-display.component.html'
})
export class MatchSummaryDisplayComponent extends TeacherSummaryDisplayComponent implements OnInit {
  protected bucketData: { value: string; choices: MatchSummaryDataPoint[] }[] = [];
  private bucketsShowMore: Map<string, boolean> = new Map<string, boolean>();
  private bucketValues: Set<string> = new Set<string>();
  protected isChoiceReuseMatch: boolean;
  private matchSummaryData: MatchSummaryData;

  ngOnInit(): void {
    this.setIsChoiceReuseMatch();
    this.generateSummary();
  }

  private setIsChoiceReuseMatch(): void {
    this.isChoiceReuseMatch = (
      this.projectService.getComponent(this.nodeId, this.componentId) as MatchContent
    ).choiceReuseEnabled;
  }

  private generateSummary(): void {
    this.getLatestWork().subscribe((componentStates) => {
      this.bucketData = [];
      this.bucketValues.clear();
      this.matchSummaryData = new MatchSummaryData(componentStates);
      this.setBucketValues();
      this.setBucketData();
      this.setBucketShowMore();
    });
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
      .bucketDataPoints.sort(this.sortChoices);
  }

  private sortChoices(choiceA: MatchSummaryDataPoint, choiceB: MatchSummaryDataPoint): number {
    return choiceB.getCount() - choiceA.getCount();
  }

  private setBucketShowMore(): void {
    this.bucketValues.forEach((value) => this.bucketsShowMore.set(value, false));
  }

  protected getBucketShowMore(bucketValue: string): boolean {
    return this.bucketsShowMore.get(bucketValue);
  }

  protected toggleBucketShowMore(bucketValue: string, event: Event): void {
    event.preventDefault();
    this.bucketsShowMore.set(bucketValue, !this.bucketsShowMore.get(bucketValue));
  }

  protected renderDisplay(): void {
    super.renderDisplay();
    this.generateSummary();
  }
}
