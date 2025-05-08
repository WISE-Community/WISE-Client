import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OrderedMatchSummaryDisplayComponent } from '../ordered-match-summary-display/ordered-match-summary-display.component';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { UnorderedMatchSummaryDisplayComponent } from '../unordered-match-summary-display/unordered-match-summary-display.component';

@Component({
  imports: [
    CommonModule,
    OrderedMatchSummaryDisplayComponent,
    UnorderedMatchSummaryDisplayComponent
  ],
  selector: 'match-summary-display-differentiator',
  templateUrl: './match-summary-display-differentiator.component.html'
})
export class MatchSummaryDisplayDifferentiatorComponent {
  protected componentContent: any;
  @Input() componentId: string;
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

  private setIsOrderedMatch(): void {
    this.isOrderedMatch = this.componentContent.feedback.some((bucket) =>
      bucket.choices.some((choice) => choice.position)
    );
  }
}
