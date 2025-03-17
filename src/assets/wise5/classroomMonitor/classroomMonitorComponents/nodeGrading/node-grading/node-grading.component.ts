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

@Component({
  imports: [CommonModule, FlexLayoutModule, MatIconModule, RouterModule, SelectComponentComponent],
  templateUrl: './node-grading.component.html'
})
export class NodeGradingComponent {
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
    setTimeout(() => {
      // allow the current change detection cycle to complete before triggering the navigation
      // to ensure url updates correctly
      this.setComponent(this.node.components[0]);
    }, 0);
  }

  ngOnChanges(): void {
    this.setNode();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setNode(): void {
    this.hasWork = this.projectService.nodeHasWork(this.nodeId);
    this.node = this.projectService.getNode(this.nodeId);
    this.components = this.projectService
      .getComponents(this.nodeId)
      .filter((component) => this.projectService.componentHasWork(component));
    this.numRubrics = this.node.getNumRubrics();
    this.dataService.setCurrentNodeByNodeId(this.nodeId);
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

  protected setComponent(component: any): void {
    this.router.navigate(['component', component.id], {
      relativeTo: this.route
    });
  }
}
