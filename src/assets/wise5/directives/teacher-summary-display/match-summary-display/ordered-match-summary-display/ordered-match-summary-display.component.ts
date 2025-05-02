import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatchSummaryDataPoint } from '../../summary-data/MatchSummaryDataPoint';
import { MatchSummaryDisplayComponent } from '../match-summary-display.component';
import { MatIconModule } from '@angular/material/icon';
import { MatchSummaryData } from '../../summary-data/MatchSummaryData';

@Component({
  selector: 'ordered-match-summary-display',
  imports: [CommonModule, MatIconModule],
  templateUrl: '../match-summary-display.component.html',
  styleUrl: '../match-summary-display.component.scss'
})
export class OrderedMatchSummaryDisplayComponent extends MatchSummaryDisplayComponent {
  @Input() private componentContent: any;
  private correctOrder: OrderedBucket[] = [];
  private bucketsIdToValue: Map<string, string>;
  private choicesIdToValue: Map<string, string>;
  private bucketCorrectness: Map<string, [number, number]> = new Map<string, [number, number]>();

  ngOnInit(): void {
    this.getLatestWork().subscribe((componentStates) => {
      this.matchSummaryData = new MatchSummaryData(componentStates);
      this.setBucketValues();
      this.setBucketShowMore();
      this.componentContent.feedback.forEach((bucket) => {
        this.addBucketToCorrectOrder(bucket);
      });
      this.bucketsIdToValue = this.populateMapWithChoicesOrBuckets(this.componentContent.buckets);
      this.choicesIdToValue = this.populateMapWithChoicesOrBuckets(this.componentContent.choices);
      this.setChoiceOrders();
      this.setBucketCorrectness();
    });
  }

  private setBucketCorrectness(): void {
    this.getLatestWork().subscribe((componentStates) => {
      componentStates.forEach((componentState) =>
        componentState.studentData.buckets.forEach((bucket) => {
          const bucketCorrectAndIncorrect: [number, number] = this.bucketCorrectness.get(
            bucket.value
          );
          const newBucketCorrectAndIncorrect = this.updateBucketCorrectAndIncorrect(
            bucketCorrectAndIncorrect,
            bucket.items
          );
          this.bucketCorrectness.set(bucket.value, newBucketCorrectAndIncorrect);
        })
      );
    });
  }

  private updateBucketCorrectAndIncorrect(
    old: [number, number],
    bucketItems: any[]
  ): [number, number] {
    const isCorrect = !bucketItems.some((item) => !item.isCorrect);
    const correctnessChange: [number, number] = [isCorrect ? 1 : 0, isCorrect ? 0 : 1];
    if (old) {
      return [old[0] + correctnessChange[0], old[1] + correctnessChange[1]];
    } else {
      return correctnessChange;
    }
  }

  private addBucketToCorrectOrder(bucket: any) {
    const orderedBucket = new OrderedBucket(bucket.bucketId);
    bucket.choices.forEach((choice) =>
      orderedBucket.addChoice(new OrderedChoice(choice.choiceId, choice.position))
    );
    this.correctOrder.push(orderedBucket);
  }

  private populateMapWithChoicesOrBuckets(data: any): Map<string, string> {
    const map = new Map<string, string>();
    data.forEach((item) => map.set(item.id, item.value));
    return map;
  }

  private setChoiceOrders(): void {
    this.matchSummaryData.getDataPoints().forEach((dataPoint: MatchSummaryDataPoint) => {
      const bucket: OrderedBucket = this.correctOrder.find(
        (bucket) => this.bucketsIdToValue.get(bucket.bucketId) === dataPoint.getBucketValue()
      );
      if (bucket) {
        const choice: OrderedChoice = bucket.choices.find(
          (choice) => this.choicesIdToValue.get(choice.choiceId) === dataPoint.getId()
        );
        dataPoint.setPosition(choice.position);
      } else {
        dataPoint.setPosition(-1);
      }
    });
  }

  protected showBucket(bucketValue: string): boolean {
    // return true if bucket has a correct order
    const bucket = this.componentContent.feedback.find((bucketFeedback) =>
      [this.bucketsIdToValue.get(bucketFeedback.bucketId), 'Choices'].includes(bucketValue)
    );
    return bucket.choices.some((choice) => ![null, undefined].includes(choice.position));
  }

  protected getBucketCorrectOrderStats(bucketValue: string): string {
    const bucketStats = this.bucketCorrectness.get(bucketValue);
    return bucketStats
      ? `${bucketStats[0]}/${bucketStats[0] + bucketStats[1]} students ordered all choices correctly`
      : '';
  }

  protected sortChoices(choiceA: MatchSummaryDataPoint, choiceB: MatchSummaryDataPoint): number {
    return choiceA.getPosition() - choiceB.getPosition();
  }

  protected getCorrectOrder(): OrderedBucket[] {
    return this.correctOrder;
  }
}

class OrderedBucket {
  bucketId: string;
  choices: OrderedChoice[];

  constructor(bucketId: string, choices: OrderedChoice[] = []) {
    this.bucketId = bucketId;
    this.choices = choices;
  }

  addChoice(choice: OrderedChoice) {
    this.choices.push(choice);
  }
}

class OrderedChoice {
  choiceId: string;
  position: number;

  constructor(choiceId: string, position: number) {
    this.choiceId = choiceId;
    this.position = position;
  }
}
