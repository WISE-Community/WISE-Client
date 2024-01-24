import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentContent } from '../../../assets/wise5/common/ComponentContent';

@Component({
  selector: 'edit-component-prompt',
  styles: ['.prompt {width: 100%; mat-form-field { width:100%} }'],
  templateUrl: 'edit-component-prompt.component.html'
})
export class EditComponentPrompt {
  @Input() componentContent: ComponentContent;
  @Output() promptChangedEvent = new EventEmitter<string>();
}
