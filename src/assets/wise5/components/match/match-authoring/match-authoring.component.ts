import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { generateRandomKey } from '../../../common/string/string';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatchService } from '../matchService';
import { MatDialog } from '@angular/material/dialog';
import { AssetChooser } from '../../../authoringTool/project-asset-authoring/asset-chooser';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'match-authoring',
  templateUrl: 'match-authoring.component.html',
  styleUrls: ['match-authoring.component.scss']
})
export class MatchAuthoring extends AbstractComponentAuthoring {
  defaultSourceBucketId: string = '0';
  feedbackChange: Subject<string> = new Subject<string>();

  constructor(
    protected configService: ConfigService,
    private dialog: MatDialog,
    private matchService: MatchService,
    protected nodeService: TeacherNodeService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, nodeService, projectAssetService, projectService);
    this.subscriptions.add(
      this.feedbackChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.turnOnSubmitButtonIfFeedbackExists();
        this.componentChanged();
      })
    );
  }

  turnOnSubmitButtonIfFeedbackExists() {
    if (this.componentHasFeedback()) {
      this.setShowSubmitButtonValue(true);
    }
  }

  addChoice(): void {
    const newChoice = {
      id: generateRandomKey(),
      value: ''
    };
    this.componentContent.choices.push(newChoice);
    this.addChoiceToFeedback(newChoice.id);
    this.componentChanged();
  }

  addBucket(): void {
    const newBucket = {
      id: generateRandomKey(),
      value: '',
      type: 'bucket'
    };
    this.componentContent.buckets.push(newBucket);
    this.addBucketToFeedback(newBucket.id);
    this.componentChanged();
  }

  moveChoiceUp(index: number): void {
    if (index != 0) {
      this.moveChoiceUpInChoices(index);
      this.moveChoiceUpInAllBucketFeedback(index);
      this.componentChanged();
    }
  }

  moveChoiceDown(index: number): void {
    if (index < this.componentContent.choices.length - 1) {
      this.moveChoiceDownInChoices(index);
      this.moveChoiceDownInAllBucketFeedback(index);
      this.componentChanged();
    }
  }

  moveChoiceUpInChoices(index: number) {
    this.moveChoiceInChoices(index, -1);
  }

  moveChoiceDownInChoices(index: number) {
    this.moveChoiceInChoices(index, 1);
  }

  moveChoiceInChoices(index: number, amountToShift: number) {
    const choice = this.componentContent.choices[index];
    this.componentContent.choices.splice(index, 1);
    this.componentContent.choices.splice(index + amountToShift, 0, choice);
  }

  moveChoiceUpInAllBucketFeedback(index: number) {
    this.moveChoiceInAllBucketFeedback(index, -1);
  }

  moveChoiceDownInAllBucketFeedback(index: number) {
    this.moveChoiceInAllBucketFeedback(index, 1);
  }

  moveChoiceInAllBucketFeedback(index: number, amountToShift: number) {
    const feedback = this.componentContent.feedback;
    for (const bucketFeedbackObj of feedback) {
      const bucketFeedbackChoices = bucketFeedbackObj.choices;
      const tempChoice = bucketFeedbackChoices[index];
      bucketFeedbackChoices.splice(index, 1);
      bucketFeedbackChoices.splice(index + amountToShift, 0, tempChoice);
    }
  }

  deleteChoice(index: number): void {
    if (confirm($localize`Are you sure you want to delete this choice?`)) {
      const deletedChoice = this.componentContent.choices.splice(index, 1);
      this.removeChoiceFromFeedback(deletedChoice[0].id);
      this.componentChanged();
    }
  }

  moveBucketUp(index: number): void {
    if (index > 0) {
      this.moveBucketUpInBuckets(index);
      this.moveBucketUpInBucketFeedback(index);
      this.componentChanged();
    }
  }

  moveBucketDown(index: number): void {
    if (index < this.componentContent.buckets.length - 1) {
      this.moveBucketDownInBuckets(index);
      this.moveBucketDownInBucketFeedback(index);
      this.componentChanged();
    }
  }

  moveBucketUpInBuckets(index: number) {
    this.moveBucketInBuckets(index, -1);
  }

  moveBucketDownInBuckets(index: number) {
    this.moveBucketInBuckets(index, 1);
  }

  moveBucketInBuckets(index: number, amountToShift: number) {
    const bucket = this.componentContent.buckets[index];
    this.componentContent.buckets.splice(index, 1);
    this.componentContent.buckets.splice(index + amountToShift, 0, bucket);
  }

  moveBucketUpInBucketFeedback(index: number) {
    this.moveBucketInBucketFeedback(index, -1);
  }

  moveBucketDownInBucketFeedback(index: number) {
    this.moveBucketInBucketFeedback(index, 1);
  }

  moveBucketInBucketFeedback(index: number, amountToShift: number) {
    // the bucket feedback index for authored buckets starts at 1 because the source bucket is at 0
    const bucketFeedbackIndex = index + 1;
    const bucketFeedbackObj = this.componentContent.feedback[bucketFeedbackIndex];
    this.componentContent.feedback.splice(bucketFeedbackIndex, 1);
    this.componentContent.feedback.splice(
      bucketFeedbackIndex + amountToShift,
      0,
      bucketFeedbackObj
    );
  }

  deleteBucket(index: number): void {
    if (confirm($localize`Are you sure you want to delete this bucket?`)) {
      const deletedBucket = this.componentContent.buckets.splice(index, 1);
      if (deletedBucket != null && deletedBucket.length > 0) {
        this.removeBucketFromFeedback(deletedBucket[0].id);
      }
      this.componentChanged();
    }
  }

  addChoiceToFeedback(choiceId: string): void {
    const feedback = this.componentContent.feedback;
    for (const bucketFeedback of feedback) {
      const feedbackText = '';
      const isCorrect = false;
      bucketFeedback.choices.push(this.createFeedbackObject(choiceId, feedbackText, isCorrect));
    }
  }

  addBucketToFeedback(bucketId: string): void {
    const feedback = this.componentContent.feedback;
    const bucket = {
      bucketId: bucketId,
      choices: []
    };
    const choices = this.componentContent.choices;
    for (const choice of choices) {
      const choiceId = choice.id;
      const feedbackText = '';
      const isCorrect = false;
      bucket.choices.push(this.createFeedbackObject(choiceId, feedbackText, isCorrect));
    }
    feedback.push(bucket);
  }

  createFeedbackObject(
    choiceId: string,
    feedback: string,
    isCorrect: boolean,
    position: number = null,
    incorrectPositionFeedback: string = null
  ): any {
    return {
      choiceId: choiceId,
      feedback: feedback,
      isCorrect: isCorrect,
      position: position,
      incorrectPositionFeedback: incorrectPositionFeedback
    };
  }

  removeChoiceFromFeedback(choiceId: string): void {
    for (const bucketFeedback of this.componentContent.feedback) {
      bucketFeedback.choices = bucketFeedback.choices.filter((choice) => {
        return choice.choiceId !== choiceId;
      });
    }
  }

  removeBucketFromFeedback(bucketId: string): void {
    const feedback = this.componentContent.feedback;
    for (let f = 0; f < feedback.length; f++) {
      const bucketFeedback = feedback[f];
      if (bucketFeedback != null) {
        if (bucketId === bucketFeedback.bucketId) {
          feedback.splice(f, 1);
          break;
        }
      }
    }
  }

  componentHasFeedback(): boolean {
    for (const feedback of this.componentContent.feedback) {
      for (const choice of feedback.choices) {
        if (choice.isCorrect || this.isNonEmpty(choice.feedback)) {
          return true;
        }
      }
    }
    return false;
  }

  isNonEmpty(str: string): boolean {
    return str != null && str != '';
  }

  isCorrectClicked(feedback: any): void {
    if (!feedback.isCorrect) {
      delete feedback.position;
      delete feedback.incorrectPositionFeedback;
    }
    this.turnOnSubmitButtonIfFeedbackExists();
    this.componentChanged();
  }

  processSelectedAsset(value: string): string {
    return `<img src="${value}" alt="${value}" />`;
  }

  getChoiceTextById(choiceId: string): string {
    const choice = this.matchService.getChoiceById(choiceId, this.componentContent.choices);
    return choice ? choice.value : null;
  }

  getBucketNameById(bucketId: string): string {
    if (bucketId === this.defaultSourceBucketId) {
      const choicesLabel = this.componentContent.choicesLabel;
      return choicesLabel ? choicesLabel : $localize`Choices`;
    }
    const bucket = this.matchService.getBucketById(bucketId, this.componentContent.buckets);
    return bucket ? bucket.value : null;
  }
}
