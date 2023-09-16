import { Component, Input, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { QuestionBank } from '../../../assets/wise5/components/peerChat/peer-chat-question-bank/QuestionBank';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'edit-question-bank',
  templateUrl: './edit-question-bank.component.html',
  styleUrls: ['./edit-question-bank.component.scss']
})
export class EditQuestionBankComponent implements OnInit {
  allowedReferenceComponentTypes: string[] = ['MultipleChoice', 'OpenResponse'];
  @Input() componentContent: any;

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {}

  toggleComponent(event: MatCheckboxChange): void {
    if (this.componentContent.questionBank == null) {
      this.componentContent.questionBank = new QuestionBank({
        referenceComponent: {},
        rules: []
      });
    }
    this.componentContent.questionBank.enabled = event.checked;
    this.saveChanges();
  }

  saveChanges(): void {
    this.projectService.nodeChanged();
  }
}
