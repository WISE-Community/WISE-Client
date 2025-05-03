import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatchSummaryDataPoint } from '../../summary-data/MatchSummaryDataPoint';
import { MatchSummaryDisplayComponent } from '../match-summary-display.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ordered-match-summary-display',
  imports: [CommonModule, MatIconModule],
  templateUrl: './ordered-match-summary-display.component.html',
  styleUrl: '../match-summary-display.component.scss'
})
export class OrderedMatchSummaryDisplayComponent extends MatchSummaryDisplayComponent {
  protected sortChoices(choiceA: MatchSummaryDataPoint, choiceB: MatchSummaryDataPoint): number {
    return choiceA.getPosition() - choiceB.getPosition();
  }
}
