import { AnnotationService } from '../../../services/annotationService';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { CRaterService } from '../../../services/cRaterService';
import { DialogGuidanceSummaryData } from '../summary-data/DialogGuidanceSummaryData';
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
  protected leastCommonIdeas: { id: string; text: string; count: number }[] = [];
  protected mostCommonIdeas: { id: string; text: string; count: number }[] = [];
  protected showAllIdeas: boolean;

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
    this.generateIdeasSummary();
  }

  private generateIdeasSummary(): void {
    const rubric = this.cRaterService.getCRaterRubric(
      this.nodeId,
      this.componentId,
      this.componentType
    );
    if (this.componentType === 'DialogGuidance') {
      this.getLatestWork().subscribe((componentStates) =>
        this.compileAndSortIdeas(new DialogGuidanceSummaryData(componentStates, rubric))
      );
    } else if (this.componentType === 'OpenResponse') {
      this.compileAndSortIdeas(
        new OpenResponseSummaryData(
          this.annotationService.getAnnotationsByNodeIdComponentId(this.nodeId, this.componentId),
          rubric
        )
      );
    }
  }

  private compileAndSortIdeas(ideasSummaryData: IdeasSummaryData) {
    if (ideasSummaryData.hasAnyDetectedIdeas()) {
      const ideaDataArray = ideasSummaryData.getIdeaDataArray();
      const sortedIdeas = this.ideasSortingService.sortByCount(ideaDataArray);
      this.mostCommonIdeas = [...sortedIdeas].splice(0, 3);
      if (sortedIdeas.length <= 3) {
        this.leastCommonIdeas = [...this.mostCommonIdeas].reverse();
      } else {
        this.leastCommonIdeas = [...sortedIdeas]
          .splice(sortedIdeas.length - 3, sortedIdeas.length)
          .reverse();
      }
      this.allIdeas = this.ideasSortingService.sortById(ideaDataArray);
      this.doRender = true;
    } else {
      this.doRender = false;
    }
  }

  protected renderDisplay(): void {
    super.renderDisplay();
    this.generateIdeasSummary();
  }

  protected toggleAllIdeas(): void {
    this.showAllIdeas = !this.showAllIdeas;
  }
}
