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
import { AddMatchChoiceDialogComponent } from '../add-match-choice-dialog/add-match-choice-dialog';
import { copy } from '../../../../common/object/object';
import { MatchCdkDragDrop } from '../MatchCdkDragDrop';
import { Container } from '../container';
import { Item } from '../item';
import { hasConnectedComponent } from '../../../../common/ComponentContent';
import { Bucket, mergeBucket } from '../../bucket';

@Component({
  templateUrl: 'match-student-default.component.html',
  styleUrl: 'match-student-default.component.scss'
})
export class MatchStudentDefault extends ComponentStudent {
  autoScroll: any = require('dom-autoscroller');
  buckets: any[] = [];
  bucketStyle: string = '';
  bucketWidth: number = 100;
  choices: Choice[] = [];
  choiceStyle: any = '';
  hasCorrectAnswer: boolean = false;
  isCorrect: boolean = false;
  isLatestComponentStateSubmit: boolean = false;
  sourceBucket: any;
  sourceBucketId: string = '0';

  constructor(
    protected annotationService: AnnotationService,
    protected assetService: StudentAssetService,
    protected componentService: ComponentService,
    protected configService: ConfigService,
    protected dataService: StudentDataService,
    protected dialog: MatDialog,
    protected matchService: MatchService,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    private projectService: ProjectService
  ) {
    super(
      annotationService,
      componentService,
      configService,
      dialog,
      nodeService,
      notebookService,
      assetService,
      dataService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
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
    this.isLatestComponentStateSubmit = this.componentState != null && this.componentState.isSubmit;
    this.tryDisableComponent();
    this.disableComponentIfNecessary();
    this.broadcastDoneRenderingComponent();
  }

  private shouldImportPrivateNotes(): boolean {
    return this.isNotebookEnabled() && this.componentContent.importPrivateNotes;
  }

  private initializeBuckets(): void {
    this.buckets = [];
    this.sourceBucket = {
      id: this.sourceBucketId,
      value: this.componentContent.choicesLabel ?? $localize`Choices`,
      type: 'bucket',
      items: [...this.choices]
    };
    this.buckets.push(this.sourceBucket);
    this.componentContent.buckets.forEach((bucket) => {
      const bucketCopy = copy(bucket);
      bucketCopy.items = [];
      this.buckets.push(bucketCopy);
    });
  }

  ngAfterContentInit(): void {
    this.autoScroll([document.querySelector('#content')], {
      margin: 30,
      scrollWhenOutside: true,
      autoScroll: function () {
        return this.down;
      }
    });
  }

  private importPrivateNotes(): void {
    this.notebookService
      .getPrivateNotebookItems()
      .filter((item) => item.type === 'note' && item.serverDeleteTime == null)
      .forEach((item) => {
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
    this.getBucketById(this.sourceBucketId).items.push(choice);
  }

  protected dragEnter(event: CdkDragEnter): void {
    event.container.element.nativeElement.classList.add('primary-bg');
  }

  protected dragExit(event: CdkDragExit): void {
    event.container.element.nativeElement.classList.remove('primary-bg');
  }

  protected drop(event: MatchCdkDragDrop<Container, Item>): void {
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

  setStudentWork(componentState: any): void {
    this.getBucketById(this.sourceBucketId).items = [];
    this.addComponentStateChoicesToBuckets(componentState);
    if (componentState.studentData.submitCounter != null) {
      this.submitCounter = componentState.studentData.submitCounter;
    }
    this.processPreviousStudentWork();
  }

  private addComponentStateChoicesToBuckets(componentState: any): void {
    const choiceIds = this.choices.map((choice) => choice.id);
    for (const componentStateBucket of componentState.studentData.buckets) {
      if (this.buckets.some((bucket) => bucket.id === componentStateBucket.id)) {
        const bucket = this.getBucketById(componentStateBucket.id);
        componentStateBucket.items.forEach((componentStateChoice) => {
          this.addChoiceToBucket(componentStateChoice, bucket);
          const choiceLocation = choiceIds.indexOf(componentStateChoice.id);
          if (choiceLocation != -1) {
            choiceIds.splice(choiceLocation, 1);
          }
        });
      }
    }
    const sourceBucket = this.getBucketById(this.sourceBucketId);
    choiceIds.forEach((choiceId) => this.addAuthoredChoiceToBucket(choiceId, sourceBucket));
  }

  private getBucketById(id: string, buckets: Bucket[] = this.buckets): Bucket {
    return buckets.find((bucket) => bucket.id === id);
  }

  private addChoiceToBucket(choice: Choice, bucket: Bucket): void {
    bucket.items.push(
      this.choices.some((authoredChoice) => authoredChoice.id === choice.id)
        ? this.choices.find((authoredChoice) => authoredChoice.id === choice.id)
        : choice // this is a choice that was created by the student
    );
  }

  protected addAuthoredChoiceToBucket(choiceId: string, bucket: Bucket): void {
    bucket.items.push(this.choices.find((choice) => choice.id === choiceId));
  }

  /**
   * Get the latest submitted componentState and display feedback for choices that haven't changed
   * since. This will also determine if submit is dirty.
   */
  private processPreviousStudentWork(): void {
    const latestComponentState = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
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
      const latestSubmitComponentState = this.dataService.getLatestSubmitComponentState(
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

  private setGeneralComponentStatus(isCorrect: boolean, isSubmitDirty: boolean): void {
    this.isCorrect = isCorrect;
    this.setIsSubmitDirty(isSubmitDirty);
  }

  private processDirtyStudentWork(): void {
    const latestSubmitComponentState = this.dataService.getLatestSubmitComponentState(
      this.nodeId,
      this.componentId
    );
    if (latestSubmitComponentState != null) {
      this.showFeedbackOnUnchangedChoices(latestSubmitComponentState);
    } else {
      const latestComponentState = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
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

  private showFeedbackOnUnchangedChoices(latestSubmitComponentState: any): void {
    const updatedChoices = this.getUpdatedChoicesSinceLastSubmit(latestSubmitComponentState);
    if (updatedChoices.length > 0) {
      this.setIsSubmitDirty(true);
    } else {
      this.setIsSubmitDirty(false);
    }
    this.checkAnswer(updatedChoices);
  }

  setIsSubmitDirty(isSubmitDirty: boolean): void {
    this.isSubmitDirty = isSubmitDirty;
    this.emitComponentSubmitDirty(isSubmitDirty);
  }

  protected getUpdatedChoicesSinceLastSubmit(latestSubmitComponentState: any): string[] {
    const updatedChoices = [];
    const previousBuckets = latestSubmitComponentState.studentData.buckets;
    for (const currentBucket of this.buckets) {
      const { currentBucketChoiceIds, previousBucketChoiceIds } =
        this.getPreviousAndCurrentChoiceIds(previousBuckets, currentBucket);
      for (
        let currentChoiceIndex = 0;
        currentChoiceIndex < currentBucketChoiceIds.length;
        currentChoiceIndex++
      ) {
        if (
          this.isChoiceChanged(previousBucketChoiceIds, currentBucketChoiceIds, currentChoiceIndex)
        ) {
          updatedChoices.push(currentBucketChoiceIds[currentChoiceIndex]);
        }
      }
    }
    return updatedChoices;
  }

  protected getPreviousAndCurrentChoiceIds(previousBuckets: any[], currentBucket: any): any {
    const currentBucketChoiceIds = currentBucket.items.map((item) => item.id);
    const previousBucket = this.getBucketById(currentBucket.id, previousBuckets);
    const previousBucketChoiceIds = previousBucket.items.map((item) => item.id);
    return {
      currentBucketChoiceIds,
      previousBucketChoiceIds
    };
  }

  private isChoiceChanged(
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

  private choicePositionHasChangedInBucket(
    previousBucketChoiceIds: string[],
    currentChoiceId: string,
    currentChoiceIndex: number
  ): boolean {
    return currentChoiceIndex != previousBucketChoiceIds.indexOf(currentChoiceId);
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
      choice.isIncorrectPosition = feedbackObject.position !== position;
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
    if (feedbackObject.position === position) {
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
      return feedbackObject.position === position;
    } else {
      return feedbackObject.isCorrect;
    }
  }

  getFeedbackObject(bucketId: string, choiceId: string): any {
    return (
      this.componentContent.feedback
        .find((bucketFeedback) => bucketFeedback.bucketId === bucketId)
        ?.choices.find((choiceFeedback) => choiceFeedback.choiceId === choiceId) ?? null
    );
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
    return (
      originalComponentContent.buckets
        .concat(originalComponentContent.choices)
        .find((obj) => obj.id === matchObj.id)?.value ?? matchObj.value
    );
  }

  private clearFeedback(): void {
    this.choices.forEach((choice) => {
      choice.isCorrect = null;
      choice.isIncorrectPosition = null;
      choice.feedback = null;
    });
  }

  /**
   * Returns true if the choice has been authored to have a correct position
   * @param {string} choiceId the choice id
   * @return {boolean} whether the choice has a correct position in any bucket
   */
  isAuthorHasSpecifiedACorrectPosition(choiceId: string): boolean {
    return this.componentContent.feedback.some((feedbackBucket) =>
      feedbackBucket.choices.some(
        (choice) => choice.choiceId === choiceId && choice.position != null
      )
    );
  }

  createMergedComponentState(componentStates: any[]): any[] {
    const mergedBuckets = [];
    for (const componentState of componentStates) {
      for (const bucket of componentState.studentData.buckets) {
        mergeBucket(mergedBuckets, bucket);
      }
    }
    const mergedComponentState: any = this.createNewComponentState();
    mergedComponentState.studentData = {
      buckets: mergedBuckets
    };
    return mergedComponentState;
  }

  protected addChoice(): void {
    this.dialog
      .open(AddMatchChoiceDialogComponent, {
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
