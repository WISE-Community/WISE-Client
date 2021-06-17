import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';

@Component({
  selector: 'grading-edit-component-max-score',
  styles: ['.mat-form-field-infix { width: inherit; }'],
  templateUrl: 'grading-edit-component-max-score.component.html',
  encapsulation: ViewEncapsulation.None
})
export class GradingEditComponentMaxScoreComponent {
  @Input()
  componentId: string;

  @Input()
  disabled: boolean;

  maxScore: number;

  maxScoreChanged: Subject<string> = new Subject<string>();

  @Input()
  nodeId: string;

  subscriptions: Subscription = new Subscription();

  constructor(private ProjectService: TeacherProjectService, private UtilService: UtilService) {}

  ngOnInit() {
    this.maxScore = this.ProjectService.getMaxScoreForComponent(this.nodeId, this.componentId) || 0;
    this.subscriptions.add(
      this.maxScoreChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.saveMaxScore();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  saveMaxScore() {
    if (this.maxScore >= 0) {
      const maxScore = this.UtilService.convertStringToNumber(this.maxScore);
      this.ProjectService.setMaxScoreForComponent(this.nodeId, this.componentId, maxScore);
      this.ProjectService.saveProject();
      this.maxScore = this.maxScore || 0;
    }
  }
}
