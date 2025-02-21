import { Component, Input } from '@angular/core';
import { TeacherSummaryDisplayComponent } from '../../../directives/teacher-summary-display/teacher-summary-display.component';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { SummaryService } from '../../../components/summary/summaryService';
import { Subscription } from 'rxjs';
import { TeacherDataService } from '../../../services/teacherDataService';
import { isMatchingPeriods } from '../../../common/period/period';
import { AnnotationService } from '../../../services/annotationService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { Node } from '../../../common/Node';
import { ClassResponsesComponent } from '../class-responses/class-responses.component';
import { ActivatedRoute } from '@angular/router';
import { MilestoneReportButtonComponent } from '../milestone-report-button/milestone-report-button.component';
import { PeerGroupButtonComponent } from '../peer-group-button/peer-group-button.component';

@Component({
  imports: [
    ClassResponsesComponent,
    MilestoneReportButtonComponent,
    PeerGroupButtonComponent,
    TeacherSummaryDisplayComponent
  ],
  selector: 'component-grading-view',
  standalone: true,
  templateUrl: './component-grading-view.component.html'
})
export class ComponentGradingViewComponent {
  protected component: any;
  @Input() componentId: string;
  protected hasCorrectAnswer: boolean;
  protected hasResponsesSummary: boolean;
  protected hasScoresSummary: boolean;
  protected hasScoreAnnotation: boolean;
  protected node: Node;
  protected periodId: number;
  protected source: 'allPeriods' | 'period';
  private subscriptions: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private annotationService: AnnotationService,
    private componentServiceLookupService: ComponentServiceLookupService,
    private dataService: TeacherDataService,
    private projectService: TeacherProjectService,
    private summaryService: SummaryService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.parent.params.subscribe((params) => {
      this.dataService.setCurrentNodeByNodeId(params.nodeId);
    });
    this.subscriptions.add(
      this.dataService.currentNodeChanged$.subscribe(({ currentNode }) => {
        this.node = this.projectService.getNode(currentNode.id);
      })
    );
    this.subscriptions.add(
      this.dataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        this.periodId = currentPeriod.periodId;
        this.setSource();
      })
    );
  }

  ngOnChanges(): void {
    this.node = this.projectService.getNode(this.dataService.getCurrentNode().id);
    this.setComponent();
    this.periodId = this.dataService.getCurrentPeriodId();
    this.setSource();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setComponent(): void {
    this.component = this.node.getComponent(this.componentId);
    this.hasCorrectAnswer = this.componentHasCorrectAnswer(this.component);
    this.hasResponsesSummary = this.summaryService.isResponsesSummaryAvailableForComponentType(
      this.component.type
    );
    this.hasScoresSummary = this.summaryService.isScoresSummaryAvailableForComponentType(
      this.component.type
    );
    this.hasScoreAnnotation = this.componentHasScoreAnnotation(this.component.id, this.periodId);
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
}
