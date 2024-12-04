import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ShowNodeInfoDialogComponent } from '../../../../../../app/classroom-monitor/show-node-info-dialog/show-node-info-dialog.component';

@Component({
  imports: [CommonModule, FlexLayoutModule, MatIconModule],
  selector: 'node-grading',
  standalone: true,
  templateUrl: './node-grading.component.html'
})
export class NodeGradingComponent {
  protected hasWork: boolean;
  @Input() nodeId: string;
  protected numRubrics: number;
  constructor(
    private classroomStatusService: ClassroomStatusService,
    private dataService: TeacherDataService,
    private dialog: MatDialog,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.hasWork = this.projectService.nodeHasWork(this.nodeId);
    this.numRubrics = this.projectService.getNode(this.nodeId).getNumRubrics();
    this.dataService.setCurrentNodeByNodeId(this.nodeId);
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
}
