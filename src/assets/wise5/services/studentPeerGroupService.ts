import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PeerGroupStudentData } from '../../../app/domain/peerGroupStudentData';
import { PeerGroup } from '../components/peerChat/PeerGroup';
import { AnnotationService } from './annotationService';
import { ConfigService } from './configService';
import { PeerGroupService } from './peerGroupService';
import { StudentDataService } from './studentDataService';
import { ProjectService } from './projectService';

@Injectable()
export class StudentPeerGroupService extends PeerGroupService {
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
    if (this.configService.isPreview()) {
      return of(this.getPreviewPeerGroup());
    }
    return super.retrievePeerGroup(peerGroupingTag, workgroupId);
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
    }
    return super.retrievePeerGroupWork(peerGroup, nodeId, componentId);
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
    fieldName: 'dynamicPrompt' | 'questionBank',
    urlEnding: string
  ): Observable<PeerGroupStudentData[]> {
    if (this.configService.isPreview()) {
      return this.getPreviewPeerGroupStudentData(nodeId, componentId, fieldName);
    }
    return this.http.get<PeerGroupStudentData[]>(
      `/api/peer-group/${peerGroupId}/${nodeId}/${componentId}/student-data/${urlEnding}`
    );
  }

  private getPreviewPeerGroupStudentData(
    nodeId: string,
    componentId: string,
    fieldName: 'dynamicPrompt' | 'questionBank'
  ): Observable<PeerGroupStudentData[]> {
    const referenceComponent = this.projectService.getReferenceComponentForField(
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
      const latestComponentState = this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
        showWorkNodeId,
        showWorkComponentId
      );
      return latestComponentState != null ? of([latestComponentState]) : of([]);
    }
    return super.retrieveStudentWork(
      peerGroup,
      nodeId,
      componentId,
      showWorkNodeId,
      showWorkComponentId
    );
  }

  retrievePeerGroupAnnotations(
    peerGroup: PeerGroup,
    nodeId: string,
    componentId: string
  ): Observable<any> {
    if (this.configService.isPreview()) {
      return of([]);
    }
    return this.http.get(`/api/peer-group/${peerGroup.id}/${nodeId}/${componentId}/annotations`);
  }
}
