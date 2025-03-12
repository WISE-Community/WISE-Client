import { AnnotationService } from '../../services/annotationService';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentState } from '../../../../app/domain/componentState';
import { ConfigService } from '../../services/configService';
import { CRaterIdea } from '../../components/common/cRater/CRaterIdea';
import { CRaterService } from '../../services/cRaterService';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../services/projectService';
import { SummaryService } from '../../components/summary/summaryService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherSummaryDisplayComponent } from './teacher-summary-display.component';

@Component({
  imports: [CommonModule, MatCardModule, MatIconModule],
  selector: 'dialog-guidance-teacher-summary-display',
  templateUrl: 'dialog-guidance-teacher-summary-display.component.html'
})
export class DialogGuidanceTeacherSummaryDisplayComponent extends TeacherSummaryDisplayComponent {
  protected ideaCountMap: Map<string, Set<number>>;
  protected sortedIdeas: { id: string; count: number }[] = [];
  protected topIdeas: { id: string; count: number }[] = [];
  protected seeAllIdeas: boolean = false;

  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    private cRaterService: CRaterService,
    protected dataService: TeacherDataService,
    protected projectService: ProjectService,
    protected summaryService: SummaryService
  ) {
    super(annotationService, configService, dataService, projectService, summaryService);
    this.ideaCountMap = new Map<string, Set<number>>();
  }

  ngOnInit() {
    this.getLatestWork().subscribe((componentStates) => {
      this.extractIdeasFromComponentStates(componentStates);
      this.sortIdeas();
    });
  }

  private extractIdeasFromComponentStates(componentStates: ComponentState[]): void {
    componentStates.forEach((componentState) => {
      const detectedIdeas = this.getDetectedIdeasFromWorkgroup(componentState);
      if (detectedIdeas !== undefined) {
        detectedIdeas.forEach((idea) => {
          if (this.ideaCountMap.has(idea.name)) {
            this.ideaCountMap.get(idea.name).add(componentState.workgroupId);
          } else {
            this.ideaCountMap.set(idea.name, new Set([componentState.workgroupId]));
          }
        });
      }
    });
  }

  private getDetectedIdeasFromWorkgroup(componentState: ComponentState): CRaterIdea[] {
    const detectedIdeas = [];
    componentState.studentData.responses.forEach((response) => {
      response.ideas
        ?.filter((idea) => idea.detected)
        .forEach((idea) => detectedIdeas.push(new CRaterIdea(idea.name, idea.detected)));
    });
    return detectedIdeas;
  }

  private sortIdeas(): void {
    const rubric = this.cRaterService.getCRaterRubric(this.nodeId, this.componentId);
    this.sortedIdeas = [...this.ideaCountMap.entries()]
      .sort((a, b) => b[1].size - a[1].size)
      .map((mapIterator) => ({
        id: mapIterator[0],
        text: rubric.getIdea(mapIterator[0])?.text ?? mapIterator[0],
        count: mapIterator[1].size
      }));
    this.topIdeas = [...this.sortedIdeas].splice(0, 5);
  }

  protected toggleSeeAllIdeas(): void {
    this.seeAllIdeas = !this.seeAllIdeas;
  }
}
