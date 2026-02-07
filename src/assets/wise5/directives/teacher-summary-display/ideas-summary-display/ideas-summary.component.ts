import { AnnotationService } from '../../../services/annotationService';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { CRaterIdea } from '../../../components/common/cRater/CRaterIdea';
import { CRaterRubric } from '../../../components/common/cRater/CRaterRubric';
import { CRaterService } from '../../../services/cRaterService';
import { DialogGuidanceSummaryData } from '../summary-data/DialogGuidanceSummaryData';
import { IdeaData } from '../../../components/common/cRater/IdeaData';
import { IdeasSortingService } from '../../../services/ideasSortingService';
import { IdeasSummaryData } from '../summary-data/IdeasSummaryData';
import { OpenResponseSummaryData } from '../summary-data/OpenResponseSummaryData';
import { SummaryService } from '../../../components/summary/summaryService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';
import { IdeaSummaryComponent } from '../idea-summary/idea-summary.component';

@Component({
  imports: [CommonModule, IdeaSummaryComponent],
  providers: [IdeasSortingService],
  selector: 'ideas-summary',
  styles: `
    h3,
    .mat-subtitle-1 {
      margin-bottom: 8px;
      margin-top: 0;
    }
    ul {
      list-style-type: none;
      margin-block-start: 0;
      padding-inline-start: 0;
    }
  `,
  templateUrl: 'ideas-summary.component.html'
})
export class IdeasSummaryComponent extends TeacherSummaryDisplayComponent {
  protected allIdeas: { id: string; text: string; count: number }[] = [];
  @Input() componentType: string;
  protected ideaCountMap: Map<string, number>;
  private ideaDescriptions: CRaterRubric;
  protected leastCommonIdeas: { id: string; text: string; count: number }[] = [];
  protected mostCommonIdeas: { id: string; text: string; count: number }[] = [];
  protected seeAllIdeas: boolean;

  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    protected cRaterService: CRaterService,
    protected dataService: TeacherDataService,
    private ideasSortingService: IdeasSortingService,
    protected projectService: TeacherProjectService,
    protected summaryService: SummaryService
  ) {
    super(
      annotationService,
      configService,
      cRaterService,
      dataService,
      projectService,
      summaryService
    );
  }

  ngOnInit(): void {
    this.ideaDescriptions = this.cRaterService.getCRaterRubric(
      this.nodeId,
      this.componentId,
      this.componentType
    );
    this.generateIdeasSummary();
  }

  private generateIdeasSummary(): void {
    if (this.componentType === 'DialogGuidance') {
      this.getLatestWork().subscribe((componentStates) =>
        this.compileAndSortIdeas(new DialogGuidanceSummaryData(componentStates))
      );
    } else if (this.componentType === 'OpenResponse') {
      this.compileAndSortIdeas(
        new OpenResponseSummaryData(
          this.annotationService.getAnnotationsByNodeIdComponentId(this.nodeId, this.componentId)
        )
      );
    }
  }

  private compileAndSortIdeas(ideasSummaryData: IdeasSummaryData) {
    this.ideaCountMap = ideasSummaryData.getIdeaCountMap();
    if (!Array.from(this.ideaCountMap.values()).some((value) => value > 0)) {
      // No ideas detected
      this.doRender = false;
    } else {
      const ideaCountArray = this.ideaCountMapToArray(this.ideaDescriptions.ideas);
      const sortedIdeas = this.ideasSortingService.sortByCount(ideaCountArray);
      this.mostCommonIdeas = [...sortedIdeas].splice(0, 3);
      if (sortedIdeas.length <= 3) {
        this.leastCommonIdeas = [...this.mostCommonIdeas].reverse();
      } else {
        this.leastCommonIdeas = [...sortedIdeas]
          .splice(sortedIdeas.length - 3, sortedIdeas.length)
          .reverse();
      }
      this.allIdeas = this.ideasSortingService.sortById(ideaCountArray);
      this.doRender = true;
    }
  }

  private ideaCountMapToArray(ideaDescriptions: CRaterIdea[]): IdeaData[] {
    const ideaCountArray = [];
    this.ideaCountMap.forEach((count, ideaId) => {
      const ideaDescription = ideaDescriptions.find(
        (ideaDescription) => ideaDescription.name === ideaId
      );
      ideaCountArray.push({
        id: ideaId,
        text: this.useIdeaTextOrId(ideaId, ideaDescription?.text),
        count: count
      });
    });
    return ideaCountArray;
  }

  private useIdeaTextOrId(id: string, text: string): string {
    return text ?? 'idea ' + id;
  }

  protected renderDisplay(): void {
    super.renderDisplay();
    this.generateIdeasSummary();
  }

  protected toggleSeeAllIdeas(event: Event): void {
    event.preventDefault();
    this.seeAllIdeas = !this.seeAllIdeas;
  }
}
