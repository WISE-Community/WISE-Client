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
    component.logic = [{ name: 'manual' }];
    component.logicThresholdCount = 0;
    component.logicThresholdPercent = 0;
    component.maxMembershipCount = 2;
    component.questionBank = [];
    return component;
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

  convertComponentStateToPeerChatMessage(componentState: any): PeerChatMessage {
    return new PeerChatMessage(
      componentState.workgroupId,
      componentState.studentData.response,
      componentState.serverSaveTime
    );
  }
}
