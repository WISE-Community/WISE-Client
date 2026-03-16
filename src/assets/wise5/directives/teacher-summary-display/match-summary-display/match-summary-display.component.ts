import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatchContent } from '../../../components/match/MatchContent';
import { MatchSummaryData } from '../summary-data/MatchSummaryData';
import { MatchSummaryDataPoint } from '../summary-data/MatchSummaryDataPoint';
import { MatIconModule } from '@angular/material/icon';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';

@Component({
  imports: [CommonModule, MatIconModule],
  selector: 'match-summary-display',
  styleUrls: [
    './match-summary-display.component.scss',
    '../../summary-display/summary-display.component.scss'
  ],
  templateUrl: './match-summary-display.component.html'
})
export class MatchSummaryDisplayComponent extends TeacherSummaryDisplayComponent implements OnInit {
  protected bucketData: { value: string; choices: MatchSummaryDataPoint[] }[] = [];
  private bucketsShowMore: Map<string, boolean> = new Map<string, boolean>();
  private bucketValues: Set<string> = new Set<string>();
  @Input() expanded: boolean;
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
