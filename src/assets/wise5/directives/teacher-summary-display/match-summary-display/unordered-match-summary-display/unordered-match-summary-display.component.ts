import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatchSummaryDataPoint } from '../../summary-data/MatchSummaryDataPoint';
import { MatchSummaryDisplayComponent } from '../match-summary-display.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'unordered-match-summary-display',
  imports: [CommonModule, MatIconModule],
  templateUrl: '../match-summary-display.component.html',
  styleUrl: '../match-summary-display.component.scss'
})
export class UnorderedMatchSummaryDisplayComponent extends MatchSummaryDisplayComponent {
  protected sortChoices(choiceA: MatchSummaryDataPoint, choiceB: MatchSummaryDataPoint): number {
    return choiceB.getCount() - choiceA.getCount();
  }
}
