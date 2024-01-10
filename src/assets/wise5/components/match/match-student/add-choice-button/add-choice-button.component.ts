import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'add-choice-button',
  templateUrl: 'add-choice-button.component.html'
})
export class AddChoiceButton {
  @Input() isDisabled: boolean;
  @Output() onClick = new EventEmitter<void>();
}
