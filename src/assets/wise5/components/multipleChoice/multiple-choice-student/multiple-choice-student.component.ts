'use strict';

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { MultipleChoiceComponent } from '../MultipleChoiceComponent';
import { MultipleChoiceService } from '../multipleChoiceService';
import { MultipleChoiceContent } from '../MultipleChoiceContent';

@Component({
  selector: 'multiple-choice-student',
  templateUrl: 'multiple-choice-student.component.html',
  styleUrls: ['multiple-choice-student.component.scss']
})
export class MultipleChoiceStudent extends ComponentStudent {
  choices: any[];
  choiceType: string;
  component: MultipleChoiceComponent;
  componentHasCorrectAnswer: boolean;
  isCorrect: boolean;
  isLatestComponentStateSubmit: boolean;
  originalComponentContent: MultipleChoiceContent;
  showFeedback: boolean;
  studentChoices: any;

  constructor(
    protected annotationService: AnnotationService,
    protected componentService: ComponentService,
    protected configService: ConfigService,
    protected dialog: MatDialog,
    private multipleChoiceService: MultipleChoiceService,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    private projectService: ProjectService,
    protected studentAssetService: StudentAssetService,
    protected studentDataService: StudentDataService,
    protected utilService: UtilService
  ) {
    super(
      annotationService,
      componentService,
      configService,
      dialog,
      nodeService,
      notebookService,
      studentAssetService,
      studentDataService,
      utilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.studentChoices = [];
    this.isCorrect = null;
    this.choices = this.component.getChoices();
    this.componentHasCorrectAnswer = this.hasCorrectChoices();
    this.showFeedback = this.component.content.showFeedback;
    this.choiceType = this.component.getChoiceType();
    this.originalComponentContent = this.projectService.getComponent(
      this.component.nodeId,
      this.component.id
    ) as MultipleChoiceContent;

    if (this.utilService.hasShowWorkConnectedComponent(this.componentContent)) {
      this.handleConnectedComponents();
    } else if (this.componentStateHasStudentWork(this.componentState, this.componentContent)) {
      this.setStudentWork(this.componentState);
    } else if (this.component.hasConnectedComponent()) {
      this.handleConnectedComponents();
    }

    this.isLatestComponentStateSubmit = this.componentState != null && this.componentState.isSubmit;

    if (this.hasMaxSubmitCount() && !this.hasSubmitsLeft()) {
      this.isDisabled = true;
      this.isSubmitButtonDisabled = true;
    }

    this.disableComponentIfNecessary();
    this.broadcastDoneRenderingComponent();
  }

  componentStateHasStudentWork(componentState: any, componentContent: any): boolean {
    return this.multipleChoiceService.componentStateHasStudentWork(
      componentState,
      componentContent
    );
  }

  handleConnectedComponents(): void {
    for (const connectedComponent of this.componentContent.connectedComponents) {
      const componentState = this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
        connectedComponent.nodeId,
        connectedComponent.componentId
      );
      if (componentState != null) {
        this.processConnectedComponentState(componentState);
      }
      if (connectedComponent.type === 'showWork') {
        this.isDisabled = true;
      }
    }
  }

  setStudentWork(componentState: any): void {
    if (componentState != null) {
      const studentData = componentState.studentData;
      const choiceIds = this.getChoiceIdsFromStudentData(studentData);

      if (this.component.isRadio()) {
        this.studentChoices = choiceIds[0];
      } else if (this.component.isCheckbox()) {
        this.studentChoices = choiceIds;
        this.setIsCheckedOnStudentChoices(this.studentChoices);
      }

      if (studentData.isCorrect != null) {
        this.isCorrect = studentData.isCorrect;
      }

      if (this.showFeedback && componentState.isSubmit) {
        this.showFeedbackForChoiceIds(choiceIds);
      }

      const submitCounter = studentData.submitCounter;
      if (submitCounter != null) {
        this.submitCounter = submitCounter;
      }

      this.processLatestStudentWork();
    }
  }

  setIsCheckedOnStudentChoices(studentChoices: string[]): void {
    for (const choice of this.choices) {
      choice.isChecked = studentChoices.includes(choice.id);
    }
  }

  showFeedbackForChoiceIds(choiceIds: string[]): void {
    for (const choice of this.choices) {
      if (choiceIds.includes(choice.id)) {
        choice.showFeedback = true;
        choice.feedbackToShow = choice.feedback;
      }
    }
  }

  isChecked(choiceId: string): boolean {
    const studentChoices = this.studentChoices;
    if (studentChoices != null) {
      if (this.component.isRadio()) {
        if (choiceId === studentChoices) {
          return true;
        }
      } else if (this.component.isCheckbox()) {
        if (studentChoices.indexOf(choiceId) != -1) {
          return true;
        }
      }
    }
    return false;
  }

  getChoiceIdsFromStudentData(studentData: any): string[] {
    const choiceIds = [];
    if (studentData != null && studentData.studentChoices != null) {
      const studentChoices = studentData.studentChoices;
      for (const studentDataChoice of studentChoices) {
        if (studentDataChoice != null) {
          const studentDataChoiceId = studentDataChoice.id;
          choiceIds.push(studentDataChoiceId);
        }
      }
    }
    return choiceIds;
  }

  radioChoiceSelected(choiceId: string): void {
    if (this.isDisabled) {
      return;
    }
  }

  checkboxClicked(choiceId: string): void {
    if (this.isDisabled) {
      return;
    }
    this.addOrRemoveFromStudentChoices(choiceId);
    this.studentDataChanged();
  }

  addOrRemoveFromStudentChoices(choiceId: string): void {
    const index = this.studentChoices.indexOf(choiceId);
    if (index == -1) {
      this.studentChoices.push(choiceId);
    } else {
      this.studentChoices.splice(index, 1);
    }
  }

  saveButtonClicked(): void {
    this.isCorrect = null;
    this.hideAllFeedback();
    super.saveButtonClicked();
  }

  /**
   * A submit was triggered by the component submit button or node submit button
   * @param submitTriggeredBy what triggered the submit
   * e.g. 'componentSubmitButton' or 'nodeSubmitButton'
   */
  submit(submitTriggeredBy: string): void {
    if (this.isSubmitDirty) {
      let performSubmit = true;
      if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
        performSubmit = false;
      }

      if (performSubmit) {
        this.isSubmit = true;
        this.isCorrect = null;
        this.hideAllFeedback();
        this.incrementSubmitCounter();
        if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
          this.disableAllInput();
          this.disableSubmitButton();
        }

        if (submitTriggeredBy == null || submitTriggeredBy === 'componentSubmitButton') {
          this.studentDataService.broadcastComponentSubmitTriggered({
            nodeId: this.component.nodeId,
            componentId: this.component.id
          });
          if (this.isPreviewMode()) {
            this.saveForAuthoringPreviewMode('submit');
          }
        }
      } else {
        // the student has cancelled the submit so if a component state is created, it will just be
        // a regular save and not submit
        this.isSubmit = false;
      }
    }
  }

  private hideAllFeedback(): void {
    for (const choice of this.choices) {
      choice.showFeedback = false;
    }
  }

  checkAnswer(): void {
    if (this.component.isRadio()) {
      this.checkSingleAnswer();
    } else {
      this.checkMultipleAnswer();
    }
  }

  private checkSingleAnswer(): void {
    let isCorrect = false;
    for (const choice of this.choices) {
      if (this.componentHasCorrectAnswer) {
        if (choice.isCorrect && this.isChecked(choice.id)) {
          isCorrect = true;
        }
      }
      this.displayFeedbackOnChoiceIfNecessary(choice);
    }
    if (this.componentHasCorrectAnswer) {
      this.isCorrect = isCorrect;
    }
  }

  private checkMultipleAnswer(): void {
    let isAllCorrect = true;
    for (const choice of this.choices) {
      if (this.componentHasCorrectAnswer) {
        isAllCorrect &&= this.isStudentChoiceValueCorrect(choice);
      }
      this.displayFeedbackOnChoiceIfNecessary(choice);
    }
    if (this.componentHasCorrectAnswer) {
      this.isCorrect = isAllCorrect;
    }
  }

  private displayFeedbackOnChoiceIfNecessary(choice: any): void {
    if (this.showFeedback && this.isChecked(choice.id)) {
      choice.showFeedback = true;
      choice.feedbackToShow = choice.feedback;
    }
  }

  private isStudentChoiceValueCorrect(choice: any): boolean {
    if (choice.isCorrect && this.isChecked(choice.id)) {
      return true;
    } else if (!choice.isCorrect && !this.isChecked(choice.id)) {
      return true;
    } else {
      return false;
    }
  }

  studentDataChanged(): void {
    this.isCorrect = null;
    this.isLatestComponentStateSubmit = false;
    super.studentDataChanged();
  }

  /**
   * Create a new component state populated with the student data
   * @param action the action that is triggering creating of this component state
   * e.g. 'submit', 'save', 'change'
   * @return a promise that will return a component state
   */
  createComponentState(action: string): Promise<any> {
    const componentState: any = this.createNewComponentState();
    const studentData: any = {
      studentChoices: this.getStudentChoiceObjects()
    };

    if (action === 'submit') {
      this.checkAnswer();
      if (this.isCorrect != null) {
        studentData.isCorrect = this.isCorrect;
      }
      if (this.isSubmit) {
        componentState.isSubmit = this.isSubmit;
        this.isSubmit = false;
        this.isLatestComponentStateSubmit = true;
        if (this.hasDefaultFeedback()) {
          this.addDefaultFeedback(componentState);
        }
      }
    } else if (action === 'save') {
      this.isLatestComponentStateSubmit = false;
    }

    studentData.submitCounter = this.submitCounter;
    componentState.studentData = studentData;
    componentState.componentType = 'MultipleChoice';
    componentState.nodeId = this.component.nodeId;
    componentState.componentId = this.component.id;

    const promise = new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
    return promise;
  }

  /**
   * Get the choices the student has chosen as objects.
   * @return An array of choice objects. Each choice object contains id and choice text.
   */
  private getStudentChoiceObjects(): any[] {
    return this.component.isRadio()
      ? this.getStudentChosenRadioChoice()
      : this.getStudentChosenCheckboxChoice();
  }

  private getStudentChosenRadioChoice(): any[] {
    return [
      {
        id: this.studentChoices,
        text: this.getOriginalChoiceText(this.studentChoices)
      }
    ];
  }

  private getStudentChosenCheckboxChoice(): any[] {
    return this.studentChoices.map((studentChoiceId) => {
      return {
        id: studentChoiceId,
        text: this.getOriginalChoiceText(studentChoiceId)
      };
    });
  }

  private getOriginalChoiceText(choiceId: string): string {
    return this.originalComponentContent.choices.find((choice) => choice.id === choiceId).text;
  }

  private hasCorrectChoices(): boolean {
    return this.choices.some((choice) => choice.isCorrect);
  }

  /**
   * Create a component state with the merged student responses
   * @param componentStates an array of component states
   * @return a component state with the merged student responses
   */
  createMergedComponentState(componentStates: any[]): any[] {
    const mergedComponentState: any = this.createNewComponentState();
    if (componentStates != null) {
      let mergedStudentChoices = [];
      for (const componentState of componentStates) {
        const studentChoices = componentState.studentData.studentChoices;
        if (studentChoices != null && studentChoices.length > 0) {
          mergedStudentChoices = mergedStudentChoices.concat(studentChoices);
        }
      }
      mergedComponentState.studentData = {
        studentChoices: mergedStudentChoices
      };
    }
    return mergedComponentState;
  }

  processConnectedComponentState(componentState: any): void {
    this.setStudentWork(componentState);
    this.studentDataChanged();
  }
}
