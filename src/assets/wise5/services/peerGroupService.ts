import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';

@Injectable()
export class PeerGroupService {
  constructor(
    private ConfigService: ConfigService,
    private http: HttpClient,
    private ProjectService: ProjectService
  ) {}

  getPeerGroupComponentIds(node: any): string[] {
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

  createNewGroup(nodeId: string, componentId: string): Observable<any> {
    const runId = this.ConfigService.getRunId();
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(
      `/api/peer-group/create/${runId}/${nodeId}/${componentId}`,
      new HttpParams(),
      { headers: headers }
    );
  }

  moveWorkgroupToGroup(
    workgroupId: number,
    groupId: number,
    nodeId: string,
    componentId: string
  ): Observable<any> {
    const runId = this.ConfigService.getRunId();
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(
      `/api/peer-group/move-member/${runId}/${nodeId}/${componentId}/${groupId}/${workgroupId}`,
      new HttpParams(),
      { headers: headers }
    );
  }
}
