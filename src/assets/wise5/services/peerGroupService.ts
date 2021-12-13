import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Node } from '../common/Node';
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
}
