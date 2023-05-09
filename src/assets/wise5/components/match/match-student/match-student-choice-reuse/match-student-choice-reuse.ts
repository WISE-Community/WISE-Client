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
    const choicesThatChanged = super.getChoicesThatChangedSinceLastSubmit(
      latestSubmitComponentState
    );
    const previousBuckets = latestSubmitComponentState.studentData.buckets;
    for (const currentBucket of this.getNonSourceBuckets()) {
      const {
        currentBucketChoiceIds,
        previousBucketChoiceIds
      } = this.getPreviousAndCurrentChoiceIds(previousBuckets, currentBucket);
      const choicesThatWereRemoved = previousBucketChoiceIds.filter(
        (choiceId: string) => !currentBucketChoiceIds.includes(choiceId)
      );
      choicesThatChanged.push(...choicesThatWereRemoved);
    }
    return choicesThatChanged;
  }

  protected checkAnswer(choiceIdsExcludedFromFeedback: string[] = []): void {
    this.checkAnswerHelper(this.getNonSourceBuckets(), choiceIdsExcludedFromFeedback);
  }

  private getNonSourceBuckets(): any[] {
    return this.buckets.filter((bucket: any) => bucket.id !== this.sourceBucketId);
  }
}
