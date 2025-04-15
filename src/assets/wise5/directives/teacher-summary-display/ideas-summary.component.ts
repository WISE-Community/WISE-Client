import { AnnotationService } from '../../services/annotationService';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
import { DialogGuidanceSummaryData } from './summary-data/DialogGuidanceSummaryData';
import { OpenResponseSummaryData } from './summary-data/OpenResponseSummaryData';
import { IdeasSummaryData } from './summary-data/IdeasSummaryData';
import { IdeaData, IdeasSortingService } from '../../services/ideasSortingService';

@Component({
  imports: [CommonModule, MatCardModule, MatIconModule],
  providers: [IdeasSortingService],
  selector: 'ideas-summary',
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
    private cRaterService: CRaterService,
    protected dataService: TeacherDataService,
    private ideasSortingService: IdeasSortingService,
    protected projectService: TeacherProjectService,
    protected summaryService: SummaryService
  ) {
    super(annotationService, configService, dataService, projectService, summaryService);
  }

  ngOnInit(): void {
    this.ideaDescriptions = this.cRaterService.getCRaterRubric(
      this.nodeId,
      this.componentId,
      this.componentType
    );
    this.generateIdeasSummary();
  }

  private generateIdeasSummary(): IdeasSummaryData {
    let ideasSummaryData: IdeasSummaryData;
    if (this.componentType === 'DialogGuidance') {
      this.getLatestWork().subscribe((componentStates) => {
        ideasSummaryData = new DialogGuidanceSummaryData(componentStates);
        this.compileAndSortIdeas(ideasSummaryData);
      });
    } else if (this.componentType === 'OpenResponse') {
      const annotations = this.annotationService.getAnnotationsByNodeIdComponentId(
        this.nodeId,
        this.componentId
      );
      ideasSummaryData = new OpenResponseSummaryData(annotations);
      this.compileAndSortIdeas(ideasSummaryData);
    }
    return ideasSummaryData;
  }

  private compileAndSortIdeas(ideasSummaryData: IdeasSummaryData) {
    this.ideaCountMap = ideasSummaryData.getIdeaCountMap();
    if (!Array.from(this.ideaCountMap.values()).some((value) => value > 0)) {
      // No ideas detected
      this.doRender = false;
    } else {
      const ideaCountArray = this.ideaCountMapToArray(this.ideaDescriptions.getIdeas());
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
    }
  }

  private ideaCountMapToArray(ideaDescriptions: CRaterIdea[]): IdeaData[] {
    const ideaCountArray = [];
    this.ideaCountMap.forEach((count, ideaId, map) => {
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

  protected toggleSeeAllIdeas(event: Event): void {
    event.preventDefault();
    this.seeAllIdeas = !this.seeAllIdeas;
  }
}
