import { AddChoiceButtonComponent } from '../add-choice-button/add-choice-button.component';
import { Bucket } from '../../bucket';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentAnnotationsComponent } from '../../../../directives/componentAnnotations/component-annotations.component';
import { ComponentHeaderComponent } from '../../../../directives/component-header/component-header.component';
import { ComponentSaveSubmitButtonsComponent } from '../../../../directives/component-save-submit-buttons/component-save-submit-buttons.component';
import { ComponentState } from '../../../../../../app/domain/componentState';
import { Container } from '../container';
import { copy } from '../../../../common/object/object';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Item } from '../item';
import { MatchCdkDragDrop } from '../MatchCdkDragDrop';
import { MatchChoiceItemComponent } from '../../match-choice-item/match-choice-item.component';
import { MatchFeedbackSectionComponent } from '../match-feedback-section/match-feedback-section.component';
import { MatchStudentDefaultComponent } from '../match-student-default/match-student-default.component';
import { moveItem } from '../move-item';

@Component({
  imports: [
    AddChoiceButtonComponent,
    CommonModule,
    ComponentAnnotationsComponent,
    ComponentHeaderComponent,
    ComponentSaveSubmitButtonsComponent,
    DragDropModule,
    MatchChoiceItemComponent,
    MatchFeedbackSectionComponent
  ],
  styleUrl: '../match-student-default/match-student-default.component.scss',
  templateUrl: '../match-student-default/match-student-default.component.html'
})
export class MatchStudentChoiceReuseComponent extends MatchStudentDefaultComponent {
  protected drop(event: MatchCdkDragDrop<Container, Item>): void {
    moveItem(event);
    event.container.element.nativeElement.classList.remove('primary-bg');
    this.studentDataChanged();
  }

  protected addAuthoredChoiceToBucket(choiceId: string, bucket: Bucket): void {
    bucket.items.push(copy(this.choices.find((choice) => choice.id === choiceId)));
  }

  protected getUpdatedChoicesSinceLastSubmit(latestSubmitComponentState: ComponentState): string[] {
    const previousBuckets = latestSubmitComponentState.studentData.buckets;
    const removedChoices = this.getNonSourceBuckets().flatMap((bucket: Bucket) => {
      const { currentBucketChoiceIds, previousBucketChoiceIds } =
        this.getPreviousAndCurrentChoiceIds(previousBuckets, bucket);
      return previousBucketChoiceIds.filter(
        (choiceId: string) => !currentBucketChoiceIds.includes(choiceId)
      );
    });
    return super
      .getUpdatedChoicesSinceLastSubmit(latestSubmitComponentState)
      .concat(removedChoices);
  }

  protected checkAnswer(
    choiceIdsExcludedFromFeedback: string[] = [],
    buckets: Bucket[] = this.getNonSourceBuckets()
  ): void {
    super.checkAnswer(choiceIdsExcludedFromFeedback, buckets);
  }

  private getNonSourceBuckets(): Bucket[] {
    return this.buckets.filter((bucket: Bucket) => bucket.id !== this.sourceBucketId);
  }
}
