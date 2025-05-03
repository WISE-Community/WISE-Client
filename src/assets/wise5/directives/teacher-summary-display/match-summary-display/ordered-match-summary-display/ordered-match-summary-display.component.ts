import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatchSummaryDataPoint } from '../../summary-data/MatchSummaryDataPoint';
import { MatchSummaryDisplayComponent } from '../match-summary-display.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatIconModule],
  selector: 'ordered-match-summary-display',
  styleUrl: '../match-summary-display.component.scss',
  templateUrl: './ordered-match-summary-display.component.html'
})
export class OrderedMatchSummaryDisplayComponent extends MatchSummaryDisplayComponent {
  protected sortChoices(choiceA: MatchSummaryDataPoint, choiceB: MatchSummaryDataPoint): number {
    return 0;
  }
}
