import { Component } from '@angular/core';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { MatchService } from '../matchService';
import { MatchFeedbackSectionComponent } from '../match-student/match-feedback-section/match-feedback-section.component';
import { CommonModule } from '@angular/common';
import { MatchChoiceItemComponent } from '../match-choice-item/match-choice-item.component';

@Component({
  imports: [CommonModule, MatchChoiceItemComponent, MatchFeedbackSectionComponent],
  selector: 'match-show-work',
  styleUrls: [
    '../match-student/match-student-default/match-student-default.component.scss',
    'match-show-work.component.scss'
  ],
  templateUrl: 'match-show-work.component.html'
})
export class MatchShowWorkComponent extends ComponentShowWorkDirective {
  protected hasCorrectAnswer: boolean;
  protected sourceBucket: any;
  private sourceBucketId = '0';
  protected targetBuckets: any[] = [];

  constructor(
    protected matchService: MatchService,
    protected nodeService: NodeService,
    protected projectService: ProjectService
  ) {
    super(nodeService, projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.hasCorrectAnswer = this.matchService.componentHasCorrectAnswer(this.componentContent);
    this.initializeBuckets(this.componentState.studentData.buckets);
  }

  private initializeBuckets(buckets: any[]): void {
    buckets.forEach((bucket) => {
      this.setItemStatuses(bucket.items);
      if (bucket.id === this.sourceBucketId) {
        this.sourceBucket = bucket;
      } else {
        this.targetBuckets.push(bucket);
      }
    });
  }

  private setItemStatuses(items: any[]): void {
    items.forEach((item) => this.matchService.setItemStatus(item, this.hasCorrectAnswer));
  }
}
