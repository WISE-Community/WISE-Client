import { Component, Inject, Input, LOCALE_ID } from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, FlexLayoutModule, MatIconModule],
  selector: 'nav-item-score',
  standalone: true,
  templateUrl: 'nav-item-score.component.html'
})
export class NavItemScoreComponent {
  @Input() averageScore: number | string;
  protected averageScoreDisplay: string = '';
  @Input() maxScore: number;
  protected showScore: boolean;

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  ngOnChanges(): void {
    if (typeof this.maxScore === 'number' || typeof this.averageScore === 'number') {
      this.showScore = true;
      this.averageScoreDisplay = this.getAverageScoreDisplay();
    } else {
      this.showScore = false;
    }
  }

  private getAverageScoreDisplay(): string {
    const averageScore = this.formatAverageScore(this.averageScore);
    return typeof this.maxScore === 'number'
      ? `${averageScore}/${this.maxScore}`
      : `${averageScore}/0`;
  }

  private formatAverageScore(averageScore: number | string): number | string {
    if (typeof averageScore === 'number') {
      if (averageScore % 1 !== 0) {
        averageScore = formatNumber(averageScore, this.locale, '1.1-1').toString();
      }
    } else {
      averageScore = '-';
    }
    return averageScore;
  }
}
