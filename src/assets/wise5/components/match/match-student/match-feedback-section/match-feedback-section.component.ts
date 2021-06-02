import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'match-feedback-section',
  templateUrl: 'match-feedback-section.component.html'
})
export class MatchFeedbackSection {
  @Input()
  componentContent: any;

  @Input()
  hasCorrectAnswer: boolean;

  @Input()
  isCorrect: boolean;

  @Input()
  isLatestComponentStateSubmit: boolean;

  @Input()
  submitCounter: number;
}
