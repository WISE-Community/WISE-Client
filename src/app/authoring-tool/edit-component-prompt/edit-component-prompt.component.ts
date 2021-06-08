import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'edit-component-prompt',
  styles: ['.prompt {width: 100%; }'],
  templateUrl: 'edit-component-prompt.component.html'
})
export class EditComponentPrompt {
  @Input()
  prompt: string;

  @Output()
  promptChangedEvent = new EventEmitter<string>();
}
