import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { generateRandomKey } from '../../../assets/wise5/common/string/string';
import { EditFeedbackRulesComponent } from '../../../assets/wise5/components/common/feedbackRule/edit-feedback-rules/edit-feedback-rules.component';
import { FeedbackRule } from '../../../assets/wise5/components/common/feedbackRule/FeedbackRule';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'edit-dynamic-prompt-rules',
  templateUrl: './edit-dynamic-prompt-rules.component.html',
  styleUrls: ['./edit-dynamic-prompt-rules.component.scss']
})
export class EditDynamicPromptRulesComponent extends EditFeedbackRulesComponent {
  constructor(protected dialog: MatDialog, protected projectService: TeacherProjectService) {
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
