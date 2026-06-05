import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatchContent } from '../../../components/match/MatchContent';
import { BucketData, ChoiceData, MatchSummaryData } from '../summary-data/MatchSummaryData';
import { MatchSummaryDataPoint } from '../summary-data/MatchSummaryDataPoint';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';
import { ConfigService } from '../../../services/configService';

export type SummaryViewMode = 'choice' | 'bucket';

@Component({
  imports: [CommonModule, MatButtonToggleModule, MatIconModule, MatTooltipModule],
  selector: 'match-summary-display',
  styleUrls: [
    './match-summary-display.component.scss',
    '../../summary-display/summary-display.component.scss'
  ],
  templateUrl: './match-summary-display.component.html'
})
export class MatchSummaryDisplayComponent extends TeacherSummaryDisplayComponent implements OnInit {
  protected bucketData: { value: string; choices: MatchSummaryDataPoint[] }[] = [];
  protected choiceData: ChoiceData[] = [];
  @Input() expanded: boolean;
  protected isChoiceReuseMatch: boolean;
  private matchSummaryData: MatchSummaryData;
  viewMode: SummaryViewMode = 'bucket';

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
      this.choiceData = [];
      this.matchSummaryData = new MatchSummaryData(
        this.projectService.injectAssetPaths(componentStates)
      );
      this.setChoiceData();
      this.setBucketData();
    });
  }

  protected setChoiceData(): void {
    this.matchSummaryData.getChoicesData().forEach((choice) => {
      this.choiceData.push({
        choiceValue: choice.choiceValue,
        choiceDataPoints: choice.choiceDataPoints.sort(this.sortByCount)
      });
    });
    this.choiceData.sort(this.sortChoices);
  }

  private getTotalCount(choice: ChoiceData): number {
    return choice.choiceDataPoints.reduce((sum, dp) => sum + dp.getCount(), 0);
  }

  private sortChoices = (a: ChoiceData, b: ChoiceData): number => {
    const countDiff = this.getTotalCount(b) - this.getTotalCount(a);
    return countDiff !== 0 ? countDiff : a.choiceValue.localeCompare(b.choiceValue);
  };

  protected setBucketData(): void {
    this.matchSummaryData.getBucketsData().forEach((bucket: BucketData) => {
      this.bucketData.push({
        value: bucket.bucketValue,
        choices: bucket.bucketDataPoints.sort(this.sortByCount)
      });
    });
  }

  private sortByCount(a: MatchSummaryDataPoint, b: MatchSummaryDataPoint): number {
    return b.getCount() - a.getCount();
  }

  protected getWorkgroupNames(dataPoint: MatchSummaryDataPoint): string {
    return dataPoint
      .getWorkgroupIds()
      .map((id) => this.configService.getDisplayUsernamesByWorkgroupId(id))
      .join('\n');
  }

  protected renderDisplay(): void {
    super.renderDisplay();
    this.generateSummary();
  }
}
