import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PeerGroupStudentData } from '../../../app/domain/peerGroupStudentData';
import { Node } from '../common/Node';
import { PeerGroup } from '../components/peerChat/PeerGroup';
import { PeerGroupMember } from '../components/peerChat/PeerGroupMember';
import { ConfigService } from './configService';

@Injectable()
export class PeerGroupService {
  static readonly PREVIEW_PEER_GROUP_ID = 1;

  runId: number;

  constructor(protected configService: ConfigService, protected http: HttpClient) {
    this.runId = this.configService.getRunId();
  }

  getPeerGroupingTags(node: Node): Set<string> {
    const tags = new Set<string>();
    node.components.forEach((component) => {
      if (component.peerGroupingTag != null) {
        tags.add(component.peerGroupingTag);
      }
    });
    return tags;
  }

  retrievePeerGroup(
    peerGroupingTag: string,
    workgroupId = this.configService.getWorkgroupId()
  ): Observable<PeerGroup> {
    const runId = this.configService.getRunId();
    return this.http
      .get<PeerGroup>(`/api/peer-group/${runId}/${workgroupId}/${peerGroupingTag}`)
      .pipe(map((value) => new PeerGroup(value.id, value.members, value.peerGrouping)));
  }

  retrievePeerGroupWork(
    peerGroup: PeerGroup,
    nodeId: string,
    componentId: string
  ): Observable<any> {
    return this.http.get(`/api/peer-group/${peerGroup.id}/${nodeId}/${componentId}/student-work`);
  }

  protected getPreviewPeerGroup(): PeerGroup {
    let workgroupId = 1;
    let periodId = 1;
    if (!this.configService.isAuthoring()) {
      workgroupId = this.configService.getWorkgroupId();
      periodId = this.configService.getPeriodId();
    }
    return new PeerGroup(
      PeerGroupService.PREVIEW_PEER_GROUP_ID,
      [new PeerGroupMember(workgroupId, periodId)],
      null
    );
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

  retrievePeerGroupAnnotations(
    peerGroup: PeerGroup,
    nodeId: string,
    componentId: string
  ): Observable<any> {
    return of([]);
  }

  retrievePeerGroupInfo(peerGroupingTag: string): Observable<any> {
    return this.http.get(`/api/teacher/peer-group-info/${this.runId}/${peerGroupingTag}`);
  }

  createNewGroup(periodId: number, peerGroupingTag: string): Observable<any> {
    return this.http.post(
      `/api/peer-group/create/${this.runId}/${periodId}/${peerGroupingTag}`,
      {}
    );
  }

  moveWorkgroupToGroup(workgroupId: number, groupId: number): Observable<any> {
    return this.http.post(`/api/peer-group/membership/add/${groupId}/${workgroupId}`, {});
  }

  removeWorkgroupFromGroup(workgroupId: number, groupId: number): Observable<any> {
    return this.http.delete(`/api/peer-group/membership/${groupId}/${workgroupId}`);
  }

  retrieveQuestionBankStudentData(
    peerGroupId: number,
    nodeId: string,
    componentId: string
  ): Observable<PeerGroupStudentData[]> {
    return of([]);
  }

  retrieveDynamicPromptStudentData(
    peerGroupId: number,
    nodeId: string,
    componentId: string
  ): Observable<PeerGroupStudentData[]> {
    return of([]);
  }
}
