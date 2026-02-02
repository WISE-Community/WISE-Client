import { Component, OnInit, inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { Router } from '@angular/router';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MilestoneDetailsComponent } from '../milestone-details/milestone-details.component';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MilestoneDetailsComponent,
    MatDialogActions,
    MatButton
  ],
  selector: 'milestone-details-dialog',
  styleUrl: './milestone-details-dialog.component.scss',
  templateUrl: './milestone-details-dialog.component.html'
})
export class MilestoneDetailsDialogComponent implements OnInit {
  private dataService = inject(TeacherDataService);
  private dialogRef = inject<MatDialogRef<MilestoneDetailsDialogComponent>>(MatDialogRef);
  milestone = inject(MAT_DIALOG_DATA);
  private router = inject(Router);


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
