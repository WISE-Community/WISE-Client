import { Component } from '@angular/core';
import { copy } from '../../../common/object/object';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { MultipleChoiceComponent } from '../MultipleChoiceComponent';

@Component({
  selector: 'multiple-choice-show-work',
  templateUrl: 'multiple-choice-show-work.component.html',
  styleUrls: ['multiple-choice-show-work.component.scss']
})
export class MultipleChoiceShowWorkComponent extends ComponentShowWorkDirective {
  studentChoiceId: string = '';
  choices: any[] = [];
  component: MultipleChoiceComponent;
  showFeedback: boolean = false;
  hasCorrectAnswer: boolean = false;
  isStudentAnswerCorrect: boolean = false;

  constructor(protected nodeService: NodeService, protected projectService: ProjectService) {
    super(nodeService, projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.component = new MultipleChoiceComponent(this.componentContent, this.nodeId);
    if (this.component.isRadio()) {
      const studentChoiceIds = this.getChoiceIds(this.componentState.studentData.studentChoices);
      this.studentChoiceId = studentChoiceIds[0];
    }
    this.choices = this.processChoices(
      copy(this.componentContent.choices),
      this.componentState.studentData.studentChoices
    );
    this.showFeedback = this.componentContent.showFeedback;
    this.hasCorrectAnswer = this.calculateHasCorrectAnswer(this.componentContent);
    if (this.hasCorrectAnswer) {
      if (this.componentState.studentData.isCorrect == null) {
        // If the student clicks save it will not calculate isCorrect. We only calculate isCorrect
        // if the student clicks submit. Here we will calculate isCorrect for the teacher to see.
        this.isStudentAnswerCorrect = this.component.calculateIsCorrect(this.componentState);
      } else {
        this.isStudentAnswerCorrect = this.componentState.studentData.isCorrect;
      }
    }
  }

  getChoiceIds(choices: any[]): string[] {
    return choices.map((choice) => {
      return choice.id;
    });
  }

  processChoices(choices: any[], studentChoices: any[]): any[] {
    const studentChoiceIdsMap = this.getChoicesIdsStudentChose(studentChoices);
    for (const choice of choices) {
      if (studentChoiceIdsMap[choice.id]) {
        choice.isSelected = true;
      } else {
        choice.isSelected = false;
      }
    }
    return choices;
  }

  getChoicesIdsStudentChose(studentChoices: any[]): any {
    const studentChoiceIds = {};
    for (const studentChoice of studentChoices) {
      studentChoiceIds[studentChoice.id] = true;
    }
    return studentChoiceIds;
  }

  calculateHasCorrectAnswer(componentContent: any): boolean {
    for (const choice of componentContent.choices) {
      if (choice.isCorrect) {
        return true;
      }
    }
    return false;
  }
}
