import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';
import { firstValueFrom } from 'rxjs';
import { ComponentState } from '../../../../../app/domain/componentState';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { IdeaSummaryDialogComponent } from '../idea-summary-dialog/idea-summary-dialog.component';

interface IdeaCategory {
  id: string;
  text: string;
  count: number;
  color: string;
}

interface Response {
  text: string;
  timestamp: number;
  usernames: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [MatExpansionModule, MatIcon],
  selector: 'idea-summary',
  styleUrl: './idea-summary.component.scss',
  templateUrl: './idea-summary.component.html'
})
export class IdeaSummaryComponent extends TeacherSummaryDisplayComponent {
  private dialog = inject(MatDialog);

  @Input() componentId: string;
  @Input() idea: IdeaCategory;
  @Input() nodeId: string;

  protected expanded: boolean = false;
  protected responses: Response[] = [];
  protected sampleResponses: Response[] = [];
  private workgroups: any[] = [];

  ngOnInit(): void {
    super.ngOnInit();
    this.workgroups = this.configService.getClassmateUserInfos();
  }

  protected renderDisplay(): void {
    super.renderDisplay();
    this.getResponses();
  }

  protected async toggleDetails(): Promise<void> {
    this.expanded = !this.expanded;
    if (this.expanded) {
      await this.getResponses();
    }
  }

  private async getResponses(): Promise<void> {
    const component = this.projectService.getComponent(this.nodeId, this.componentId);
    const states = await firstValueFrom(this.getLatestWork());
    if (component.type === 'DialogGuidance') {
      this.responses = this.getDGResponsesWithIdea(states, this.idea.id);
    } else if (component.type === 'OpenResponse') {
      this.responses = this.getORResponsesWithIdea(states, this.idea.id);
    }
    this.sampleResponses = this.responses.slice(0, 2); // only show 2 responses max
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
          const studentResponse = responses[index - 1];
          studentResponse.usernames = this.getDisplayNames(state.workgroupId);
          responsesWithIdea.push(studentResponse);
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
        timestamp: state.clientSaveTime,
        usernames: this.getDisplayNames(state.workgroupId)
      }));
  }

  private getDisplayNames(workgroupId: number): string {
    return this.workgroups.find((workgroup) => workgroup.workgroupId === workgroupId).displayNames;
  }

  protected showAllResponses(): void {
    this.dialog.open(IdeaSummaryDialogComponent, {
      data: {
        idea: this.idea,
        responses: this.responses
      },
      panelClass: ['app-styles', 'dialog-lg']
    });
  }
}
