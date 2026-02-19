import { AnnotationService } from '../../../services/annotationService';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { CRaterService } from '../../../services/cRaterService';
import { DialogGuidanceSummaryData } from '../summary-data/DialogGuidanceSummaryData';
import { IdeasSummaryData } from '../summary-data/IdeasSummaryData';
import { OpenResponseSummaryData } from '../summary-data/OpenResponseSummaryData';
import { SummaryService } from '../../../components/summary/summaryService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';
import { IdeaSummaryComponent } from '../idea-summary/idea-summary.component';
import { IdeaGroup } from '../summary-data/IdeasSummaryData';

@Component({
  imports: [CommonModule, IdeaSummaryComponent],
  selector: 'ideas-summary',
  styles: `
    h3,
    .mat-subtitle-1,
    .mat-body-1 {
      margin-bottom: 8px;
      margin-top: 0;
    }
    ul {
      list-style-type: none;
      margin-block-start: 0;
      padding-inline-start: 0;
    }
    li:not(:last-child) {
      margin-bottom: 4px;
    }
  `,
  templateUrl: 'ideas-summary.component.html'
})
export class IdeasSummaryComponent extends TeacherSummaryDisplayComponent {
  @Input() componentType: string;

  protected additionalGroups: IdeaGroup[] = [];
  protected initialGroups: IdeaGroup[] = [];
  protected showMore: boolean;

  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    protected cRaterService: CRaterService,
    protected dataService: TeacherDataService,
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
    const rubric = this.cRaterService.getCRaterRubric(this.nodeId, this.componentId);
    if (this.componentType === 'DialogGuidance') {
      this.getLatestWork().subscribe((componentStates) =>
        this.groupIdeas(new DialogGuidanceSummaryData(componentStates, rubric))
      );
    } else if (this.componentType === 'OpenResponse') {
      this.groupIdeas(
        new OpenResponseSummaryData(
          this.annotationService.getAnnotationsByNodeIdComponentId(this.nodeId, this.componentId),
          rubric
        )
      );
    }
  }

  private groupIdeas(ideasSummaryData: IdeasSummaryData) {
    if (ideasSummaryData.hasAnyDetectedIdeas()) {
      [this.initialGroups, this.additionalGroups] = ideasSummaryData.getIdeasSummaryGroups();
      this.doRender = true;
    } else {
      this.doRender = false;
    }
  }

  protected renderDisplay(): void {
    super.renderDisplay();
    this.generateIdeasSummary();
  }
}
