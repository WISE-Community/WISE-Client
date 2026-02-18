import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';
import { firstValueFrom } from 'rxjs';
import { ComponentState } from '../../../../../app/domain/componentState';
import { MatExpansionModule } from '@angular/material/expansion';

interface IdeaCount {
  id: string;
  text: string;
  count: number;
}

interface Response {
  text: string;
  timestamp: number;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [MatExpansionModule, MatIcon],
  selector: 'idea-summary',
  styleUrl: './idea-summary.component.scss',
  templateUrl: './idea-summary.component.html'
})
export class IdeaSummaryComponent extends TeacherSummaryDisplayComponent {
  @Input() componentId: string;
  @Input() idea: IdeaCount;
  @Input() nodeId: string;

  protected responses: Response[] = [];

  protected async toggleDetails(): Promise<void> {
    if (this.responses.length === 0) {
      const component = this.projectService.getComponent(this.nodeId, this.componentId);
      const states = await firstValueFrom(this.getLatestWork());
      if (component.type === 'DialogGuidance') {
        this.responses = this.getDGResponsesWithIdea(states, this.idea.id);
      } else if (component.type === 'OpenResponse') {
        this.responses = this.getORResponsesWithIdea(states, this.idea.id);
      }
      if (this.responses.length > 2) {
        this.responses = this.responses.slice(0, 2); // only show 2 responses max
      }
    }
  }

  private getDGResponsesWithIdea(states: ComponentState[], ideaId: string): Response[] {
    const responsesWithIdea: Response[] = [];
    const workgroupsProcessed = []; // ensure we only add one response per workgroup
    states.forEach((state) => {
      state.studentData.responses.forEach((response, index, responses) => {
        if (workgroupsProcessed.includes(state.workgroupId)) return;
        if (response?.ideas?.some((idea) => idea.detected && idea.name === ideaId)) {
          // computer responses contain ideas detected, but we want the actual student response
          // which is before the computer response
          responsesWithIdea.push(responses[index - 1]);
          workgroupsProcessed.push(state.workgroupId);
        }
      });
    });
    return responsesWithIdea;
  }

  private getORResponsesWithIdea(states: ComponentState[], ideaId: string): Response[] {
    const annotations = this.annotationService
      .getAnnotationsByNodeIdComponentId(this.nodeId, this.componentId)
      .filter((annotation) =>
        annotation.data.ideas?.some((idea) => idea.detected && idea.name === ideaId)
      );
    return states
      .filter((state) => annotations.some((annotation) => annotation.studentWorkId === state.id))
      .map((state) => ({
        text: state.studentData.response,
        timestamp: state.clientSaveTime
      }));
  }
}
