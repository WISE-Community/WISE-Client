import { CdkDrag, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexModule } from '@angular/flex-layout/flex';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatableTextareaComponent } from '../../../assets/wise5/authoringTool/components/translatable-textarea/translatable-textarea.component';
import { generateRandomKey } from '../../../assets/wise5/common/string/string';
import { EditFeedbackRulesComponent } from '../../../assets/wise5/components/common/feedbackRule/edit-feedback-rules/edit-feedback-rules.component';
import { Question } from '../../../assets/wise5/components/peerChat/peer-chat-question-bank/Question';
import { QuestionBankRule } from '../../../assets/wise5/components/peerChat/peer-chat-question-bank/QuestionBankRule';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'edit-question-bank-rules',
  templateUrl: './edit-question-bank-rules.component.html',
  styleUrl: './edit-question-bank-rules.component.scss',
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
    MatInput,
    FormsModule,
    CdkTextareaAutosize,
    MatFormFieldModule,
    TranslatableTextareaComponent
  ]
})
export class EditQuestionBankRulesComponent extends EditFeedbackRulesComponent {
  constructor(
    protected dialog: MatDialog,
    protected projectService: TeacherProjectService
  ) {
    super(dialog, projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected createNewFeedbackRule(): Partial<QuestionBankRule> {
    if (this.version === 2) {
      return { id: generateRandomKey(), expression: '', questions: [new Question()] };
    } else {
      return { id: generateRandomKey(), expression: '', questions: [''] };
    }
  }

  deleteRule(ruleIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this question rule?`)) {
      this.feedbackRules.splice(ruleIndex, 1);
      this.projectService.nodeChanged();
    }
  }

  addNewFeedbackToRule(rule: Partial<QuestionBankRule>): void {
    if (this.version === 2) {
      (rule.questions as any[]).push(new Question());
    } else {
      (rule.questions as string[]).push('');
    }
    this.projectService.nodeChanged();
  }

  deleteFeedbackInRule(rule: QuestionBankRule, feedbackIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this question?`)) {
      (rule.questions as string[]).splice(feedbackIndex, 1);
      this.projectService.nodeChanged();
    }
  }

  customTrackBy(index: number): number {
    return index;
  }

  protected getQuestionLabel(rule: QuestionBankRule, questionIndex: number): string {
    return rule.questions.length === 1
      ? $localize`Question`
      : $localize`Question #${questionIndex + 1}`;
  }
}
