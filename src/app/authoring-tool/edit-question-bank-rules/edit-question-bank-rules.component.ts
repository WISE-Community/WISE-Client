import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditFeedbackRulesComponent } from '../../../assets/wise5/components/common/feedbackRule/edit-feedback-rules/edit-feedback-rules.component';
import { QuestionBankRule } from '../../../assets/wise5/components/peerChat/peer-chat-question-bank/QuestionBankRule';
import { RandomKeyService } from '../../../assets/wise5/services/randomKeyService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

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
    return { id: RandomKeyService.generate(), expression: '', questions: [''] };
  }

  deleteRule(ruleIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this question rule?`)) {
      this.feedbackRules.splice(ruleIndex, 1);
      this.projectService.nodeChanged();
    }
  }

  addNewFeedbackToRule(rule: Partial<QuestionBankRule>): void {
    (rule.questions as string[]).push('');
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
