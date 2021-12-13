import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Node } from '../common/Node';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';

@Injectable()
export class PeerGroupService {
  constructor(
    private ConfigService: ConfigService,
    private http: HttpClient,
    private ProjectService: ProjectService
  ) {}

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
    const runId = this.ConfigService.getRunId();
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`/api/teacher/peer-group-info/${runId}/${nodeId}/${componentId}`, {
      headers: headers
    });
  }

  createNewGroup(periodId: number, nodeId: string, componentId: string): Observable<any> {
    const runId = this.ConfigService.getRunId();
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(
      `/api/peer-group/create/${runId}/${periodId}/${nodeId}/${componentId}`,
      new HttpParams(),
      { headers: headers }
    );
  }

  moveWorkgroupToGroup(workgroupId: number, groupId: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(
      `/api/peer-group/membership/add/${groupId}/${workgroupId}`,
      new HttpParams(),
      { headers: headers }
    );
  }
}
