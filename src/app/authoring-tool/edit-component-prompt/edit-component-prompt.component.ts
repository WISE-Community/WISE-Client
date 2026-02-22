import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentContent } from '../../../assets/wise5/common/ComponentContent';
import { TranslatableTextareaComponent } from '../../../assets/wise5/authoringTool/components/translatable-textarea/translatable-textarea.component';

@Component({
  imports: [TranslatableTextareaComponent],
  selector: 'edit-component-prompt',
  styles: ['.prompt {width: 100%; mat-form-field { width:100%} }'],
  template: `
    <translatable-textarea
      [content]="componentContent"
      key="prompt"
      label="Prompt"
      i18n-label
      placeholder="Enter Prompt Here"
      i18n-placeholder
      (defaultLanguageTextChanged)="promptChangedEvent.next($event)"
      class="prompt"
      appearance="fill"
    />
  `
})
export class EditComponentPrompt {
  @Input() componentContent: ComponentContent;
  @Output() promptChangedEvent = new EventEmitter<string>();
}
