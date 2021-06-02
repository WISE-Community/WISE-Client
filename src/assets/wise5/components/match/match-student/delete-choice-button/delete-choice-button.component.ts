import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'delete-choice-button',
  templateUrl: 'delete-choice-button.component.html'
})
export class DeleteChoiceButton {
  @Input()
  isDisabled: boolean;

  @Output()
  onClick = new EventEmitter();
}
