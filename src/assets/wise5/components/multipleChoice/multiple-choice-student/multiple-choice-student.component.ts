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
import { MultipleChoiceService } from '../multipleChoiceService';

@Component({
  selector: 'multiple-choice-student',
  templateUrl: 'multiple-choice-student.component.html',
  styleUrls: ['multiple-choice-student.component.scss']
})
export class MultipleChoiceStudent extends ComponentStudent {
  choices: any[];
  choiceType: string;
  componentHasCorrectAnswer: boolean;
  isCorrect: boolean;
  isLatestComponentStateSubmit: boolean;
  originalComponentContent: any;
  showFeedback: boolean;
  studentChoices: any;

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected dialog: MatDialog,
    private MultipleChoiceService: MultipleChoiceService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private ProjectService: ProjectService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService,
    protected UtilService: UtilService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      dialog,
      NodeService,
      NotebookService,
      StudentAssetService,
      StudentDataService,
      UtilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.studentChoices = [];
    this.isCorrect = null;
    this.isLatestComponentStateSubmit = false;
    this.choices = this.UtilService.makeCopyOfJSONObject(this.componentContent.choices);
    this.componentHasCorrectAnswer = this.hasCorrectChoices();
    this.showFeedback = this.componentContent.showFeedback;
    this.choiceType = this.getChoiceType();

    if (this.UtilService.hasShowWorkConnectedComponent(this.componentContent)) {
      this.handleConnectedComponents();
    } else if (this.componentStateHasStudentWork(this.componentState, this.componentContent)) {
      this.setStudentWork(this.componentState);
    } else if (this.UtilService.hasConnectedComponent(this.componentContent)) {
      this.handleConnectedComponents();
    }

    if (this.componentState != null && this.componentState.isSubmit) {
      this.isLatestComponentStateSubmit = true;
    }

    if (this.hasMaxSubmitCount() && !this.hasSubmitsLeft()) {
      this.isDisabled = true;
      this.isSubmitButtonDisabled = true;
    }

    this.disableComponentIfNecessary();
    this.broadcastDoneRenderingComponent();
  }

  componentStateHasStudentWork(componentState: any, componentContent: any): boolean {
    return this.MultipleChoiceService.componentStateHasStudentWork(
      componentState,
      componentContent
    );
  }

  handleConnectedComponents(): void {
    for (const connectedComponent of this.componentContent.connectedComponents) {
      const componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
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

      if (this.isRadio()) {
        this.studentChoices = choiceIds[0];
      } else if (this.isCheckbox()) {
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
      if (this.isRadio()) {
        if (choiceId === studentChoices) {
          return true;
        }
      } else if (this.isCheckbox()) {
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

  isRadio(): boolean {
    return this.isChoiceType('radio');
  }

  isCheckbox(): boolean {
    return this.isChoiceType('checkbox');
  }

  /**
   * Check if the component is authored to use the given choice type
   * @param choiceType the choice type ('radio' or 'checkbox')
   * @return whether the component is authored to use the given choice type
   */
  isChoiceType(choiceType: string): boolean {
    return choiceType === this.componentContent.choiceType;
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
          // tell the parent node that this component wants to submit
          this.StudentDataService.broadcastComponentSubmitTriggered({
            nodeId: this.nodeId,
            componentId: this.componentId
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

  hideAllFeedback(): void {
    for (const choice of this.choices) {
      choice.showFeedback = false;
    }
  }

  checkAnswer(): void {
    if (this.getChoiceType() === 'radio') {
      this.checkSingleAnswer();
    } else if (this.getChoiceType() === 'checkbox') {
      this.checkMultipleAnswer();
    }
  }

  checkSingleAnswer(): void {
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

  checkMultipleAnswer(): void {
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

  displayFeedbackOnChoiceIfNecessary(choice: any): void {
    if (this.showFeedback && this.isChecked(choice.id)) {
      choice.showFeedback = true;
      choice.feedbackToShow = choice.feedback;
    }
  }

  isStudentChoiceValueCorrect(choice: any): boolean {
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
    const componentState: any = this.NodeService.createNewComponentState();
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
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;

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
  getStudentChoiceObjects(): any[] {
    if (this.isRadio()) {
      return this.getStudentChosenRadioChoice();
    } else if (this.isCheckbox()) {
      return this.getStudentChosenCheckboxChoice();
    }
  }

  getStudentChosenRadioChoice(): any[] {
    const studentChoiceObjects = [];
    const originalComponentContent = this.ProjectService.getComponentByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    const choiceObject = this.getChoiceById(originalComponentContent, this.studentChoices);
    if (choiceObject != null) {
      const studentChoiceObject = {
        id: choiceObject.id,
        text: choiceObject.text
      };
      studentChoiceObjects.push(studentChoiceObject);
    }
    return studentChoiceObjects;
  }

  getStudentChosenCheckboxChoice(): any[] {
    const studentChoiceObjects = [];
    const originalComponentContent = this.ProjectService.getComponentByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    for (const studentChoiceId of this.studentChoices) {
      const choiceObject = this.getChoiceById(originalComponentContent, studentChoiceId);
      if (choiceObject != null) {
        const studentChoiceObject = {
          id: choiceObject.id,
          text: choiceObject.text
        };
        studentChoiceObjects.push(studentChoiceObject);
      }
    }
    return studentChoiceObjects;
  }

  hasCorrectChoices(): boolean {
    for (const choice of this.componentContent.choices) {
      if (choice.isCorrect) {
        return true;
      }
    }
    return false;
  }

  hasFeedback(): boolean {
    for (const choice of this.componentContent.choices) {
      if (choice.feedback != null && choice.feedback !== '') {
        return true;
      }
    }
    return false;
  }

  /**
   * @param originalComponentContent The component content that has not had any additional content
   * injected into it such as onclick attributes and absolute asset paths.
   * @param choiceId
   */
  getChoiceById(originalComponentContent: any, choiceId: string): any {
    for (const choice of originalComponentContent.choices) {
      if (choice.id === choiceId) {
        return choice;
      }
    }
    return null;
  }

  getChoiceType(): string {
    return this.componentContent.choiceType;
  }

  /**
   * Create a component state with the merged student responses
   * @param componentStates an array of component states
   * @return a component state with the merged student responses
   */
  createMergedComponentState(componentStates: any[]): any[] {
    const mergedComponentState: any = this.NodeService.createNewComponentState();
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
