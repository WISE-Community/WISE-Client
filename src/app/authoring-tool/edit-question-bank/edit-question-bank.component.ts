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
  allowedReferenceComponentTypes: string[] = ['OpenResponse'];
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

  referenceComponentNodeIdChanged(event: any): void {
    let numAllowedComponents = 0;
    let allowedComponent = null;
    for (const component of this.projectService.getComponents(event.nodeId)) {
      if (this.allowedReferenceComponentTypes.includes(component.type)) {
        numAllowedComponents += 1;
        allowedComponent = component;
      }
    }
    this.componentContent.questionBank.referenceComponent.componentId =
      numAllowedComponents === 1 ? allowedComponent.id : null;
    this.saveChanges();
  }

  saveChanges(): void {
    this.projectService.nodeChanged();
  }
}
