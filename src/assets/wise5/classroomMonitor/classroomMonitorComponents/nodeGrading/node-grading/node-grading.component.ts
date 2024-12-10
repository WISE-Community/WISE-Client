import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ShowNodeInfoDialogComponent } from '../../../../../../app/classroom-monitor/show-node-info-dialog/show-node-info-dialog.component';
import { SelectComponentComponent } from '../select-component/select-component.component';
import { Node } from '../../../../common/Node';
import { Subscription } from 'rxjs';
import { ComponentServiceLookupService } from '../../../../services/componentServiceLookupService';
import { SummaryService } from '../../../../components/summary/summaryService';
import { AnnotationService } from '../../../../services/annotationService';
import { isMatchingPeriods } from '../../../../common/period/period';
import { TeacherSummaryDisplayComponent } from '../../../../directives/teacher-summary-display/teacher-summary-display.component';

@Component({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    SelectComponentComponent,
    TeacherSummaryDisplayComponent
  ],
  selector: 'node-grading',
  standalone: true,
  templateUrl: './node-grading.component.html'
})
export class NodeGradingComponent {
  protected component: any;
  protected hasWork: boolean;
  protected hasCorrectAnswer: boolean;
  protected hasResponsesSummary: boolean;
  protected hasScoresSummary: boolean;
  protected hasScoreAnnotation: boolean;
  protected node: Node;
  @Input() nodeId: string;
  protected numRubrics: number;
  protected periodId: number;
  protected source: 'allPeriods' | 'period';
  private subscriptions: Subscription = new Subscription();

  constructor(
    private annotationService: AnnotationService,
    private classroomStatusService: ClassroomStatusService,
    private componentServiceLookupService: ComponentServiceLookupService,
    private dataService: TeacherDataService,
    private dialog: MatDialog,
    private projectService: TeacherProjectService,
    private summaryService: SummaryService
  ) {}

  ngOnInit(): void {
    this.hasWork = this.projectService.nodeHasWork(this.nodeId);
    this.node = this.projectService.getNode(this.nodeId);
    this.numRubrics = this.node.getNumRubrics();
    this.dataService.setCurrentNodeByNodeId(this.nodeId);
    this.periodId = this.dataService.getCurrentPeriodId();
    this.setSource();
    this.subscriptions.add(
      this.dataService.currentNodeChanged$.subscribe(({ currentNode }) => {
        this.node = currentNode;
      })
    );
    this.subscriptions.add(
      this.dataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        this.periodId = currentPeriod.periodId;
        this.setSource();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setSource(): void {
    this.source = this.periodId === -1 ? 'allPeriods' : 'period';
  }

  protected getNodeCompletion(): number {
    return this.classroomStatusService.getNodeCompletion(
      this.nodeId,
      this.dataService.getCurrentPeriodId()
    ).completionPct;
  }

  protected getNodeAverageScore(): any {
    return this.classroomStatusService.getNodeAverageScore(
      this.nodeId,
      this.dataService.getCurrentPeriodId()
    );
  }

  protected showRubric(): void {
    this.dialog.open(ShowNodeInfoDialogComponent, {
      data: this.nodeId,
      width: '90%'
    });
  }

  protected showComponent(component: any): void {
    this.component = component;
    this.hasCorrectAnswer = this.componentHasCorrectAnswer(component);
    this.hasResponsesSummary = this.summaryService.isResponsesSummaryAvailableForComponentType(
      component.type
    );
    this.hasScoresSummary = this.summaryService.isScoresSummaryAvailableForComponentType(
      component.type
    );
    this.hasScoreAnnotation = this.componentHasScoreAnnotation(
      this.nodeId,
      component.id,
      this.periodId
    );
  }

  private componentHasCorrectAnswer(component: any): boolean {
    return this.componentServiceLookupService
      .getService(component.type)
      .componentHasCorrectAnswer(component);
  }

  private componentHasScoreAnnotation(
    nodeId: string,
    componentId: string,
    periodId: number
  ): boolean {
    return this.annotationService
      .getAnnotationsByNodeIdComponentId(nodeId, componentId)
      .some(
        (annotation) =>
          isMatchingPeriods(annotation.periodId, periodId) &&
          ['score', 'autoScore'].includes(annotation.type)
      );
  }
}
