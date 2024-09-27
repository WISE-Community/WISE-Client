import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  selector: 'grading-edit-component-max-score',
  standalone: true,
  styles: [
    `
      /* TODO(mdc-migration): The following rule targets internal classes of form-field that may no longer apply for the MDC version. */
      .mat-form-field-infix {
        width: inherit;
      }
    `
  ],
  templateUrl: 'grading-edit-component-max-score.component.html',
  encapsulation: ViewEncapsulation.None
})
export class GradingEditComponentMaxScoreComponent {
  @Input() componentId: string;
  @Input() disabled: boolean;
  maxScore: number;
  maxScoreChanged: Subject<string> = new Subject<string>();
  @Input() nodeId: string;
  private subscriptions: Subscription = new Subscription();

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.maxScore = this.projectService.getMaxScoreForComponent(this.nodeId, this.componentId) || 0;
    this.subscriptions.add(
      this.maxScoreChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.saveMaxScore();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  saveMaxScore(): void {
    const maxScore = Number(this.maxScore);
    if (maxScore >= 0) {
      this.projectService.getNode(this.nodeId).getComponent(this.componentId).maxScore = maxScore;
      this.projectService.saveProject();
      this.maxScore = this.maxScore || 0;
    }
  }
}
