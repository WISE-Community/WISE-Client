import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange, MatCheckbox } from '@angular/material/checkbox';
import { DynamicPrompt } from '../../../assets/wise5/directives/dynamic-prompt/DynamicPrompt';
import { NgIf } from '@angular/common';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatLabel } from '@angular/material/form-field';
import { SelectStepAndComponentComponent } from '../select-step-and-component/select-step-and-component.component';
import { EditComponentPeerGroupingTagComponent } from '../edit-component-peer-grouping-tag/edit-component-peer-grouping-tag.component';
import { TranslatableTextareaComponent } from '../../../assets/wise5/authoringTool/components/translatable-textarea/translatable-textarea.component';
import { EditDynamicPromptRulesComponent } from '../edit-dynamic-prompt-rules/edit-dynamic-prompt-rules.component';

@Component({
  selector: 'edit-dynamic-prompt',
  templateUrl: './edit-dynamic-prompt.component.html',
  styleUrl: './edit-dynamic-prompt.component.scss',
  imports: [
    MatCheckbox,
    NgIf,
    FlexModule,
    MatLabel,
    SelectStepAndComponentComponent,
    EditComponentPeerGroupingTagComponent,
    TranslatableTextareaComponent,
    EditDynamicPromptRulesComponent
  ]
})
export class EditDynamicPromptComponent implements OnInit {
  protected allowedReferenceComponentTypes: string[] = ['MultipleChoice', 'OpenResponse'];
  @Input() componentContent: any;
  @Output() dynamicPromptChangedEvent = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

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
