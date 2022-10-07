import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditFeedbackRulesComponent } from '../../../assets/wise5/components/common/feedbackRule/edit-feedback-rules/edit-feedback-rules.component';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { UtilService } from '../../../assets/wise5/services/utilService';

@Component({
  selector: 'edit-dynamic-prompt-rules',
  templateUrl: './edit-dynamic-prompt-rules.component.html',
  styleUrls: ['./edit-dynamic-prompt-rules.component.scss']
})
export class EditDynamicPromptRulesComponent extends EditFeedbackRulesComponent {
  constructor(
    protected dialog: MatDialog,
    protected projectService: TeacherProjectService,
    protected utilService: UtilService
  ) {
    super(dialog, projectService, utilService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected createNewFeedbackRule(): any {
    return { id: this.utilService.generateKey(10), expression: '', prompt: '' };
  }

  deleteRule(ruleIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this prompt rule?`)) {
      this.feedbackRules.splice(ruleIndex, 1);
      this.projectService.nodeChanged();
    }
  }
}
