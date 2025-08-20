import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatLabel } from '@angular/material/form-field';
import { TranslatableTextareaComponent } from '../../../assets/wise5/authoringTool/components/translatable-textarea/translatable-textarea.component';
import { DynamicPrompt } from '../../../assets/wise5/directives/dynamic-prompt/DynamicPrompt';
import { EditComponentPeerGroupingTagComponent } from '../edit-component-peer-grouping-tag/edit-component-peer-grouping-tag.component';
import { EditDynamicPromptRulesComponent } from '../edit-dynamic-prompt-rules/edit-dynamic-prompt-rules.component';
import { SelectStepAndComponentComponent } from '../select-step-and-component/select-step-and-component.component';

@Component({
  selector: 'edit-dynamic-prompt',
  templateUrl: './edit-dynamic-prompt.component.html',
  styleUrl: './edit-dynamic-prompt.component.scss',
  imports: [
    MatCheckbox,
    MatLabel,
    SelectStepAndComponentComponent,
    EditComponentPeerGroupingTagComponent,
    TranslatableTextareaComponent,
    EditDynamicPromptRulesComponent
  ]
})
export class EditDynamicPromptComponent {
  protected allowedReferenceComponentTypes: string[] = ['MultipleChoice', 'OpenResponse'];
  @Input() componentContent: any;
  @Output() dynamicPromptChangedEvent = new EventEmitter<void>();

  toggleDynamicPrompt(event: MatCheckboxChange): void {
    if (this.componentContent.dynamicPrompt == null) {
      this.componentContent.dynamicPrompt = new DynamicPrompt({
        referenceComponent: {},
        rules: []
      });
    }
    this.componentContent.dynamicPrompt.enabled = event.checked;
    this.dynamicPromptChangedEvent.next();
  }
}
