import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpgradeModule } from '@angular/upgrade/static';
import { TeacherDataService } from '../../../../services/teacherDataService';

@Component({
  selector: 'milestone-details-dialog',
  templateUrl: './milestone-details-dialog.component.html',
  styleUrls: ['./milestone-details-dialog.component.scss']
})
export class MilestoneDetailsDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public milestone: any,
    private dialogRef: MatDialogRef<MilestoneDetailsDialogComponent>,
    private teacherDataService: TeacherDataService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit(): void {
    this.saveMilestoneOpenedEvent();
  }

  protected close(): void {
    this.saveMilestoneClosedEvent();
    this.dialogRef.close();
  }

  protected onVisitNodeGrading(nodeId: string): void {
    this.dialogRef.close();
    this.upgrade.$injector.get('$state').go('root.cm.node', { nodeId: nodeId });
  }

  private saveMilestoneOpenedEvent(): void {
    this.saveMilestoneEvent('MilestoneOpened');
  }

  private saveMilestoneClosedEvent(): void {
    this.saveMilestoneEvent('MilestoneClosed');
  }

  private saveMilestoneEvent(event: any): void {
    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      data = { milestoneId: this.milestone.id },
      projectId = null;
    this.teacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      event,
      data
    );
  }
}
