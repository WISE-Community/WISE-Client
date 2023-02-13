import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PeerGroupStudentData } from '../../../app/domain/peerGroupStudentData';
import { PeerGroup } from '../components/peerChat/PeerGroup';
import { PeerGroupMember } from '../components/peerChat/PeerGroupMember';
import { AnnotationService } from './annotationService';
import { ConfigService } from './configService';
import { PeerGroupService } from './peerGroupService';
import { StudentDataService } from './studentDataService';
import { ProjectService } from './projectService';

@Injectable()
export class StudentPeerGroupService extends PeerGroupService {
  static readonly PREVIEW_PEER_GROUP_ID = 1;

  constructor(
    private annotationService: AnnotationService,
    protected configService: ConfigService,
    protected http: HttpClient,
    private projectService: ProjectService,
    private studentDataService: StudentDataService
  ) {
    super(configService, http);
  }

  retrievePeerGroup(
    peerGroupingTag: string,
    workgroupId = this.configService.getWorkgroupId()
  ): Observable<PeerGroup> {
    if (
      this.configService.isPreview() ||
      this.configService.isAuthoring() ||
      this.configService.isSignedInUserATeacher()
    ) {
      return of(this.getPreviewPeerGroup());
    }
    return super.retrievePeerGroup(peerGroupingTag, workgroupId);
  }

  private getPreviewPeerGroup(): PeerGroup {
    let workgroupId = 1;
    let periodId = 1;
    if (!this.configService.isAuthoring()) {
      workgroupId = this.configService.getWorkgroupId();
      periodId = this.configService.getPeriodId();
    }
    return new PeerGroup(
      StudentPeerGroupService.PREVIEW_PEER_GROUP_ID,
      [new PeerGroupMember(workgroupId, periodId)],
      null
    );
  }

  retrievePeerGroupWork(
    peerGroup: PeerGroup,
    nodeId: string,
    componentId: string
  ): Observable<any> {
    if (this.configService.isPreview()) {
      return of(
        this.studentDataService.getComponentStatesByNodeIdAndComponentId(nodeId, componentId)
      );
    } else if (this.configService.isAuthoring() || this.configService.isSignedInUserATeacher()) {
      return of([]);
    } else {
      return this.http.get(`/api/peer-group/${peerGroup.id}/${nodeId}/${componentId}/student-work`);
    }
  }

  retrieveQuestionBankStudentData(
    peerGroupId: number,
    nodeId: string,
    componentId: string
  ): Observable<PeerGroupStudentData[]> {
    return this.retrieveStudentDataForFieldName(
      peerGroupId,
      nodeId,
      componentId,
      'questionBank',
      'question-bank'
    );
  }

  retrieveDynamicPromptStudentData(
    peerGroupId: number,
    nodeId: string,
    componentId: string
  ): Observable<PeerGroupStudentData[]> {
    return this.retrieveStudentDataForFieldName(
      peerGroupId,
      nodeId,
      componentId,
      'dynamicPrompt',
      'dynamic-prompt'
    );
  }

  private retrieveStudentDataForFieldName(
    peerGroupId: number,
    nodeId: string,
    componentId: string,
    fieldName: string,
    urlEnding: string
  ): Observable<PeerGroupStudentData[]> {
    if (this.configService.isPreview()) {
      return this.getPreviewPeerGroupStudentData(nodeId, componentId, fieldName);
    } else if (this.configService.isAuthoring() || this.configService.isSignedInUserATeacher()) {
      return of([]);
    } else {
      return this.http.get<PeerGroupStudentData[]>(
        `/api/peer-group/${peerGroupId}/${nodeId}/${componentId}/student-data/${urlEnding}`
      );
    }
  }

  private getPreviewPeerGroupStudentData(
    nodeId: string,
    componentId: string,
    fieldName: string
  ): Observable<PeerGroupStudentData[]> {
    const referenceComponent = this.projectService.getReferenceComponent(
      nodeId,
      componentId,
      fieldName
    );
    const studentWork = this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
      referenceComponent.nodeId,
      referenceComponent.componentId
    );
    if (studentWork == null) {
      return of([]);
    } else {
      const peerGroupStudentData = new PeerGroupStudentData(
        {
          id: this.configService.getWorkgroupId(),
          periodId: this.configService.getPeriodId()
        },
        studentWork,
        this.annotationService.getLatestScoreAnnotation(
          referenceComponent.nodeId,
          referenceComponent.componentId,
          this.configService.getWorkgroupId()
        )
      );
      return of([peerGroupStudentData]);
    }
  }

  retrieveStudentWork(
    peerGroup: PeerGroup,
    nodeId: string,
    componentId: string,
    showWorkNodeId: string,
    showWorkComponentId: string
  ): Observable<any> {
    if (this.configService.isPreview()) {
      const studentWork = [];
      const latestComponentState = this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
        showWorkNodeId,
        showWorkComponentId
      );
      if (latestComponentState != null) {
        studentWork.push(latestComponentState);
      }
      return of(studentWork);
    } else if (this.configService.isAuthoring() || this.configService.isSignedInUserATeacher()) {
      return of([]);
    } else {
      return this.http.get(
        `/api/classmate/peer-group-work/${peerGroup.id}/${nodeId}/${componentId}/${showWorkNodeId}/${showWorkComponentId}`
      );
    }
  }
}
