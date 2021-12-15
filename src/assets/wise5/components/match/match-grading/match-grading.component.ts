import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentGrading } from '../../../classroomMonitor/classroomMonitorComponents/shared/component-grading.component';
import { ProjectService } from '../../../services/projectService';
import { MatchService } from '../matchService';

@Component({
  selector: 'match-grading',
  templateUrl: 'match-grading.component.html',
  styleUrls: ['../match-student/match-student.component.scss', 'match-grading.component.scss']
})
export class MatchGrading extends ComponentGrading {
  sourceBucketId = '0';
  sourceBucket: any;
  targetBuckets: any[] = [];
  isHorizontal: boolean = false;
  isChoicesAfter: boolean = false;
  bucketWidth: number;
  hasCorrectAnswer: boolean = false;
  isCorrect: boolean = false;
  submitCounter: number;
  isLatestComponentStateSubmit: boolean;

  constructor(protected matchService: MatchService, protected projectService: ProjectService) {
    super(projectService);
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
