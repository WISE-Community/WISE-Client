import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../../services/configService';
import { StudentDataService } from '../../services/studentDataService';
import { UtilService } from '../../services/utilService';
import { ComponentService } from '../componentService';
import { PeerChatMessage } from './PeerChatMessage';

@Injectable()
export class PeerChatService extends ComponentService {
  constructor(
    private ConfigService: ConfigService,
    private http: HttpClient,
    protected StudentDataService: StudentDataService,
    protected UtilService: UtilService
  ) {
    super(StudentDataService, UtilService);
  }

  getComponentTypeLabel() {
    return $localize`Peer Chat`;
  }

  createComponent(): any {
    const component: any = super.createComponent();
    component.type = 'PeerChat';
    component.logic = [{ name: 'random' }];
    component.logicThresholdCount = 0;
    component.logicThresholdPercent = 0;
    component.maxMembershipCount = 2;
    component.questionBank = [];
    return component;
  }

  retrievePeerChatWorkgroups(nodeId: string, componentId: string): Observable<any> {
    if (this.ConfigService.isPreview()) {
      this.ConfigService.config.runId = 1;
    }
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const runId = this.ConfigService.getRunId();
    const workgroupId = this.ConfigService.getWorkgroupId();
    return this.http.get(`/api/peer-group/${runId}/${workgroupId}/${nodeId}/${componentId}`, {
      headers: headers
    });
  }

  retrievePeerChatComponentStatesByPeerGroup(peerGroupId: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`/api/peer-group/${peerGroupId}/student-work`, { headers: headers });
  }

  retrievePeerChatComponentStates(
    nodeId: string,
    componentId: string,
    workgroupId: number
  ): Observable<any> {
    const runId = this.ConfigService.getRunId();
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.ConfigService.isPreview()) {
      this.ConfigService.config.runId = 1;
    }
    return this.http.get(
      `/api/peer-group/${runId}/${workgroupId}/${nodeId}/${componentId}/student-work`,
      { headers: headers }
    );
  }

  createDummyComponentStates(workgroupIds: number[]): any[] {
    const componentStates = [];
    for (const workgroupId of workgroupIds) {
      componentStates.push(
        this.createDummyComponentState(
          workgroupId,
          'PeerChat',
          `Hello this is ${workgroupId}`,
          new Date().getTime()
        )
      );
    }
    return componentStates;
  }

  createDummyComponentState(
    workgroupId: number,
    componentType: string,
    response: string,
    timestamp: number
  ): any {
    return {
      componentType: componentType,
      studentData: {
        attachments: [],
        response: response
      },
      serverSaveTime: timestamp,
      workgroupId: workgroupId
    };
  }

  convertComponentStateToPeerChatMessage(componentState: any): PeerChatMessage {
    return new PeerChatMessage(
      componentState.workgroupId,
      componentState.studentData.response,
      componentState.serverSaveTime
    );
  }
}
