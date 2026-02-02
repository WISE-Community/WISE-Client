import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { TeacherSummaryDisplayComponent } from '../../../directives/teacher-summary-display/teacher-summary-display.component';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { SummaryService } from '../../../components/summary/summaryService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { isMatchingPeriods } from '../../../common/period/period';
import { AnnotationService } from '../../../services/annotationService';
import { Node } from '../../../common/Node';
import { MilestoneReportButtonComponent } from '../milestone-report-button/milestone-report-button.component';
import { PeerGroupButtonComponent } from '../peer-group-button/peer-group-button.component';
import { ComponentCompletionComponent } from '../component-completion/component-completion.component';
import { ComponentContent } from '../../../common/ComponentContent';
import { IdeasSummaryComponent } from '../../../directives/teacher-summary-display/ideas-summary-display/ideas-summary.component';
import { MatchSummaryDisplayComponent } from '../../../directives/teacher-summary-display/match-summary-display/match-summary-display.component';
import { MatCardModule } from '@angular/material/card';
import { CRaterService } from '../../../services/cRaterService';

@Component({
  imports: [
    ComponentCompletionComponent,
    IdeasSummaryComponent,
    MatCardModule,
    MatchSummaryDisplayComponent,
    MilestoneReportButtonComponent,
    PeerGroupButtonComponent,
    TeacherSummaryDisplayComponent
  ],
  selector: 'component-summary',
  styleUrl: './component-summary.component.scss',
  templateUrl: './component-summary.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ComponentSummaryComponent {
  private annotationService = inject(AnnotationService);
  private componentServiceLookupService = inject(ComponentServiceLookupService);
  private cRaterService = inject(CRaterService);
  private dataService = inject(TeacherDataService);
  private summaryService = inject(SummaryService);

  protected avgScore: number;
  @Input() component: ComponentContent;
  protected hasCorrectAnswer: boolean;
  protected hasScoresSummary: boolean;
  protected hasScoreAnnotation: boolean;
  protected hasIdeaRubricData: boolean;
  protected hasStudentWork: boolean;
  protected hasSummaryData: boolean;
  @Input() node: Node;
  @Input() periodId: number;
  protected source: 'allPeriods' | 'period';

  ngOnChanges(): void {
    if (this.node && this.component) {
      this.dataService.retrieveStudentDataForNode(this.node).subscribe(() => this.setComponent());
      this.setSource();
      const annotations = this.getLatestScoreAnnotations();
      const totalScore = annotations.reduce((sumSoFar, a) => sumSoFar + a.data.value, 0);
      this.avgScore = totalScore / annotations.length;
    }
  }

  private setComponent(): void {
    this.hasCorrectAnswer = this.componentHasCorrectAnswer(this.component);
    this.hasScoresSummary = this.summaryService.isScoresSummaryAvailableForComponentType(
      this.component.type
    );
    this.hasScoreAnnotation = this.componentHasScoreAnnotation(this.component.id, this.periodId);
    this.hasStudentWork =
      this.dataService
        .getComponentStatesByComponentId(this.component.id)
        .filter((state) => state.periodId === this.periodId).length > 0;
    this.hasIdeaRubricData = this.cRaterService
      .getCRaterRubric(this.node.id, this.component.id)
      .hasRubricData();
    this.hasSummaryData =
      (this.component?.type === 'MultipleChoice' && this.hasStudentWork) ||
      (this.hasScoresSummary && this.hasScoreAnnotation) ||
      this.hasIdeaRubricData ||
      this.component?.type === 'Match';
  }

  private setSource(): void {
    this.source = this.periodId === -1 ? 'allPeriods' : 'period';
  }

  private componentHasCorrectAnswer(component: any): boolean {
    return this.componentServiceLookupService
      .getService(component.type)
      .componentHasCorrectAnswer(component);
  }

  private componentHasScoreAnnotation(componentId: string, periodId: number): boolean {
    return this.annotationService
      .getAnnotationsByNodeIdComponentId(this.dataService.getCurrentNode().id, componentId)
      .some(
        (annotation) =>
          isMatchingPeriods(annotation.periodId, periodId) &&
          ['score', 'autoScore'].includes(annotation.type)
      );
  }

  private getLatestScoreAnnotations() {
    return this.annotationService
      .getAnnotationsByNodeIdComponentId(this.node.id, this.component.id)
      .filter((annotation) => this.periodId === -1 || annotation.periodId === this.periodId)
      .filter((annotation) => ['score', 'autoScore'].includes(annotation.type))
      .reduceRight((soFar, currentA) => {
        if (!soFar.some((soFarA) => soFarA.toWorkgroupId === currentA.toWorkgroupId)) {
          soFar.push(currentA);
        }
        return soFar;
      }, []);
  }
}
