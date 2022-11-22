import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PeerGroupStudentData } from '../../../app/domain/peerGroupStudentData';
import { Node } from '../common/Node';
import { PeerGroup } from '../components/peerChat/PeerGroup';
import { ConfigService } from './configService';

@Injectable()
export class PeerGroupService {
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
  ): Observable<any> {
    const runId = this.configService.isPreview() ? 1 : this.configService.getRunId();
    return this.http.get(`/api/peer-group/${runId}/${workgroupId}/${peerGroupingTag}`);
  }

  retrievePeerGroupWork(
    peerGroup: PeerGroup,
    nodeId: string,
    componentId: string
  ): Observable<any> {
    return this.http.get(`/api/peer-group/${peerGroup.id}/${nodeId}/${componentId}/student-work`);
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

  retrieveDynamicPromptStudentData(
    peerGroupId: number,
    nodeId: string,
    componentId: string
  ): Observable<PeerGroupStudentData[]> {
    return this.http.get<PeerGroupStudentData[]>(
      `/api/peer-group/${peerGroupId}/${nodeId}/${componentId}/student-data/dynamic-prompt`
    );
  }

  retrieveQuestionBankStudentData(
    peerGroupId: number,
    nodeId: string,
    componentId: string
  ): Observable<PeerGroupStudentData[]> {
    return this.http.get<PeerGroupStudentData[]>(
      `/api/peer-group/${peerGroupId}/${nodeId}/${componentId}/student-data/question-bank`
    );
  }
}
