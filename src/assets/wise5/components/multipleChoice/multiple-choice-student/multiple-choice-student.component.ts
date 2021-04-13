'use strict';

import { Component } from '@angular/core';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
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
  componentHasCorrectAnswer: boolean;
  studentChoices: any;
  isCorrect: boolean;
  isLatestComponentStateSubmit: boolean;
  showFeedback: boolean;
  choices: any[];
  choiceType: string;

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    private MultipleChoiceService: MultipleChoiceService,
    protected NodeService: NodeService,
    protected StudentDataService: StudentDataService,
    protected UtilService: UtilService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      NodeService,
      StudentDataService,
      UtilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.studentChoices = [];
    this.isCorrect = null;
    this.isLatestComponentStateSubmit = false;
    this.isSaveButtonVisible = this.componentContent.showSaveButton;
    this.isSubmitButtonVisible = this.componentContent.showSubmitButton;
    this.isSaveOrSubmitButtonVisible = this.isSaveButtonVisible || this.isSubmitButtonVisible;
    this.choices = this.UtilService.makeCopyOfJSONObject(this.componentContent.choices);
    this.componentHasCorrectAnswer = this.hasCorrectChoices();
    this.showFeedback = this.componentContent.showFeedback;
    this.choiceType = this.getChoiceType();

    if (this.UtilService.hasShowWorkConnectedComponent(this.componentContent)) {
      this.handleConnectedComponents();
    } else if (
      this.MultipleChoiceService.componentStateHasStudentWork(
        this.componentState,
        this.componentContent
      )
    ) {
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

  handleNodeSubmit(): void {
    this.submit('nodeSubmitButton');
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
      if (studentChoices.includes(choice.id)) {
        choice.isChecked = true;
      }
    }
  }

  showFeedbackForChoiceIds(choiceIds: string[]): void {
    for (const choiceId of choiceIds) {
      const choiceObject = this.getChoiceById(choiceId);
      if (choiceObject != null) {
        choiceObject.showFeedback = true;
        choiceObject.feedbackToShow = choiceObject.feedback;
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
    this.studentDataChanged();
    if (this.mode === 'student') {
      const category = 'StudentInteraction';
      const event = 'choiceSelected';
      const data: any = {
        selectedChoiceId: choiceId
      };
      this.StudentDataService.saveComponentEvent(this, category, event, data);
    }
  }

  checkboxClicked(choiceId: string): void {
    if (this.isDisabled) {
      return;
    }
    this.addOrRemoveFromStudentChoices(choiceId);
    this.studentDataChanged();
    if (this.mode === 'student') {
      const category = 'StudentInteraction';
      const event = 'choiceSelected';
      const data: any = {
        selectedChoiceId: choiceId,
        choicesAfter: this.studentChoices
      };
      this.StudentDataService.saveComponentEvent(this, category, event, data);
    }
  }

  addOrRemoveFromStudentChoices(choiceId: string): void {
    const index = this.studentChoices.indexOf(choiceId);
    if (index == -1) {
      // the choice was not previously checked so we will add the choice id to the array
      this.studentChoices.push(choiceId);
    } else {
      // the choice was previously checked so we will remove the choice id from the array
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
    if (this.isAuthoringComponentPreviewMode()) {
      this.saveForAuthoringPreviewMode('save');
    }
  }

  saveForAuthoringPreviewMode(action: string): void {
    this.createComponentState(action).then((componentState: any) => {
      this.StudentDataService.setDummyIdIntoLocalId(componentState);
      this.StudentDataService.setDummyServerSaveTimeIntoLocalServerSaveTime(componentState);
      this.handleStudentWorkSavedToServer({ studentWork: componentState });
    });
  }

  /**
   * A submit was triggered by the component submit button or node submit button
   * @param submitTriggeredBy what triggered the submit
   * e.g. 'componentSubmitButton' or 'nodeSubmitButton'
   */
  submit(submitTriggeredBy: string): void {
    if (this.isSubmitDirty) {
      let performSubmit = true;
      if (this.hasMaxSubmitCount() && this.hasUsedAllSubmits()) {
        performSubmit = false;
      }

      if (performSubmit) {
        this.isSubmit = true;
        this.isCorrect = null;
        this.hideAllFeedback();
        this.incrementSubmitCounter();
        if (this.hasMaxSubmitCount() && this.hasUsedAllSubmits()) {
          this.disableAllInput();
          this.disableSubmitButton();
        }

        if (submitTriggeredBy == null || submitTriggeredBy === 'componentSubmitButton') {
          // tell the parent node that this component wants to submit
          this.StudentDataService.broadcastComponentSubmitTriggered({
            nodeId: this.nodeId,
            componentId: this.componentId
          });
          if (this.isAuthoringComponentPreviewMode()) {
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
    for (const choice of this.getChoices()) {
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
    for (const choice of this.getChoices()) {
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
    for (const choice of this.getChoices()) {
      if (this.componentHasCorrectAnswer) {
        if (this.isStudentChoiceValueCorrect(choice)) {
          isAllCorrect = isAllCorrect && true;
        } else {
          isAllCorrect = false;
        }
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
    }

    if (action === 'submit') {
      if (this.isSubmit) {
        componentState.isSubmit = this.isSubmit;
        this.isSubmit = false;
        this.isLatestComponentStateSubmit = true;
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
    const choiceObject = this.getChoiceById(this.studentChoices);
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
    for (const studentChoiceId of this.studentChoices) {
      const choiceObject = this.getChoiceById(studentChoiceId);
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

  getChoiceById(choiceId: string): any {
    for (const choice of this.componentContent.choices) {
      if (choice.id === choiceId) {
        return choice;
      }
    }
    return null;
  }

  getChoiceType(): string {
    return this.componentContent.choiceType;
  }

  getChoices(): any[] {
    return this.choices;
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
}
