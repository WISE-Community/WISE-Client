import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { generateRandomKey } from '../../../assets/wise5/common/string/string';
import { EditFeedbackRulesComponent } from '../../../assets/wise5/components/common/feedbackRule/edit-feedback-rules/edit-feedback-rules.component';
import { QuestionBankRule } from '../../../assets/wise5/components/peerChat/peer-chat-question-bank/QuestionBankRule';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { Question } from '../../../assets/wise5/components/peerChat/peer-chat-question-bank/Question';

@Component({
  selector: 'edit-question-bank-rules',
  templateUrl: './edit-question-bank-rules.component.html',
  styleUrls: ['./edit-question-bank-rules.component.scss']
})
export class EditQuestionBankRulesComponent extends EditFeedbackRulesComponent {
  constructor(protected dialog: MatDialog, protected projectService: TeacherProjectService) {
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
}
