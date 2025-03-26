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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ComponentGradingViewComponent } from '../../component-grading-view/component-grading-view.component';
import { ComponentContent } from '../../../../common/ComponentContent';

@Component({
  imports: [
    CommonModule,
    ComponentGradingViewComponent,
    FlexLayoutModule,
    MatIconModule,
    RouterModule,
    SelectComponentComponent
  ],
  templateUrl: './node-grading.component.html'
})
export class NodeGradingComponent {
  protected component: ComponentContent;
  @Input() componentId: string;
  protected components: any[];
  protected hasWork: boolean;
  protected node: Node;
  protected nodeAverageScore: number;
  protected nodeCompletionPercent: number;
  @Input() nodeId: string;
  protected numRubrics: number;
  private periodId: number;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private classroomStatusService: ClassroomStatusService,
    private dataService: TeacherDataService,
    private dialog: MatDialog,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.dataService.currentPeriodChanged$.subscribe(() => this.setPeriod())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.nodeId && this.componentId) {
      this.setFields();
    }
  }

  private setFields(): void {
    this.hasWork = this.projectService.nodeHasWork(this.nodeId);
    this.node = this.projectService.getNode(this.nodeId);
    this.components = this.projectService
      .getComponents(this.nodeId)
      .filter((component) => this.projectService.componentHasWork(component));
    this.component = this.node.getComponent(this.componentId);
    this.numRubrics = this.node.getNumRubrics();
    this.setPeriod();
  }

  private setPeriod(): void {
    this.periodId = this.dataService.getCurrentPeriodId();
    this.setNodeAverageScore();
    this.setNodeCompletionPercent();
  }

  private setNodeAverageScore(): void {
    this.nodeAverageScore = this.classroomStatusService.getNodeAverageScore(
      this.nodeId,
      this.periodId
    );
  }

  private setNodeCompletionPercent(): void {
    this.nodeCompletionPercent = this.classroomStatusService.getNodeCompletion(
      this.nodeId,
      this.periodId
    ).completionPct;
  }

  protected showRubric(): void {
    this.dialog.open(ShowNodeInfoDialogComponent, {
      data: this.nodeId,
      width: '90%'
    });
  }

  protected navigateToComponent(component: ComponentContent): void {
    this.router.navigate(['..', component.id], {
      relativeTo: this.route
    });
  }
}
