import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Node } from '../common/Node';
import { PeerGroup } from '../components/peerChat/PeerGroup';
import { ConfigService } from './configService';

@Injectable()
export class PeerGroupService {
  runId: number;

  constructor(private ConfigService: ConfigService, private http: HttpClient) {
    this.runId = this.ConfigService.getRunId();
  }

  getPeerGroupComponentIds(node: Node): string[] {
    const componentIds = [];
    for (const component of node.components) {
      if (component.type === 'PeerChat') {
        componentIds.push(component.id);
      }
    }
    return componentIds;
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

  retrieveGroupings(nodeId: string, componentId: string): Observable<any> {
    return this.http.get(`/api/teacher/peer-group-info/${this.runId}/${nodeId}/${componentId}`);
  }

  createNewGroup(periodId: number, nodeId: string, componentId: string): Observable<any> {
    return this.http.post(
      `/api/peer-group/create/${this.runId}/${periodId}/${nodeId}/${componentId}`,
      {}
    );
  }

  moveWorkgroupToGroup(workgroupId: number, groupId: number): Observable<any> {
    return this.http.post(`/api/peer-group/membership/add/${groupId}/${workgroupId}`, {});
  }

  removeWorkgroupFromGroup(workgroupId: number, groupId: number): Observable<any> {
    return this.http.delete(`/api/peer-group/membership/${groupId}/${workgroupId}`);
  }
}
