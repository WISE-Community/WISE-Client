import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PeerGroupDialogComponent } from '../classroomMonitor/classroomMonitorComponents/peer-group/peer-group-dialog/peer-group-dialog.component';
import { Node } from '../common/Node';
import { PeerGroup } from '../components/peerChat/PeerGroup';
import { ConfigService } from './configService';

@Injectable()
export class PeerGroupService {
  runId: number;

  constructor(
    private ConfigService: ConfigService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    this.runId = this.ConfigService.getRunId();
  }

  getPeerGroupActivityTags(node: Node): Set<string> {
    const tags = new Set<string>();
    node.components.forEach((component) => {
      if (component.peerGroupActivityTag != null) {
        tags.add(component.peerGroupActivityTag);
      }
    });
    return tags;
  }

  retrievePeerGroup(peerGroupActivityTag: string): Observable<any> {
    const runId = this.ConfigService.isPreview() ? 1 : this.ConfigService.getRunId();
    const workgroupId = this.ConfigService.getWorkgroupId();
    return this.http.get(`/api/peer-group/${runId}/${workgroupId}/${peerGroupActivityTag}`);
  }

  retrieveStudentWork(
    peerGroup: PeerGroup,
    nodeId: string,
    componentId: string,
    showWorkNodeId: string,
    showWorkComponentId: string
  ): Observable<any> {
    return this.http.get(
      `/api/classmate/peer-group-work/${peerGroup.id}/${nodeId}/${componentId}/${showWorkNodeId}/${showWorkComponentId}`
    );
  }

  retrievePeerGroupInfo(peerGroupActivityTag: string): Observable<any> {
    return this.http.get(`/api/teacher/peer-group-info/${this.runId}/${peerGroupActivityTag}`);
  }

  createNewGroup(periodId: number, peerGroupActivityTag: string): Observable<any> {
    return this.http.post(
      `/api/peer-group/create/${this.runId}/${periodId}/${peerGroupActivityTag}`,
      {}
    );
  }

  moveWorkgroupToGroup(workgroupId: number, groupId: number): Observable<any> {
    return this.http.post(`/api/peer-group/membership/add/${groupId}/${workgroupId}`, {});
  }

  removeWorkgroupFromGroup(workgroupId: number, groupId: number): Observable<any> {
    return this.http.delete(`/api/peer-group/membership/${groupId}/${workgroupId}`);
  }

  showPeerGroupDetails(peerGroupActivityTag: string): void {
    this.dialog.open(PeerGroupDialogComponent, {
      data: peerGroupActivityTag,
      panelClass: 'dialog-lg'
    });
  }
}
