import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { Component } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { FormsModule } from '@angular/forms';
import { generateRandomKey } from '../../../common/string/string';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { TranslatableAssetChooserComponent } from '../../../authoringTool/components/translatable-asset-chooser/translatable-asset-chooser.component';
import { TranslatableInputComponent } from '../../../authoringTool/components/translatable-input/translatable-input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [
    EditComponentPrompt,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    TranslatableAssetChooserComponent,
    TranslatableInputComponent
  ],
  styleUrl: 'match-authoring.component.scss',
  templateUrl: 'match-authoring.component.html'
})
export class MatchAuthoringComponent extends AbstractComponentAuthoring {
  private defaultSourceBucketId: string = '0';
  protected feedbackChange: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    super.ngOnInit();
    this.subscriptions.add(
      this.feedbackChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.turnOnSubmitButtonIfFeedbackExists();
        this.componentChanged();
      })
    );
  }

  private turnOnSubmitButtonIfFeedbackExists() {
    if (this.componentHasFeedback()) {
      this.setShowSubmitButtonValue(true);
    }
  }

  protected addChoice(): void {
    const newChoice = {
      id: generateRandomKey(),
      value: ''
    };
    this.componentContent.choices.push(newChoice);
    this.addChoiceToFeedback(newChoice.id);
    this.componentChanged();
  }

  protected addBucket(): void {
    const newBucket = {
      id: generateRandomKey(),
      value: '',
      type: 'bucket'
    };
    this.componentContent.buckets.push(newBucket);
    this.addBucketToFeedback(newBucket.id);
    this.componentChanged();
  }

  protected moveChoiceUp(index: number): void {
    if (index != 0) {
      this.moveChoiceUpInChoices(index);
      this.moveChoiceUpInAllBucketFeedback(index);
      this.componentChanged();
    }
  }

  protected moveChoiceDown(index: number): void {
    if (index < this.componentContent.choices.length - 1) {
      this.moveChoiceDownInChoices(index);
      this.moveChoiceDownInAllBucketFeedback(index);
      this.componentChanged();
    }
  }

  private moveChoiceUpInChoices(index: number) {
    this.moveChoiceInChoices(index, -1);
  }

  private moveChoiceDownInChoices(index: number) {
    this.moveChoiceInChoices(index, 1);
  }

  private moveChoiceInChoices(index: number, amountToShift: number) {
    const choice = this.componentContent.choices[index];
    this.componentContent.choices.splice(index, 1);
    this.componentContent.choices.splice(index + amountToShift, 0, choice);
  }

  private moveChoiceUpInAllBucketFeedback(index: number) {
    this.moveChoiceInAllBucketFeedback(index, -1);
  }

  private moveChoiceDownInAllBucketFeedback(index: number) {
    this.moveChoiceInAllBucketFeedback(index, 1);
  }

  private moveChoiceInAllBucketFeedback(index: number, amountToShift: number) {
    const feedback = this.componentContent.feedback;
    for (const bucketFeedbackObj of feedback) {
      const bucketFeedbackChoices = bucketFeedbackObj.choices;
      const tempChoice = bucketFeedbackChoices[index];
      bucketFeedbackChoices.splice(index, 1);
      bucketFeedbackChoices.splice(index + amountToShift, 0, tempChoice);
    }
  }

  protected deleteChoice(index: number): void {
    if (confirm($localize`Are you sure you want to delete this choice?`)) {
      const deletedChoice = this.componentContent.choices.splice(index, 1);
      this.removeChoiceFromFeedback(deletedChoice[0].id);
      this.componentChanged();
    }
  }

  protected moveBucketUp(index: number): void {
    if (index > 0) {
      this.moveBucketUpInBuckets(index);
      this.moveBucketUpInBucketFeedback(index);
      this.componentChanged();
    }
  }

  protected moveBucketDown(index: number): void {
    if (index < this.componentContent.buckets.length - 1) {
      this.moveBucketDownInBuckets(index);
      this.moveBucketDownInBucketFeedback(index);
      this.componentChanged();
    }
  }

  private moveBucketUpInBuckets(index: number) {
    this.moveBucketInBuckets(index, -1);
  }

  private moveBucketDownInBuckets(index: number) {
    this.moveBucketInBuckets(index, 1);
  }

  private moveBucketInBuckets(index: number, amountToShift: number) {
    const bucket = this.componentContent.buckets[index];
    this.componentContent.buckets.splice(index, 1);
    this.componentContent.buckets.splice(index + amountToShift, 0, bucket);
  }

  private moveBucketUpInBucketFeedback(index: number) {
    this.moveBucketInBucketFeedback(index, -1);
  }

  private moveBucketDownInBucketFeedback(index: number) {
    this.moveBucketInBucketFeedback(index, 1);
  }

  private moveBucketInBucketFeedback(index: number, amountToShift: number) {
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

  protected deleteBucket(index: number): void {
    if (confirm($localize`Are you sure you want to delete this bucket?`)) {
      const deletedBucket = this.componentContent.buckets.splice(index, 1);
      if (deletedBucket != null && deletedBucket.length > 0) {
        this.removeBucketFromFeedback(deletedBucket[0].id);
      }
      this.componentChanged();
    }
  }

  private addChoiceToFeedback(choiceId: string): void {
    const feedback = this.componentContent.feedback;
    for (const bucketFeedback of feedback) {
      const feedbackText = '';
      const isCorrect = false;
      bucketFeedback.choices.push(this.createFeedbackObject(choiceId, feedbackText, isCorrect));
    }
  }

  private addBucketToFeedback(bucketId: string): void {
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

  private createFeedbackObject(
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

  private removeChoiceFromFeedback(choiceId: string): void {
    for (const bucketFeedback of this.componentContent.feedback) {
      bucketFeedback.choices = bucketFeedback.choices.filter((choice) => {
        return choice.choiceId !== choiceId;
      });
    }
  }

  private removeBucketFromFeedback(bucketId: string): void {
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

  private componentHasFeedback(): boolean {
    for (const feedback of this.componentContent.feedback) {
      for (const choice of feedback.choices) {
        if (choice.isCorrect || this.isNonEmpty(choice.feedback)) {
          return true;
        }
      }
    }
    return false;
  }

  private isNonEmpty(str: string): boolean {
    return str != null && str != '';
  }

  protected isCorrectClicked(feedback: any): void {
    if (!feedback.isCorrect) {
      delete feedback.position;
      delete feedback.incorrectPositionFeedback;
    }
    this.turnOnSubmitButtonIfFeedbackExists();
    this.componentChanged();
  }

  protected processSelectedAsset(value: string): string {
    return `<img src="${value}" alt="${value}" />`;
  }

  protected getChoiceTextById(choiceId: string): string {
    const choice = this.componentContent.choices.find((choice) => choice.id === choiceId);
    return choice ? choice.value : null;
  }

  protected getBucketNameById(bucketId: string): string {
    if (bucketId === this.defaultSourceBucketId) {
      const choicesLabel = this.componentContent.choicesLabel;
      return choicesLabel ? choicesLabel : $localize`Choices`;
    }
    const bucket = this.componentContent.buckets.find((bucket) => bucket.id === bucketId);
    return bucket ? bucket.value : null;
  }
}
