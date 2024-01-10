import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { Router } from '@angular/router';

@Component({
  selector: 'milestone-details-dialog',
  templateUrl: './milestone-details-dialog.component.html',
  styleUrls: ['./milestone-details-dialog.component.scss']
})
export class MilestoneDetailsDialogComponent implements OnInit {
  constructor(
    private dataService: TeacherDataService,
    private dialogRef: MatDialogRef<MilestoneDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public milestone: any,
    private router: Router
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
    this.router.navigate(['node', nodeId]);
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
    this.dataService.saveEvent(context, nodeId, componentId, componentType, category, event, data);
  }
}
