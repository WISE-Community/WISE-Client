import {
  CdkDragEnter,
  CdkDragExit,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { NotebookItem } from '../../../../common/notebook/notebookItem';
import { generateRandomKey } from '../../../../common/string/string';
import { AnnotationService } from '../../../../services/annotationService';
import { ConfigService } from '../../../../services/configService';
import { NodeService } from '../../../../services/nodeService';
import { NotebookService } from '../../../../services/notebookService';
import { ProjectService } from '../../../../services/projectService';
import { StudentAssetService } from '../../../../services/studentAssetService';
import { StudentDataService } from '../../../../services/studentDataService';
import { ComponentStudent } from '../../../component-student.component';
import { ComponentService } from '../../../componentService';
import { Choice, createChoiceFromNotebookItem } from '../../choice';
import { MatchService } from '../../matchService';
import { AddMatchChoiceDialog } from '../add-match-choice-dialog/add-match-choice-dialog';
import { copy } from '../../../../common/object/object';
import { MatchCdkDragDrop } from '../MatchCdkDragDrop';
import { Container } from '../container';
import { Item } from '../item';
import { hasConnectedComponent } from '../../../../common/ComponentContent';

@Component({
  templateUrl: 'match-student-default.component.html',
  styleUrls: ['match-student-default.component.scss']
})
export class MatchStudentDefault extends ComponentStudent {
  autoScroll: any = require('dom-autoscroller');
  buckets: any[] = [];
  bucketStyle: string = '';
  bucketWidth: number = 100;
  choices: Choice[] = [];
  choiceStyle: any = '';
  hasCorrectAnswer: boolean = false;
  isChoicesAfter: boolean = false;
  isCorrect: boolean = false;
  isHorizontal: boolean = false;
  isLatestComponentStateSubmit: boolean = false;
  numChoiceColumns: number = 1;
  privateNotebookItems: NotebookItem[] = [];
  sourceBucket: any;
  sourceBucketId: string = '0';

  constructor(
    protected annotationService: AnnotationService,
    protected componentService: ComponentService,
    protected configService: ConfigService,
    protected dialog: MatDialog,
    protected matchService: MatchService,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    private projectService: ProjectService,
    protected studentAssetService: StudentAssetService,
    protected studentDataService: StudentDataService
  ) {
    super(
      annotationService,
      componentService,
      configService,
      dialog,
      nodeService,
      notebookService,
      studentAssetService,
      studentDataService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.isChoicesAfter = this.componentContent.choicesAfter;
    this.isHorizontal = this.componentContent.horizontal;
    this.isSaveButtonVisible = this.componentContent.showSaveButton;
    this.isSubmitButtonVisible = this.componentContent.showSubmitButton;
    this.hasCorrectAnswer = this.matchService.componentHasCorrectAnswer(this.componentContent);
    this.choices = this.componentContent.choices;
    if (this.shouldImportPrivateNotes()) {
      this.importPrivateNotes();
      this.subscribeToNewNotes();
    }
    this.initializeBuckets();
    if (hasConnectedComponent(this.componentContent, 'showWork')) {
      this.handleConnectedComponents();
    } else if (
      this.matchService.componentStateHasStudentWork(this.componentState, this.componentContent)
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

  private importPrivateNotes(): void {
    this.privateNotebookItems = this.notebookService
      .getPrivateNotebookItems()
      .filter((item) => item.type === 'note' && item.serverDeleteTime == null);
    this.privateNotebookItems.forEach((item) => {
      this.choices.push(createChoiceFromNotebookItem(item));
    });
  }

  private subscribeToNewNotes(): void {
    this.subscriptions.add(
      this.notebookService.notebookUpdated$
        .pipe(filter(({ notebookItem }) => notebookItem.type === 'note'))
        .subscribe(({ notebookItem }) => this.addNotebookItemToSourceBucket(notebookItem))
    );
  }

  addNotebookItemToSourceBucket(notebookItem: NotebookItem): void {
    const choice = createChoiceFromNotebookItem(notebookItem);
    this.choices.push(choice);
    this.getSourceBucket().items.push(choice);
  }

  dragEnter(event: CdkDragEnter) {
    event.container.element.nativeElement.classList.add('primary-bg');
  }

  dragExit(event: CdkDragExit) {
    event.container.element.nativeElement.classList.remove('primary-bg');
  }

  protected drop(event: MatchCdkDragDrop<Container, Item>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data.items, event.item.data.position, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data.items,
        event.container.data.items,
        event.item.data.position,
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
        const bucket = this.matchService.getBucketById(componentStateBucket.id, this.buckets);
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
    return this.matchService.getBucketById(this.sourceBucketId, this.buckets);
  }

  clearSourceBucketChoices(): void {
    const sourceBucket = this.getSourceBucket();
    sourceBucket.items = [];
  }

  private isAuthoredChoice(choiceId: string): boolean {
    return this.getChoiceIds().includes(choiceId);
  }

  addChoiceToBucket(choice: Choice, bucket: any): void {
    const choiceId = choice.id;
    if (this.isAuthoredChoice(choiceId)) {
      this.addAuthoredChoiceToBucket(choiceId, bucket);
    } else {
      // This choice was created by the student
      bucket.items.push(choice);
    }
  }

  protected addAuthoredChoiceToBucket(choiceId: string, bucket: any): void {
    bucket.items.push(this.matchService.getChoiceById(choiceId, this.choices));
  }

  /**
   * Get the latest submitted componentState and display feedback for choices that haven't changed
   * since. This will also determine if submit is dirty.
   */
  private processPreviousStudentWork(): void {
    const latestComponentState = this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    if (latestComponentState == null) {
      return;
    }
    this.latestComponentState = latestComponentState;
    if (latestComponentState.isSubmit) {
      this.setGeneralComponentStatus(latestComponentState.isCorrect, false);
      this.checkAnswer();
    } else {
      const latestSubmitComponentState = this.studentDataService.getLatestSubmitComponentState(
        this.nodeId,
        this.componentId
      );
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

  processDirtyStudentWork(): void {
    const latestSubmitComponentState = this.studentDataService.getLatestSubmitComponentState(
      this.nodeId,
      this.componentId
    );
    if (latestSubmitComponentState != null) {
      this.showFeedbackOnUnchangedChoices(latestSubmitComponentState);
    } else {
      const latestComponentState = this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
        this.nodeId,
        this.componentId
      );
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
    return this.buckets.map((bucket) => bucket.id);
  }

  getChoiceIds(): string[] {
    return this.choices.map((choice) => choice.id);
  }

  getIds(objects: any[]): string[] {
    return objects.map((object) => {
      return object.id;
    });
  }

  protected getChoicesThatChangedSinceLastSubmit(latestSubmitComponentState: any): string[] {
    const choicesThatChanged = [];
    const previousBuckets = latestSubmitComponentState.studentData.buckets;
    for (const currentBucket of this.buckets) {
      const {
        currentBucketChoiceIds,
        previousBucketChoiceIds
      } = this.getPreviousAndCurrentChoiceIds(previousBuckets, currentBucket);
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

  protected getPreviousAndCurrentChoiceIds(previousBuckets: any[], currentBucket: any): any {
    const currentBucketChoiceIds = this.getIds(currentBucket.items);
    const previousBucket = this.matchService.getBucketById(currentBucket.id, previousBuckets);
    const previousBucketChoiceIds = this.getIds(previousBucket.items);
    return {
      currentBucketChoiceIds,
      previousBucketChoiceIds
    };
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

  private shouldImportPrivateNotes(): boolean {
    return this.isNotebookEnabled() && this.componentContent.importPrivateNotes;
  }

  initializeBuckets(): void {
    this.buckets = [];
    this.sourceBucket = this.createSourceBucket();
    this.sourceBucket.items = this.sourceBucket.items.concat(this.choices);
    this.buckets.push(this.sourceBucket);
    for (const componentContentBucket of this.componentContent.buckets) {
      const bucket = copy(componentContentBucket);
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

  /**
   * Check if the student has answered correctly and show feedback.
   * @param choiceIds to not show feedback for. This is used in the scenario where the
   * @param buckets to check
   * student submits and feedback for all the choices are displayed. Then the student moves a choice
   * to a different bucket but does not submit. They leave the step and then come back. At this
   * point, we want to show the feedback for all the choices that the student has not moved since
   * the submit. We do not want to show the feedback for the choice that the student moved after the
   * submit because that would let them receive feedback without submitting.
   */
  protected checkAnswer(
    choiceIdsExcludedFromFeedback: string[] = [],
    buckets: any[] = this.buckets
  ): void {
    let isCorrect = true;
    for (const bucket of buckets) {
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
        this.matchService.setItemStatus(item, this.hasCorrectAnswer);
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

  private getFeedback(feedbackObject: any, hasCorrectAnswer: boolean, position: number): string {
    return this.doesPositionMatter(feedbackObject.position)
      ? this.getPositionFeedback(feedbackObject, position, hasCorrectAnswer)
      : this.getNonPositionFeedback(feedbackObject, hasCorrectAnswer);
  }

  private doesPositionMatter(feedbackPosition: number): boolean {
    return this.componentContent.ordered && feedbackPosition != null;
  }

  private getPositionFeedback(
    feedbackObject: any,
    position: number,
    hasCorrectAnswer: boolean
  ): string {
    if (this.isCorrectPosition(feedbackObject, position)) {
      return feedbackObject.feedback
        ? feedbackObject.feedback
        : this.getNonPositionFeedback(feedbackObject, hasCorrectAnswer);
    } else {
      return this.getIncorrectPositionFeedback(feedbackObject);
    }
  }

  private getIncorrectPositionFeedback(feedbackObject: any): string {
    const incorrectPositionFeedback = feedbackObject.incorrectPositionFeedback;
    return incorrectPositionFeedback == null || incorrectPositionFeedback === ''
      ? $localize`Correct bucket but wrong position`
      : incorrectPositionFeedback;
  }

  private getNonPositionFeedback(feedbackObject: any, hasCorrectAnswer: boolean): string {
    let feedbackText = '';
    if (feedbackObject.feedback === '' && hasCorrectAnswer) {
      feedbackText = feedbackObject.isCorrect ? $localize`Correct` : $localize`Incorrect`;
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

  private isCorrectPosition(feedbackObject: any, position: number): boolean {
    return feedbackObject.position === position;
  }

  getFeedbackObject(bucketId: string, choiceId: string): any {
    for (const bucketFeedback of this.componentContent.feedback) {
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
        this.projectService.getComponent(this.nodeId, this.componentId),
        copy(this.buckets)
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
  private cleanBuckets(originalComponentContent: any, buckets: any): any {
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

  /**
   * Returns true if the choice has been authored to have a correct position
   * @param {string} choiceId the choice id
   * @return {boolean} whether the choice has a correct position in any bucket
   */
  isAuthorHasSpecifiedACorrectPosition(choiceId: string): boolean {
    for (const bucket of this.componentContent.feedback) {
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
  mergeChoices(choices1: Choice[], choices2: Choice[]): Choice[] {
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
          const choice = new Choice(generateRandomKey(), result);
          choice.studentCreated = true;
          this.sourceBucket.items.push(choice);
          this.studentDataChanged();
        }
      });
  }
}
