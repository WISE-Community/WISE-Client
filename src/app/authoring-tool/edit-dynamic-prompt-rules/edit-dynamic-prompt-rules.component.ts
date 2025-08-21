import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatableTextareaComponent } from '../../../assets/wise5/authoringTool/components/translatable-textarea/translatable-textarea.component';
import { generateRandomKey } from '../../../assets/wise5/common/string/string';
import { EditFeedbackRulesComponent } from '../../../assets/wise5/components/common/feedbackRule/edit-feedback-rules/edit-feedback-rules.component';
import { FeedbackRule } from '../../../assets/wise5/components/common/feedbackRule/FeedbackRule';

@Component({
  selector: 'edit-dynamic-prompt-rules',
  templateUrl: './edit-dynamic-prompt-rules.component.html',
  styleUrl: './edit-dynamic-prompt-rules.component.scss',
  imports: [
    MatTooltip,
    MatIcon,
    MatButtonModule,
    DragDropModule,
    CdkScrollable,
    MatCard,
    MatFormFieldModule,
    MatInput,
    FormsModule,
    TranslatableTextareaComponent
  ]
})
export class EditDynamicPromptRulesComponent extends EditFeedbackRulesComponent {
  protected createNewFeedbackRule(): Partial<FeedbackRule> {
    return { id: generateRandomKey(), expression: '', prompt: '' };
  }

  deleteRule(ruleIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this prompt rule?`)) {
      this.feedbackRules.splice(ruleIndex, 1);
      this.projectService.nodeChanged();
    }
  }
}
