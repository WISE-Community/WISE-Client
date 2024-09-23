import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentContent } from '../../../assets/wise5/common/ComponentContent';
import { TranslatableTextareaComponent } from '../../../assets/wise5/authoringTool/components/translatable-textarea/translatable-textarea.component';

@Component({
  imports: [TranslatableTextareaComponent],
  selector: 'edit-component-prompt',
  standalone: true,
  styles: ['.prompt {width: 100%; mat-form-field { width:100%} }'],
  templateUrl: 'edit-component-prompt.component.html'
})
export class EditComponentPrompt {
  @Input() componentContent: ComponentContent;
  @Output() promptChangedEvent = new EventEmitter<string>();
}
