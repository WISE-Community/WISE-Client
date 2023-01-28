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
  milestone: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MilestoneDetailsDialogComponent>,
    private teacherDataService: TeacherDataService,
    private upgrade: UpgradeModule
  ) {
    this.milestone = data.milestone;
  }

  ngOnInit(): void {
    this.saveMilestoneOpenedEvent();
  }

  close() {
    this.saveMilestoneClosedEvent();
    // this.$mdDialog.hide();
    this.dialogRef.close();
  }

  // edit() {
  //   this.$mdDialog.hide({
  //     milestone: this.milestone,
  //     action: 'edit',
  //     $event: this.$event
  //   });
  // }

  onVisitNodeGrading(nodeId: string): void {
    // this.$mdDialog.hide();
    this.dialogRef.close();
    this.upgrade.$injector.get('$state').go('root.cm.node', { nodeId: nodeId });
  }

  saveMilestoneOpenedEvent() {
    this.saveMilestoneEvent('MilestoneOpened');
  }

  saveMilestoneClosedEvent() {
    this.saveMilestoneEvent('MilestoneClosed');
  }

  saveMilestoneEvent(event: any) {
    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      data = { milestoneId: this.data.milestone.id },
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
