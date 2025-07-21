import { CdkDrag, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexModule } from '@angular/flex-layout/flex';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatableTextareaComponent } from '../../../assets/wise5/authoringTool/components/translatable-textarea/translatable-textarea.component';
import { generateRandomKey } from '../../../assets/wise5/common/string/string';
import { EditFeedbackRulesComponent } from '../../../assets/wise5/components/common/feedbackRule/edit-feedback-rules/edit-feedback-rules.component';
import { FeedbackRule } from '../../../assets/wise5/components/common/feedbackRule/FeedbackRule';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'edit-dynamic-prompt-rules',
  templateUrl: './edit-dynamic-prompt-rules.component.html',
  styleUrl: './edit-dynamic-prompt-rules.component.scss',
  imports: [
    FlexModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatButton,
    CdkDropList,
    CdkScrollable,
    CommonModule,
    CdkDrag,
    MatCard,
    CdkDragHandle,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    TranslatableTextareaComponent
  ]
})
export class EditDynamicPromptRulesComponent extends EditFeedbackRulesComponent {
  constructor(
    protected dialog: MatDialog,
    protected projectService: TeacherProjectService
  ) {
    super(dialog, projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

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
