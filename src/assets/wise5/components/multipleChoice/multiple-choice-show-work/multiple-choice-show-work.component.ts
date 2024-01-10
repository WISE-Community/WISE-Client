import { Component } from '@angular/core';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { UtilService } from '../../../services/utilService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { MultipleChoiceService } from '../multipleChoiceService';

@Component({
  selector: 'multiple-choice-show-work',
  templateUrl: 'multiple-choice-show-work.component.html',
  styleUrls: ['multiple-choice-show-work.component.scss']
})
export class MultipleChoiceShowWorkComponent extends ComponentShowWorkDirective {
  studentChoiceId: string = '';
  choices: any[] = [];
  showFeedback: boolean = false;
  hasCorrectAnswer: boolean = false;
  isStudentAnswerCorrect: boolean = false;

  constructor(
    private MultipleChoiceService: MultipleChoiceService,
    protected nodeService: NodeService,
    protected ProjectService: ProjectService,
    private UtilService: UtilService
  ) {
    super(nodeService, ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.componentContent = this.ProjectService.injectAssetPaths(this.componentContent);
    if (this.MultipleChoiceService.isRadio(this.componentContent)) {
      const studentChoiceIds = this.getChoiceIds(this.componentState.studentData.studentChoices);
      this.studentChoiceId = studentChoiceIds[0];
    }
    this.choices = this.processChoices(
      this.UtilService.makeCopyOfJSONObject(this.componentContent.choices),
      this.componentState.studentData.studentChoices
    );
    this.showFeedback = this.componentContent.showFeedback;
    this.hasCorrectAnswer = this.calculateHasCorrectAnswer(this.componentContent);
    if (this.hasCorrectAnswer) {
      if (this.componentState.studentData.isCorrect == null) {
        // If the student clicks save it will not calculate isCorrect. We only calculate isCorrect
        // if the student clicks submit. Here we will calculate isCorrect for the teacher to see.
        this.isStudentAnswerCorrect = this.MultipleChoiceService.calculateIsCorrect(
          this.componentContent,
          this.componentState
        );
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
