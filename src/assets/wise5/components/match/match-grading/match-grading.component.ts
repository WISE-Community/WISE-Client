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

  constructor(protected matchService: MatchService, protected projectService: ProjectService) {
    super(projectService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initializeBuckets(this.componentState.studentData.buckets);
    this.hasCorrectAnswer = this.hasCorrectChoices(this.componentContent);
    this.isCorrect = this.componentState.studentData.isCorrect;
    this.isChoicesAfter = this.componentContent.choicesAfter;
    this.isHorizontal = this.componentContent.horizontal;
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

  hasCorrectChoices(componentContent: any): boolean {
    for (const bucket of componentContent.feedback) {
      for (const choice of bucket.choices) {
        if (choice.isCorrect) {
          return true;
        }
      }
    }
    return false;
  }

  setItemStatuses(items: any[]): void {
    for (const item of items) {
      this.matchService.setItemStatus(item);
    }
  }
}
