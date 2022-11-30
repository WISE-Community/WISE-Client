import { Component } from '@angular/core';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { MatchService } from '../matchService';
import { MatDialog } from '@angular/material/dialog';
import { AddMatchChoiceDialog } from './add-match-choice-dialog/add-match-choice-dialog';
import { ProjectService } from '../../../services/projectService';
import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { RandomKeyService } from '../../../services/randomKeyService';

@Component({
  selector: 'match-student',
  templateUrl: 'match-student.component.html',
  styleUrls: ['match-student.component.scss']
})
export class MatchStudent extends ComponentStudent {
  autoScroll: any;
  buckets: any[] = [];
  bucketStyle: string = '';
  bucketWidth: number = 100;
  choices: any[] = [];
  choiceStyle: any = '';
  hasCorrectAnswer: boolean = false;
  isChoicesAfter: boolean = false;
  isCorrect: boolean = false;
  isHorizontal: boolean = false;
  isLatestComponentStateSubmit: boolean = false;
  numChoiceColumns: number = 1;
  privateNotebookItems: any[] = [];
  sourceBucket: any;
  sourceBucketId: string = '0';

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected dialog: MatDialog,
    private MatchService: MatchService,
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
    this.autoScroll = require('dom-autoscroller');
    this.isChoicesAfter = this.componentContent.choicesAfter;
    this.isHorizontal = this.componentContent.horizontal;
    this.isSaveButtonVisible = this.componentContent.showSaveButton;
    this.isSubmitButtonVisible = this.componentContent.showSubmitButton;
    this.hasCorrectAnswer = this.MatchService.hasCorrectChoices(this.componentContent);
    if (this.shouldImportPrivateNotes()) {
      this.importPrivateNotes();
    }
    this.initializeChoices();
    this.initializeBuckets();
    if (this.UtilService.hasShowWorkConnectedComponent(this.componentContent)) {
      this.handleConnectedComponents();
    } else if (
      this.MatchService.componentStateHasStudentWork(this.componentState, this.componentContent)
    ) {
      this.setStudentWork(this.componentState);
    } else if (this.component.hasConnectedComponent()) {
      this.handleConnectedComponents();
    }
    if (this.componentState != null && this.componentState.isSubmit) {
      this.isLatestComponentStateSubmit = true;
    }
    this.tryDisableComponent();
    this.disableComponentIfNecessary();
    this.broadcastDoneRenderingComponent();
  }

  ngAfterContentInit() {
    this.registerAutoScroll();
  }

  importPrivateNotes(): void {
    const allPrivateNotebookItems = this.NotebookService.getPrivateNotebookItems();
    this.privateNotebookItems = allPrivateNotebookItems.filter((note) => {
      return note.serverDeleteTime == null;
    });
    this.subscriptions.add(
      this.NotebookService.notebookUpdated$.subscribe((args) => {
        if (args.notebookItem.type === 'note') {
          this.addNotebookItemToSourceBucket(args.notebookItem);
        }
      })
    );
  }

  addNotebookItemToSourceBucket(notebookItem: any): void {
    const choice = this.createChoiceFromNotebookItem(notebookItem);
    this.choices.push(choice);
    const sourceBucket = this.getSourceBucket();
    sourceBucket.items.push(choice);
  }

  dragEnter(event: CdkDragEnter) {
    event.container.element.nativeElement.classList.add('primary-bg');
  }

  dragExit(event: CdkDragExit) {
    event.container.element.nativeElement.classList.remove('primary-bg');
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.item.data, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.item.data,
        event.currentIndex
      );
    }
    event.container.element.nativeElement.classList.remove('primary-bg');
    this.studentDataChanged();
  }

  registerAutoScroll(): void {
    this.autoScroll([document.querySelector('#content')], {
      margin: 30,
      scrollWhenOutside: true,
      autoScroll: function () {
        return this.down;
      }
    });
  }

  setStudentWork(componentState: any): void {
    this.addComponentStateChoicesToBuckets(componentState);
    if (componentState.studentData.submitCounter != null) {
      this.submitCounter = componentState.studentData.submitCounter;
    }
    this.processPreviousStudentWork();
  }

  addComponentStateChoicesToBuckets(componentState: any): void {
    this.clearSourceBucketChoices();
    const bucketIds = this.getBucketIds();
    const choiceIds = this.getChoiceIds();
    for (const componentStateBucket of componentState.studentData.buckets) {
      if (bucketIds.includes(componentStateBucket.id)) {
        const bucket = this.MatchService.getBucketById(componentStateBucket.id, this.buckets);
        for (const componentStateChoice of componentStateBucket.items) {
          this.addChoiceToBucket(componentStateChoice, bucket);
          const choiceLocation = choiceIds.indexOf(componentStateChoice.id);
          if (choiceLocation != -1) {
            choiceIds.splice(choiceLocation, 1);
          }
        }
      }
    }
    const sourceBucket = this.getSourceBucket();
    for (const choiceId of choiceIds) {
      this.addAuthoredChoiceToBucket(choiceId, sourceBucket);
    }
  }

  getSourceBucket(): any {
    return this.MatchService.getBucketById(this.sourceBucketId, this.buckets);
  }

  clearSourceBucketChoices(): void {
    const sourceBucket = this.getSourceBucket();
    sourceBucket.items = [];
  }

  isAuthoredChoice(choiceId: string): boolean {
    return this.getChoiceIds().includes(choiceId);
  }

  addChoiceToBucket(choice: any, bucket: any): void {
    const choiceId = choice.id;
    if (this.isAuthoredChoice(choiceId)) {
      this.addAuthoredChoiceToBucket(choiceId, bucket);
    } else {
      // This choice was created by the student
      bucket.items.push(choice);
    }
  }

  addAuthoredChoiceToBucket(choiceId: string, bucket: any): void {
    bucket.items.push(this.MatchService.getChoiceById(choiceId, this.choices));
  }

  /**
   * Get the latest submitted componentState and display feedback for choices that haven't changed
   * since. This will also determine if submit is dirty.
   */
  processPreviousStudentWork(): void {
    const latestComponentState = this.getLatestComponentState();
    if (latestComponentState == null) {
      return;
    }
    this.latestComponentState = latestComponentState;
    if (latestComponentState.isSubmit) {
      this.setGeneralComponentStatus(latestComponentState.isCorrect, false);
      this.checkAnswer();
    } else {
      const latestSubmitComponentState = this.getLatestSubmitComponentState();
      if (latestSubmitComponentState != null) {
        this.showFeedbackOnUnchangedChoices(latestSubmitComponentState);
      } else {
        this.setGeneralComponentStatus(null, false);
      }
    }
  }

  setGeneralComponentStatus(isCorrect: boolean, isSubmitDirty: boolean): void {
    this.isCorrect = isCorrect;
    this.setIsSubmitDirty(isSubmitDirty);
  }

  getLatestComponentState(): any {
    return this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
  }

  getLatestSubmitComponentState(): any {
    return this.StudentDataService.getLatestSubmitComponentState(this.nodeId, this.componentId);
  }

  processDirtyStudentWork(): void {
    const latestSubmitComponentState = this.getLatestSubmitComponentState();
    if (latestSubmitComponentState != null) {
      this.showFeedbackOnUnchangedChoices(latestSubmitComponentState);
    } else {
      const latestComponentState = this.getLatestComponentState();
      if (latestComponentState != null) {
        this.isCorrect = null;
        this.setIsSubmitDirty(true);
        this.latestComponentState = latestComponentState;
      }
    }
  }

  showFeedbackOnUnchangedChoices(latestSubmitComponentState: any): void {
    const choicesThatChangedSinceLastSubmit = this.getChoicesThatChangedSinceLastSubmit(
      latestSubmitComponentState
    );
    if (choicesThatChangedSinceLastSubmit.length > 0) {
      this.setIsSubmitDirty(true);
    } else {
      this.setIsSubmitDirty(false);
    }
    this.checkAnswer(choicesThatChangedSinceLastSubmit);
  }

  setIsSubmitDirty(isSubmitDirty: boolean): void {
    this.isSubmitDirty = isSubmitDirty;
    this.emitComponentSubmitDirty(isSubmitDirty);
  }

  getBucketIds(): string[] {
    return this.getIds(this.buckets);
  }

  getChoiceIds(): string[] {
    return this.getIds(this.choices);
  }

  getIds(objects: any[]): string[] {
    return objects.map((object) => {
      return object.id;
    });
  }

  getChoicesThatChangedSinceLastSubmit(latestSubmitComponentState: any): any[] {
    const choicesThatChanged = [];
    const previousBuckets = latestSubmitComponentState.studentData.buckets;
    for (const currentBucket of this.buckets) {
      const currentBucketChoiceIds = this.getIds(currentBucket.items);
      const previousBucket = this.MatchService.getBucketById(currentBucket.id, previousBuckets);
      const previousBucketChoiceIds = this.getIds(previousBucket.items);
      for (
        let currentChoiceIndex = 0;
        currentChoiceIndex < currentBucketChoiceIds.length;
        currentChoiceIndex++
      ) {
        if (
          this.isChoiceChanged(previousBucketChoiceIds, currentBucketChoiceIds, currentChoiceIndex)
        ) {
          choicesThatChanged.push(currentBucketChoiceIds[currentChoiceIndex]);
        }
      }
    }
    return choicesThatChanged;
  }

  isChoiceChanged(
    previousBucketChoiceIds: string[],
    currentBucketChoiceIds: string[],
    currentChoiceIndex: number
  ): boolean {
    const currentBucketChoiceId = currentBucketChoiceIds[currentChoiceIndex];
    return (
      !previousBucketChoiceIds.includes(currentBucketChoiceId) ||
      (this.isAuthorHasSpecifiedACorrectPosition(currentBucketChoiceId) &&
        this.choicePositionHasChangedInBucket(
          previousBucketChoiceIds,
          currentBucketChoiceId,
          currentChoiceIndex
        ))
    );
  }

  choicePositionHasChangedInBucket(
    previousBucketChoiceIds: string[],
    currentChoiceId: string,
    currentChoiceIndex: number
  ): boolean {
    return currentChoiceIndex != previousBucketChoiceIds.indexOf(currentChoiceId);
  }

  initializeChoices(): void {
    this.choices = this.componentContent.choices;
    if (this.shouldImportPrivateNotes()) {
      for (const privateNotebookItem of this.privateNotebookItems) {
        if (privateNotebookItem.type === 'note') {
          this.choices.push(this.createChoiceFromNotebookItem(privateNotebookItem));
        }
      }
    }
  }

  shouldImportPrivateNotes(): boolean {
    return this.isNotebookEnabled() && this.componentContent.importPrivateNotes;
  }

  createChoiceFromNotebookItem(notebookItem: any): any {
    let value = notebookItem.content.text;
    for (const attachment of notebookItem.content.attachments) {
      value += `<div><img src="${attachment.iconURL}" alt="image from note"/></div>`;
    }
    return {
      id: notebookItem.localNotebookItemId,
      value: value,
      type: 'choice'
    };
  }

  initializeBuckets(): void {
    this.buckets = [];
    this.sourceBucket = this.createSourceBucket();
    this.sourceBucket.items = this.sourceBucket.items.concat(this.choices);
    this.buckets.push(this.sourceBucket);
    for (const componentContentBucket of this.componentContent.buckets) {
      const bucket = JSON.parse(JSON.stringify(componentContentBucket));
      bucket.items = [];
      this.buckets.push(bucket);
    }
  }

  createSourceBucket(): any {
    return {
      id: this.sourceBucketId,
      value: this.getSourceBucketLabel(),
      type: 'bucket',
      items: []
    };
  }

  getSourceBucketLabel(): string {
    return this.componentContent.choicesLabel
      ? this.componentContent.choicesLabel
      : $localize`Choices`;
  }

  getDeepCopyOfBuckets(): any[] {
    return JSON.parse(JSON.stringify(this.buckets));
  }

  /**
   * Check if the student has answered correctly and show feedback.
   * @param {array} choiceIds to not show feedback for. This is used in the scenario where the
   * student submits and feedback for all the choices are displayed. Then the student moves a choice
   * to a different bucket but does not submit. They leave the step and then come back. At this
   * point, we want to show the feedback for all the choices that the student has not moved since
   * the submit. We do not want to show the feedback for the choice that the student moved after the
   * submit because that would let them receive feedback without submitting.
   */
  checkAnswer(choiceIdsExcludedFromFeedback = []): void {
    let isCorrect = true;
    for (const bucket of this.buckets) {
      const bucketId = bucket.id;
      const items = bucket.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const position = i + 1;
        const choiceId = item.id;
        if (
          choiceIdsExcludedFromFeedback.includes(choiceId) ||
          this.getFeedbackObject(bucketId, choiceId) == null
        ) {
          item.feedback = null;
        } else {
          const isChoiceCorrect = this.checkAnswerAndDisplayFeedback(
            bucketId,
            item,
            position,
            this.hasCorrectAnswer
          );
          isCorrect &&= isChoiceCorrect;
        }
        this.MatchService.setItemStatus(item, this.hasCorrectAnswer);
      }
    }

    if (this.hasCorrectAnswer) {
      this.isCorrect = isCorrect;
    } else {
      this.isCorrect = null;
    }
  }

  checkAnswerAndDisplayFeedback(
    bucketId: string,
    choice: any,
    position: number,
    hasCorrectAnswer: boolean
  ): boolean {
    const feedbackObject = this.getFeedbackObject(bucketId, choice.id);
    choice.feedback = this.getFeedback(feedbackObject, hasCorrectAnswer, position);
    const isCorrect = this.getCorrectness(feedbackObject, hasCorrectAnswer, position);
    choice.isCorrect = isCorrect;
    if (this.doesPositionMatter(feedbackObject.position)) {
      choice.isIncorrectPosition = !this.isCorrectPosition(feedbackObject, position);
    }
    this.tryDisableComponent();
    return isCorrect;
  }

  getFeedback(feedbackObject: any, hasCorrectAnswer: boolean, position: number): string {
    if (this.doesPositionMatter(feedbackObject.position)) {
      return this.getPositionFeedback(feedbackObject, position, hasCorrectAnswer);
    } else {
      return this.getNonPositionFeedback(feedbackObject, hasCorrectAnswer);
    }
  }

  doesPositionMatter(feedbackPosition: number): boolean {
    return this.componentContent.ordered && feedbackPosition != null;
  }

  getPositionFeedback(feedbackObject: any, position: number, hasCorrectAnswer: boolean): string {
    if (this.isCorrectPosition(feedbackObject, position)) {
      return feedbackObject.feedback
        ? feedbackObject.feedback
        : this.getNonPositionFeedback(feedbackObject, hasCorrectAnswer);
    } else {
      return this.getIncorrectPositionFeedback(feedbackObject);
    }
  }

  getIncorrectPositionFeedback(feedbackObject: any): string {
    const incorrectPositionFeedback = feedbackObject.incorrectPositionFeedback;
    if (incorrectPositionFeedback == null || incorrectPositionFeedback === '') {
      return $localize`Correct bucket but wrong position`;
    } else {
      return incorrectPositionFeedback;
    }
  }

  getNonPositionFeedback(feedbackObject: any, hasCorrectAnswer: boolean): string {
    let feedbackText = '';
    if (feedbackObject.feedback === '' && hasCorrectAnswer) {
      if (feedbackObject.isCorrect) {
        feedbackText = $localize`Correct`;
      } else {
        feedbackText = $localize`Incorrect`;
      }
    } else {
      feedbackText = feedbackObject.feedback;
    }
    return feedbackText;
  }

  getCorrectness(feedbackObject: any, hasCorrectAnswer: boolean, position: number): boolean {
    if (!hasCorrectAnswer) {
      return null;
    } else if (this.doesPositionMatter(feedbackObject.position)) {
      return this.isCorrectPosition(feedbackObject, position);
    } else {
      return feedbackObject.isCorrect;
    }
  }

  isCorrectPosition(feedbackObject: any, position: number): boolean {
    return position === feedbackObject.position;
  }

  getAllFeedback(): any[] {
    return this.componentContent.feedback;
  }

  getFeedbackObject(bucketId: string, choiceId: string): any {
    for (const bucketFeedback of this.getAllFeedback()) {
      if (bucketFeedback.bucketId === bucketId) {
        for (const choiceFeedback of bucketFeedback.choices) {
          if (choiceFeedback.choiceId === choiceId) {
            return choiceFeedback;
          }
        }
      }
    }
    return null;
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
    if (action === 'submit') {
      this.checkAnswer();
      this.isLatestComponentStateSubmit = true;
    } else {
      this.clearFeedback();
      this.processDirtyStudentWork();
      this.isLatestComponentStateSubmit = false;
    }
    const componentState = this.createComponentStateObject(action);
    this.isSubmit = false;
    return new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
  }

  createComponentStateObject(action: string): any {
    const componentState: any = this.createNewComponentState();
    componentState.componentType = 'Match';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    componentState.isSubmit = this.isSubmit;
    const studentData: any = {
      buckets: this.cleanBuckets(
        this.ProjectService.getComponent(this.nodeId, this.componentId),
        this.getDeepCopyOfBuckets()
      ),
      submitCounter: this.submitCounter
    };
    if (action === 'submit' && this.hasCorrectAnswer) {
      studentData.isCorrect = this.isCorrect;
    }
    componentState.studentData = studentData;
    if (this.isSubmit && this.hasDefaultFeedback()) {
      this.addDefaultFeedback(componentState);
    }
    return componentState;
  }

  /**
   * @param originalComponentContent The component content that has not had any additional content
   * injected into it such as onclick attributes and absolute asset paths.
   * @param buckets
   */
  cleanBuckets(originalComponentContent: any, buckets: any): any {
    for (const bucket of buckets) {
      bucket.value = this.getCleanedValue(originalComponentContent, bucket);
      for (const item of bucket.items) {
        item.value = this.getCleanedValue(originalComponentContent, item);
        delete item.status;
      }
    }
    return buckets;
  }

  /**
   * @param originalComponentContent The component content that has not had any additional content
   * injected into it such as onclick attributes and absolute asset paths.
   * @param matchObj
   */
  getCleanedValue(originalComponentContent: any, matchObj: any): string {
    return this.getValueById(originalComponentContent, matchObj.id) ?? matchObj.value;
  }

  getValueById(componentContent: any, id: string): string {
    for (const bucket of componentContent.buckets) {
      if (bucket.id === id) {
        return bucket.value;
      }
    }
    for (const choice of componentContent.choices) {
      if (choice.id === id) {
        return choice.value;
      }
    }
    return null;
  }

  clearFeedback(): void {
    for (const choice of this.choices) {
      choice.isCorrect = null;
      choice.isIncorrectPosition = null;
      choice.feedback = null;
    }
  }

  isAuthorHasSpecifiedACorrectBucket(choiceId: string): boolean {
    for (const bucket of this.getAllFeedback()) {
      for (const choice of bucket.choices) {
        if (choice.choiceId === choiceId) {
          if (choice.isCorrect) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Returns true if the choice has been authored to have a correct position
   * @param {string} choiceId the choice id
   * @return {boolean} whether the choice has a correct position in any bucket
   */
  isAuthorHasSpecifiedACorrectPosition(choiceId: string): boolean {
    for (const bucket of this.getAllFeedback()) {
      for (const choice of bucket.choices) {
        if (choice.choiceId === choiceId) {
          if (choice.position != null) {
            return true;
          }
        }
      }
    }
    return false;
  }

  createMergedComponentState(componentStates: any[]): any[] {
    const mergedBuckets = [];
    for (const componentState of componentStates) {
      for (const bucket of componentState.studentData.buckets) {
        this.mergeBucket(mergedBuckets, bucket);
      }
    }
    const mergedComponentState: any = this.createNewComponentState();
    mergedComponentState.studentData = {
      buckets: mergedBuckets
    };
    return mergedComponentState;
  }

  /**
   * Merge a bucket into the array of buckets. If the bucket id already exists in the array, merge
   * the choices in the bucket. If the bucket does not already exist in the array, add the bucket.
   * The array of buckets will be modified.
   * @param {array} buckets an array of buckets
   * @param {object} bucket the bucket
   * @return {array} an array of buckets
   */
  mergeBucket(buckets: any[], bucket: any): any[] {
    let bucketFound = false;
    for (const tempBucket of buckets) {
      if (tempBucket.id == bucket.id) {
        bucketFound = true;
        tempBucket.items = this.mergeChoices(tempBucket.items, bucket.items);
      }
    }
    if (!bucketFound) {
      buckets.push(bucket);
    }
    return buckets;
  }

  /**
   * Merge two arrays of choices.
   * @param {array} choices1 an array of choice objects
   * @param {array} choices2 an array of choice objects
   * @return {array} A new array of unique choice objects
   */
  mergeChoices(choices1: any[], choices2: any[]): any[] {
    const mergedChoices = choices1.slice();
    const choices1Ids = this.getIds(choices1);
    for (const choice2 of choices2) {
      if (!choices1Ids.includes(choice2.id)) {
        mergedChoices.push(choice2);
      }
    }
    return mergedChoices;
  }

  addChoice(): void {
    this.dialog
      .open(AddMatchChoiceDialog, {
        panelClass: 'dialog-sm'
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const newChoice = {
            id: RandomKeyService.generate(),
            value: result,
            type: 'choice',
            studentCreated: true
          };
          this.sourceBucket.items.push(newChoice);
          this.studentDataChanged();
        }
      });
  }
}
