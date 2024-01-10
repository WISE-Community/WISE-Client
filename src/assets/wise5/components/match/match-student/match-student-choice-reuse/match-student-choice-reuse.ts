import { Component } from '@angular/core';
import { MatchStudentDefault } from '../match-student-default/match-student-default.component';
import { moveItem } from '../move-item';
import { MatchCdkDragDrop } from '../MatchCdkDragDrop';
import { Container } from '../container';
import { Item } from '../item';
import { copy } from '../../../../common/object/object';

@Component({
  styleUrls: ['../match-student-default/match-student-default.component.scss'],
  templateUrl: '../match-student-default/match-student-default.component.html'
})
export class MatchStudentChoiceReuse extends MatchStudentDefault {
  protected drop(event: MatchCdkDragDrop<Container, Item>): void {
    moveItem(event);
    event.container.element.nativeElement.classList.remove('primary-bg');
    this.studentDataChanged();
  }

  protected addAuthoredChoiceToBucket(choiceId: string, bucket: any): void {
    bucket.items.push(copy(this.matchService.getChoiceById(choiceId, this.choices)));
  }

  protected getChoicesThatChangedSinceLastSubmit(latestSubmitComponentState: any): string[] {
    const previousBuckets = latestSubmitComponentState.studentData.buckets;
    const removedChoices = this.getNonSourceBuckets().flatMap((bucket: any) => {
      const {
        currentBucketChoiceIds,
        previousBucketChoiceIds
      } = this.getPreviousAndCurrentChoiceIds(previousBuckets, bucket);
      return previousBucketChoiceIds.filter(
        (choiceId: string) => !currentBucketChoiceIds.includes(choiceId)
      );
    });
    return super
      .getChoicesThatChangedSinceLastSubmit(latestSubmitComponentState)
      .concat(removedChoices);
  }

  protected checkAnswer(
    choiceIdsExcludedFromFeedback: string[] = [],
    buckets: any[] = this.getNonSourceBuckets()
  ): void {
    super.checkAnswer(choiceIdsExcludedFromFeedback, buckets);
  }

  private getNonSourceBuckets(): any[] {
    return this.buckets.filter((bucket: any) => bucket.id !== this.sourceBucketId);
  }
}
