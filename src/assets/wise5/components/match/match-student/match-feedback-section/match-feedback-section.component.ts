import { Component, Input } from '@angular/core';
import { MatchContent } from '../../MatchContent';

@Component({
  selector: 'match-feedback-section',
  templateUrl: 'match-feedback-section.component.html'
})
export class MatchFeedbackSection {
  @Input() componentContent: MatchContent;
  @Input() hasCorrectAnswer: boolean;
  @Input() isCorrect: boolean;
  @Input() isLatestComponentStateSubmit: boolean;
  @Input() submitCounter: number;
}
