import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'match-choice-item',
  templateUrl: 'match-choice-item.component.html'
})
export class MatchChoiceItem {
  @Input()
  buckets: any;

  @Input()
  isDisabled: boolean;

  @Input()
  item: any;

  @Output()
  onStudentDataChanged = new EventEmitter();
}
