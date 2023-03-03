import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { PeerGroupDialogComponent } from '../classroomMonitor/classroomMonitorComponents/peer-group/peer-group-dialog/peer-group-dialog.component';
import { PeerGroup } from '../components/peerChat/PeerGroup';
import { ConfigService } from './configService';
import { PeerGroupService } from './peerGroupService';

@Injectable()
export class TeacherPeerGroupService extends PeerGroupService {
  constructor(
    protected configService: ConfigService,
    private dialog: MatDialog,
    protected http: HttpClient
  ) {
    super(configService, http);
  }

  showPeerGroupDetails(peerGroupingTag: string): void {
    this.dialog.open(PeerGroupDialogComponent, {
      data: peerGroupingTag,
      panelClass: 'dialog-lg'
    });
  }

  retrievePeerGroup(peerGroupingTag: string, workgroupId: number): Observable<PeerGroup> {
    // When the teacher previews anything that retrieves Peer Group like Classroom Monitor Step Info
    // or Authoring preview popup, the workgroupId will be null
    if (this.configService.isClassroomMonitor() && workgroupId != null) {
      return super.retrievePeerGroup(peerGroupingTag, workgroupId);
    } else {
      return of(this.getPreviewPeerGroup());
    }
  }

  retrievePeerGroupWork(): Observable<any> {
    return of([]);
  }

  retrieveStudentWork(
    peerGroup: PeerGroup,
    nodeId: string,
    componentId: string,
    showWorkNodeId: string,
    showWorkComponentId: string
  ): Observable<any> {
    if (
      this.configService.isClassroomMonitor() &&
      peerGroup.id !== PeerGroupService.PREVIEW_PEER_GROUP_ID
    ) {
      return super.retrieveStudentWork(
        peerGroup,
        nodeId,
        componentId,
        showWorkNodeId,
        showWorkComponentId
      );
    } else {
      return of([]);
    }
  }
}
