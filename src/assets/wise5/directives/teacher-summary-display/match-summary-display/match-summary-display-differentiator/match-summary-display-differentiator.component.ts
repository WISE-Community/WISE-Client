import { Component, Input } from '@angular/core';
import { OrderedMatchSummaryDisplayComponent } from '../ordered-match-summary-display/ordered-match-summary-display.component';
import { UnorderedMatchSummaryDisplayComponent } from '../unordered-match-summary-display/unordered-match-summary-display.component';
import { CommonModule } from '@angular/common';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

@Component({
  selector: 'match-summary-display-differentiator',
  imports: [
    CommonModule,
    OrderedMatchSummaryDisplayComponent,
    UnorderedMatchSummaryDisplayComponent
  ],
  templateUrl: './match-summary-display-differentiator.component.html'
})
export class MatchSummaryDisplayDifferentiatorComponent {
  @Input() componentId: string;
  protected componentContent: any;
  protected isOrderedMatch: boolean;
  @Input() nodeId: string;
  @Input() periodId: number;

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.setComponentContent();
    this.setIsOrderedMatch();
  }

  private setComponentContent(): void {
    this.componentContent = this.projectService
      .getComponentsFromStep(this.nodeId)
      .find((component) => component.id === this.componentId);
  }

  private setIsOrderedMatch() {
    this.isOrderedMatch = this.componentContent.feedback.some((bucket) =>
      bucket.choices.some((choice) => choice.position !== null)
    );
  }
}
