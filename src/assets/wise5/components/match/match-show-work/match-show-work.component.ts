import { Component } from '@angular/core';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { MatchService } from '../matchService';

@Component({
  selector: 'match-show-work',
  templateUrl: 'match-show-work.component.html',
  styleUrls: ['../match-student/match-student.component.scss', 'match-show-work.component.scss']
})
export class MatchShowWorkComponent extends ComponentShowWorkDirective {
  sourceBucketId = '0';
  sourceBucket: any;
  targetBuckets: any[] = [];
  isHorizontal: boolean;
  isChoicesAfter: boolean;
  bucketWidth: number;
  hasCorrectAnswer: boolean;
  isCorrect: boolean;
  submitCounter: number;
  isLatestComponentStateSubmit: boolean;

  constructor(
    protected matchService: MatchService,
    protected nodeService: NodeService,
    protected projectService: ProjectService
  ) {
    super(nodeService, projectService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.hasCorrectAnswer = this.matchService.hasCorrectChoices(this.componentContent);
    this.isCorrect = this.componentState.studentData.isCorrect;
    this.isChoicesAfter = this.componentContent.choicesAfter;
    this.isHorizontal = this.componentContent.horizontal;
    this.submitCounter = this.componentState.studentData.submitCounter;
    this.isLatestComponentStateSubmit = this.componentState.isSubmit;
    this.initializeBuckets(this.componentState.studentData.buckets);
  }

  initializeBuckets(buckets: any[]): void {
    for (const bucket of buckets) {
      this.setItemStatuses(bucket.items);
      if (bucket.id === this.sourceBucketId) {
        this.sourceBucket = bucket;
      } else {
        this.targetBuckets.push(bucket);
      }
    }
  }

  setItemStatuses(items: any[]): void {
    for (const item of items) {
      this.matchService.setItemStatus(item, this.hasCorrectAnswer);
    }
  }
}
