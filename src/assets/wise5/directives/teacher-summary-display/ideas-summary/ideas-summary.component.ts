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
import { CRaterRubric } from '../../../components/common/cRater/CRaterRubric';

@Component({
  imports: [CommonModule, IdeaSummaryComponent],
  selector: 'ideas-summary',
  styleUrls: [
    './ideas-summary.component.scss',
    '../../summary-display/summary-display.component.scss'
  ],
  templateUrl: 'ideas-summary.component.html'
})
export class IdeasSummaryComponent extends TeacherSummaryDisplayComponent {
  protected additionalGroups: IdeaGroup[] = [];
  @Input() componentType: string;
  @Input() expanded: boolean;
  protected initialGroups: IdeaGroup[] = [];
  protected showMore: boolean;
  protected rubric: CRaterRubric;

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
    this.rubric = this.cRaterService.getCRaterRubric(this.nodeId, this.componentId);
    if (this.componentType === 'DialogGuidance') {
      this.getLatestWork().subscribe((componentStates) =>
        this.groupIdeas(new DialogGuidanceSummaryData(componentStates, this.rubric))
      );
    } else if (this.componentType === 'OpenResponse') {
      const annotations = this.annotationService
        .getAnnotationsByNodeIdComponentId(this.nodeId, this.componentId)
        .filter((annotation) => this.periodId === -1 || annotation.periodId === this.periodId);
      this.groupIdeas(new OpenResponseSummaryData(annotations, this.rubric));
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
