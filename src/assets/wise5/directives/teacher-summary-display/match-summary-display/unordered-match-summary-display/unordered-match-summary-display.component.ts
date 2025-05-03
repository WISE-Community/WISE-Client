import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatchSummaryData } from '../../summary-data/MatchSummaryData';
import { MatchSummaryDataPoint } from '../../summary-data/MatchSummaryDataPoint';
import { MatchSummaryDisplayComponent } from '../match-summary-display.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatIconModule],
  selector: 'unordered-match-summary-display',
  styleUrl: '../match-summary-display.component.scss',
  templateUrl: '../match-summary-display.component.html'
})
export class UnorderedMatchSummaryDisplayComponent extends MatchSummaryDisplayComponent {
  ngOnInit(): void {
    this.getLatestWork().subscribe((componentStates) => {
      this.matchSummaryData = new MatchSummaryData(componentStates);
      this.setBucketValues();
      this.setBucketData();
      this.setBucketShowMore();
    });
  }

  protected sortChoices(choiceA: MatchSummaryDataPoint, choiceB: MatchSummaryDataPoint): number {
    return choiceB.getCount() - choiceA.getCount();
  }
}
