import { Component, Input, LOCALE_ID, inject } from '@angular/core';
import { formatNumber } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatIconModule],
  selector: 'nav-item-score',
  template: `
    @if (showScore) {
      <span class="flex justify-start items-center">
        <mat-icon class="score"> grade </mat-icon>
        <span class="md-body-2 text-secondary">{{ averageScoreDisplay }}</span>
      </span>
    }
  `
})
export class NavItemScoreComponent {
  private locale = inject(LOCALE_ID);

  @Input() averageScore: number | string;
  protected averageScoreDisplay: string = '';
  @Input() maxScore: number;
  protected showScore: boolean;

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
