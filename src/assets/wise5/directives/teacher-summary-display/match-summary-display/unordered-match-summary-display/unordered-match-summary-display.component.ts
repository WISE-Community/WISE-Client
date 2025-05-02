import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatchSummaryDisplayComponent } from '../match-summary-display.component';
import { MatIconModule } from '@angular/material/icon';
import { MatchSummaryDataPoint } from '../../summary-data/MatchSummaryDataPoint';
import { MatchSummaryData } from '../../summary-data/MatchSummaryData';

@Component({
  selector: 'unordered-match-summary-display',
  imports: [CommonModule, MatIconModule],
  templateUrl: '../match-summary-display.component.html',
  styleUrl: '../match-summary-display.component.scss'
})
export class UnorderedMatchSummaryDisplayComponent extends MatchSummaryDisplayComponent {
  ngOnInit(): void {
    this.getLatestWork().subscribe((componentStates) => {
      this.matchSummaryData = new MatchSummaryData(componentStates);
      this.setBucketValues();
      this.setBucketShowMore();
    });
  }

  protected sortChoices(choiceA: MatchSummaryDataPoint, choiceB: MatchSummaryDataPoint): number {
    return choiceB.getCount() - choiceA.getCount();
  }

  protected showBucket(bucketValue: string): boolean {
    return true;
  }
}
