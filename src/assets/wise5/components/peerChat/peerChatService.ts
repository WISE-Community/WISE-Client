import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../../services/configService';
import { StudentDataService } from '../../services/studentDataService';
import { UtilService } from '../../services/utilService';
import { ComponentService } from '../componentService';

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
    return component;
  }

  retrievePeerChatWorkgroups(nodeId: string, componentId: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.ConfigService.isPreview()) {
      this.ConfigService.config.runId = 1;
    }
    const params = new HttpParams()
      .set('componentId', componentId)
      .set('nodeId', nodeId)
      .set('periodId', this.ConfigService.getPeriodId())
      .set('runId', this.ConfigService.getRunId())
      .set('workgroupId', this.ConfigService.getWorkgroupId());
    const requestChatWorkgroupsURL = '/api/peer/workgroups';
    return this.http.get(requestChatWorkgroupsURL, { headers: headers, params: params });
  }

  retrievePeerChatMessages(
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
    const requestChatMessagesURL = '/api/peer/messages';
    return this.http.get(requestChatMessagesURL, { headers: headers, params: params });
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
}
