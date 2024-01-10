import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../../services/configService';
import { ComponentService } from '../componentService';
import { PeerChatMessage } from './PeerChatMessage';
import { getAvatarColorForWorkgroupId } from '../../common/workgroup/workgroup';

@Injectable()
export class PeerChatService extends ComponentService {
  constructor(private configService: ConfigService, private http: HttpClient) {
    super();
  }

  getComponentTypeLabel() {
    return $localize`Peer Chat`;
  }

  createComponent(): any {
    const component: any = super.createComponent();
    component.type = 'PeerChat';
    component.peerGroupingTag = '';
    return component;
  }

  retrievePeerChatComponentStates(
    nodeId: string,
    componentId: string,
    workgroupId: number
  ): Observable<any> {
    const runId = this.configService.getRunId();
    if (this.configService.isPreview()) {
      this.configService.config.runId = 1;
    }
    return this.http.get(
      `/api/peer-group/${runId}/${workgroupId}/${nodeId}/${componentId}/student-work`
    );
  }

  retrievePeerChatAnnotations(
    nodeId: string,
    componentId: string,
    workgroupId: number
  ): Observable<any> {
    const runId = this.configService.getRunId();
    return this.http.get(
      `/api/peer-group/${runId}/${workgroupId}/${nodeId}/${componentId}/annotations`
    );
  }

  convertComponentStateToPeerChatMessage(componentState: any): PeerChatMessage {
    return new PeerChatMessage(
      componentState.workgroupId,
      componentState.studentData.response,
      componentState.serverSaveTime,
      componentState.id
    );
  }

  setPeerChatWorkgroups(peerChatWorkgroupInfos: any, workgroupIds: number[]): any {
    for (const workgroupId of workgroupIds) {
      peerChatWorkgroupInfos[workgroupId] = {
        avatarColor: getAvatarColorForWorkgroupId(workgroupId),
        displayNames: this.configService.isTeacherWorkgroupId(workgroupId)
          ? $localize`Teacher`
          : this.configService.getUsernamesStringByWorkgroupId(workgroupId),
        isTeacher: this.configService.isTeacherWorkgroupId(workgroupId)
      };
    }
  }

  setPeerChatMessages(peerChatMessages: PeerChatMessage[], componentStates: any): void {
    componentStates.forEach((componentState: any) => {
      peerChatMessages.push(this.convertComponentStateToPeerChatMessage(componentState));
    });
  }

  isCompleted(component: any, componentStates: any[], nodeEvents: any[], node: any) {
    return componentStates.length > 0;
  }

  processIsDeletedAnnotations(annotations: any[], peerChatMessages: PeerChatMessage[]): void {
    const componentStateIdToIsDeleted = {};
    for (const annotation of annotations) {
      if (annotation.type === 'inappropriateFlag') {
        if (annotation.data.action === 'Delete') {
          componentStateIdToIsDeleted[annotation.studentWorkId] = true;
        } else if (annotation.data.action === 'Undo Delete') {
          componentStateIdToIsDeleted[annotation.studentWorkId] = false;
        }
      }
    }
    for (const peerChatMessage of peerChatMessages) {
      peerChatMessage.isDeleted = componentStateIdToIsDeleted[peerChatMessage.componentStateId];
    }
  }
}
