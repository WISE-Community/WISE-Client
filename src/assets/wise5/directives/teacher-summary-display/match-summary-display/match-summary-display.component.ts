import { AnnotationService } from '../../../services/annotationService';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentContent } from '../../../common/ComponentContent';
import { ConfigService } from '../../../services/configService';
import { MatchSummaryData } from '../summary-data/MatchSummaryData';
import { MatchSummaryDataPoint } from '../summary-data/MatchSummaryDataPoint';
import { MatIconModule } from '@angular/material/icon';
import { SummaryDataPoint } from '../../summary-display/summary-data/SummaryDataPoint';
import { SummaryService } from '../../../components/summary/summaryService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';

@Component({
  imports: [CommonModule, MatIconModule],
  selector: 'match-summary-display',
  styleUrl: './match-summary-display.component.scss',
  templateUrl: './match-summary-display.component.html'
})
export class MatchSummaryDisplayComponent extends TeacherSummaryDisplayComponent {
  protected bucketsShowMore: Map<string, boolean> = new Map<string, boolean>();
  private bucketValues: Set<string> = new Set<string>();
  protected isOrderedMatch: boolean;
  protected matchSummaryData: MatchSummaryData;
  private componentContent: any;
  private correctOrder?: OrderedBucket[];
  private bucketsIdToValue?: Map<string, string>;
  private choicesIdToValue?: Map<string, string>;

  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    protected dataService: TeacherDataService,
    protected projectService: TeacherProjectService,
    protected summaryService: SummaryService
  ) {
    super(annotationService, configService, dataService, projectService, summaryService);
  }

  ngOnInit(): void {
    this.getLatestWork().subscribe((componentStates) => {
      this.matchSummaryData = new MatchSummaryData(componentStates);
      this.setBucketValues();
      this.setBucketShowMore();
      this.isOrderedMatch = this.matchSummaryData.getIsOrderedMatch();

      if (this.isOrderedMatch) {
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
    });
  }

  private setChoiceOrders(): void {
    this.matchSummaryData.getDataPoints().forEach((dataPoint: MatchSummaryDataPoint) => {
      const choice: OrderedChoice = this.correctOrder
        .find((bucket) => this.bucketsIdToValue.get(bucket.bucketId) === dataPoint.getBucketValue())
        .choices.find((choice) => this.choicesIdToValue.get(choice.choiceId) === dataPoint.getId());
      dataPoint.setPosition(choice.position);
    });
  }

  private setBucketValues(): void {
    this.matchSummaryData
      .getDataPoints()
      .map(this.asMatchSummaryDataPoint)
      .forEach((data) => {
        this.bucketValues.add(data.getBucketValue());
      });
  }

  protected getBucketData(): {
    value: string;
    choices: MatchSummaryDataPoint[];
  }[] {
    const buckets: { value: string; choices: MatchSummaryDataPoint[] }[] = [];
    this.bucketValues.forEach((bucketValue) =>
      buckets.push({
        value: bucketValue,
        choices: this.getBucketDataByValue(bucketValue)
      })
    );
    return buckets;
  }

  private getBucketDataByValue(bucketValue: string): MatchSummaryDataPoint[] {
    return this.matchSummaryData
      .getDataPoints()
      .map(this.asMatchSummaryDataPoint)
      .filter((choice) => choice.getBucketValue() === bucketValue)
      .sort((a, b) =>
        this.isOrderedMatch ? b.getPosition() - a.getPosition() : b.getCount() - a.getCount()
      );
  }

  private setBucketShowMore(): void {
    this.bucketValues.forEach((value) => this.bucketsShowMore.set(value, false));
  }

  protected getBucketShowMore(bucketValue: string): boolean {
    return this.bucketsShowMore.get(bucketValue);
  }

  protected toggleBucketShowMore(bucketValue: string): void {
    this.bucketsShowMore.set(bucketValue, !this.bucketsShowMore.get(bucketValue));
  }

  private asMatchSummaryDataPoint(dataPoint: SummaryDataPoint): MatchSummaryDataPoint {
    return dataPoint as MatchSummaryDataPoint;
  }

  private addBucketToCorrectOrder(bucket: any) {
    const orderedBucket = new OrderedBucket(bucket.id);
    bucket.choices.forEach((choice) =>
      orderedBucket.addChoice(new OrderedChoice(choice.choiceId, choice.position))
    );
    this.correctOrder.push(orderedBucket);
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
