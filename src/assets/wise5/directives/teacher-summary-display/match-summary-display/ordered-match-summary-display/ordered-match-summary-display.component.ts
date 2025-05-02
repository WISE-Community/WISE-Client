import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatchSummaryDataPoint } from '../../summary-data/MatchSummaryDataPoint';
import { MatchSummaryDisplayComponent } from '../match-summary-display.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ordered-match-summary-display',
  imports: [CommonModule, MatIconModule],
  templateUrl: '../match-summary-display.component.html',
  styleUrl: '../match-summary-display.component.scss'
})
export class OrderedMatchSummaryDisplayComponent extends MatchSummaryDisplayComponent {
  @Input() private componentContent: any;
  private correctOrder?: OrderedBucket[];
  private bucketsIdToValue?: Map<string, string>;
  private choicesIdToValue?: Map<string, string>;

  ngOnInit(): void {
    this.componentContent = this.projectService
      .getComponentsFromStep(this.nodeId)
      .find((component) => component.id === this.componentId);
    this.componentContent.feedback.forEach((bucket) => {
      this.addBucketToCorrectOrder(bucket);
    });

    this.bucketsIdToValue = new Map<string, string>();
    this.componentContent.buckets.forEach((bucket) =>
      this.bucketsIdToValue.set(bucket.id, bucket.value)
    );

    this.choicesIdToValue = new Map<string, string>();
    this.componentContent.choices.forEach((choice) =>
      this.choicesIdToValue.set(choice.id, choice.value)
    );
    this.setChoiceOrders();
  }

  private addBucketToCorrectOrder(bucket: any) {
    const orderedBucket = new OrderedBucket(bucket.id);
    bucket.choices.forEach((choice) =>
      orderedBucket.addChoice(new OrderedChoice(choice.choiceId, choice.position))
    );
    this.correctOrder.push(orderedBucket);
  }

  private setChoiceOrders(): void {
    this.matchSummaryData.getDataPoints().forEach((dataPoint: MatchSummaryDataPoint) => {
      const choice: OrderedChoice = this.correctOrder
        .find((bucket) => this.bucketsIdToValue.get(bucket.bucketId) === dataPoint.getBucketValue())
        .choices.find((choice) => this.choicesIdToValue.get(choice.choiceId) === dataPoint.getId());
      dataPoint.setPosition(choice.position);
    });
  }

  protected sortChoices(choiceA: MatchSummaryDataPoint, choiceB: MatchSummaryDataPoint): number {
    return choiceB.getPosition() - choiceA.getPosition();
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
