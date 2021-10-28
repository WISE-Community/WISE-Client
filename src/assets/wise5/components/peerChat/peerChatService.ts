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
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.ConfigService.isPreview()) {
      this.ConfigService.config.runId = 1;
    }
    const runId = this.ConfigService.getRunId();
    const workgroupId = this.ConfigService.getWorkgroupId();
    const requestChatWorkgroupsURL = `/api/peer-group/run/${runId}/workgroup/${workgroupId}/node-id/${nodeId}/component-id/${componentId}`;
    return this.http.get(requestChatWorkgroupsURL, { headers: headers });
  }

  retrievePeerWorkFromComponent(
    nodeId: string,
    componentId: string,
    workgroupIds: number[]
  ): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.ConfigService.isPreview()) {
      this.ConfigService.config.runId = 1;
    }
    let params = new HttpParams()
      .set('componentId', componentId)
      .set('nodeId', nodeId)
      .set('periodId', this.ConfigService.getPeriodId())
      .set('runId', this.ConfigService.getRunId());
    workgroupIds.forEach((workgroupId: number) => {
      params = params.append('workgroupIds', `${workgroupId}`);
    });
    const requestPeerWorkURL = '/api/peer/work';
    return this.http.get(requestPeerWorkURL, { headers: headers, params: params });
  }

  retrievePeerChatMessages(peerGroupId: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.ConfigService.isPreview()) {
      this.ConfigService.config.runId = 1;
    }
    const requestChatMessagesURL = `/api/peer-group/${peerGroupId}/data`;
    return this.http.get(requestChatMessagesURL, { headers: headers });
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
