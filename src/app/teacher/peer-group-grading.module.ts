import { NgModule } from '@angular/core';
import { PeerGroupAssignedWorkgroupsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/peer-group/peer-group-assigned-workgroups/peer-group-assigned-workgroups.component';
import { PeerGroupDialogComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/peer-group/peer-group-dialog/peer-group-dialog.component';
import { PeerGroupGroupingComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/peer-group/peer-group-grouping/peer-group-grouping.component';
import { PeerGroupMoveWorkgroupConfirmDialogComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/peer-group/peer-group-move-workgroup-confirm-dialog/peer-group-move-workgroup-confirm-dialog.component';
import { PeerGroupPeriodComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/peer-group/peer-group-period/peer-group-period.component';
import { PeerGroupUnassignedWorkgroupsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/peer-group/peer-group-unassigned-workgroups/peer-group-unassigned-workgroups.component';
import { PeerGroupWorkgroupComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/peer-group/peer-group-workgroup/peer-group-workgroup.component';
import { SelectPeriodComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/select-period/select-period.component';

@NgModule({
  imports: [
    SelectPeriodComponent,
    PeerGroupAssignedWorkgroupsComponent,
    PeerGroupDialogComponent,
    PeerGroupGroupingComponent,
    PeerGroupMoveWorkgroupConfirmDialogComponent,
    PeerGroupPeriodComponent,
    PeerGroupUnassignedWorkgroupsComponent,
    PeerGroupWorkgroupComponent
  ],
  exports: [
    PeerGroupAssignedWorkgroupsComponent,
    PeerGroupDialogComponent,
    PeerGroupGroupingComponent,
    PeerGroupMoveWorkgroupConfirmDialogComponent,
    PeerGroupPeriodComponent,
    PeerGroupUnassignedWorkgroupsComponent,
    PeerGroupWorkgroupComponent
  ]
})
export class PeerGroupGradingModule {}
