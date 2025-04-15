import { AnnotationService } from '../../services/annotationService';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentState } from '../../../../app/domain/componentState';
import { ConfigService } from '../../services/configService';
import { CRaterIdea } from '../../components/common/cRater/CRaterIdea';
import { CRaterRubric } from '../../components/common/cRater/CRaterRubric';
import { CRaterService } from '../../services/cRaterService';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SummaryService } from '../../components/summary/summaryService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherSummaryDisplayComponent } from './teacher-summary-display.component';

@Component({
  imports: [CommonModule, MatCardModule, MatIconModule],
  selector: 'dialog-guidance-teacher-summary-display',
  styles: `
    h3 {
      margin-bottom: 8px;
    }

    .idea {
      @apply px-2 py-1 rounded-md bg-gray-100 my-1 text-sm;
    }

    .mat-icon {
      vertical-align: middle;
    }
  `,
  templateUrl: 'dialog-guidance-teacher-summary-display.component.html'
})
export class DialogGuidanceTeacherSummaryDisplayComponent extends TeacherSummaryDisplayComponent {
  protected allIdeas: { id: string; text: string; count: number }[] = [];
  protected ideaCountMap: Map<string, Set<number>> = new Map<string, Set<number>>();
  protected leastCommonIdeas: { id: string; text: string; count: number }[] = [];
  protected mostCommonIdeas: { id: string; text: string; count: number }[] = [];
  private rubric: CRaterRubric;
  protected seeAllIdeas: boolean;

  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    private cRaterService: CRaterService,
    protected dataService: TeacherDataService,
    protected projectService: TeacherProjectService,
    protected summaryService: SummaryService
  ) {
    super(annotationService, configService, dataService, projectService, summaryService);
  }

  ngOnInit(): void {
    this.rubric = this.cRaterService.getCRaterRubric(this.nodeId, this.componentId);
    this.getLatestWork().subscribe((componentStates) => {
      this.extractIdeas(componentStates);
      this.allIdeas = this.getAllIdeas();
      if (!this.allIdeas.some((idea) => this.ideaCountMap.get(idea.id)?.size > 0)) {
        this.doRender = false;
      } else {
        const sortedIdeas = this.sortIdeas();
        this.mostCommonIdeas = [...sortedIdeas].splice(0, 3);
        this.leastCommonIdeas = [...sortedIdeas]
          .splice(sortedIdeas.length - 3, sortedIdeas.length)
          .reverse();
      }
    });
  }

  private getAllIdeas(): { id: string; text: string; count: number }[] {
    return this.rubric.ideas.map((idea) => ({
      id: idea.name,
      text: this.useIdeaTextOrId(idea.name, idea.text),
      count: this.ideaCountMap.get(idea.name)?.size ?? 0
    }));
  }

  private useIdeaTextOrId(id: string, text: string): string {
    return text ?? 'idea ' + id;
  }

  private extractIdeas(componentStates: ComponentState[]): void {
    componentStates.forEach((componentState) =>
      this.getDetectedIdeas(componentState).forEach((idea) => {
        if (this.ideaCountMap.has(idea.name)) {
          this.ideaCountMap.get(idea.name).add(componentState.workgroupId);
        } else {
          this.ideaCountMap.set(idea.name, new Set([componentState.workgroupId]));
        }
      })
    );
  }

  private getDetectedIdeas(componentState: ComponentState): CRaterIdea[] {
    return componentState.studentData.responses.flatMap(
      (response) =>
        response.ideas
          ?.filter((idea) => idea.detected)
          .map((idea) => new CRaterIdea(idea.name, idea.detected)) ?? []
    );
  }

  private sortIdeas(): { id: string; text: string; count: number }[] {
    return [...this.ideaCountMap.entries()]
      .sort((a, b) => b[1].size - a[1].size)
      .map((mapIterator) => ({
        id: mapIterator[0],
        text: this.getIdeaText(mapIterator[0]),
        count: mapIterator[1].size
      }));
  }

  private getIdeaText(id: string): string {
    return this.useIdeaTextOrId(id, this.rubric.getIdea(id).text);
  }

  protected toggleSeeAllIdeas(event: Event): void {
    event.preventDefault();
    this.seeAllIdeas = !this.seeAllIdeas;
  }
}
