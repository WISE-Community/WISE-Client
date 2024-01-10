import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'add-to-notebook-button',
  templateUrl: 'add-to-notebook-button.component.html'
})
export class AddToNotebookButton {
  @Input()
  isDisabled: boolean;

  @Output()
  snipImage = new EventEmitter<void>();

  addToNotebook() {
    this.snipImage.next();
  }
}
