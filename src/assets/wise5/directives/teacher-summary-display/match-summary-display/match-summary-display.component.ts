import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ChoiceData, MatchSummaryData } from '../summary-data/MatchSummaryData';
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
  protected choiceData: ChoiceData[] = [];
  @Input() expanded: boolean;
  private matchSummaryData: MatchSummaryData;

  ngOnInit(): void {
    this.generateSummary();
  }

  private generateSummary(): void {
    this.getLatestWork().subscribe((componentStates) => {
      this.choiceData = [];
      this.matchSummaryData = new MatchSummaryData(
        this.projectService.injectAssetPaths(componentStates)
      );
      this.setChoiceData();
    });
  }

  protected setChoiceData(): void {
    this.matchSummaryData.getChoicesData().forEach((choice) => {
      this.choiceData.push({
        choiceValue: choice.choiceValue,
        choiceDataPoints: choice.choiceDataPoints.sort(this.sortBuckets)
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

  private sortBuckets(a: MatchSummaryDataPoint, b: MatchSummaryDataPoint): number {
    return b.getCount() - a.getCount();
  }

  protected renderDisplay(): void {
    super.renderDisplay();
    this.generateSummary();
  }
}
