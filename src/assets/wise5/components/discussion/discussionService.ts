import { ComponentService } from '../componentService';
import { ConfigService } from '../../services/configService';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { serverSaveTimeComparator } from '../../common/object/object';
import { Anonymizer } from './Anonymizer';

@Injectable()
export class DiscussionService extends ComponentService {
  constructor(
    protected configService: ConfigService,
    protected http: HttpClient
  ) {
    super();
  }

  getComponentTypeLabel(): string {
    return $localize`Discussion`;
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'Discussion';
    component.prompt = '';
    component.isStudentAttachmentEnabled = true;
    component.gateClassmateResponses = true;
    component.anonymizeResponses = false;
    component.ai = {
      teacherSummarySystemPrompt: this.getDefaultTeacherSummarySystemPrompt()
    };
    return component;
  }

  isCompleted(component: any, componentStates: any[], nodeEvents: any[], node: any): boolean {
    throw new Error('No longer used');
  }

  isCompletedV2(node: any, component: any, studentData: any): boolean {
    if (this.hasShowWorkConnectedComponentThatHasWork(component, studentData)) {
      const nodeEvents = studentData.events.filter((event) => event.nodeId == node.id);
      return this.hasNodeEnteredEvent(nodeEvents);
    }
    const componentStates = studentData.componentStates.filter(
      (componentState) =>
        componentState.nodeId === node.id && componentState.componentId == component.id
    );
    return this.hasAnyComponentStateWithResponse(componentStates);
  }

  private hasAnyComponentStateWithResponse(componentStates: any[]): boolean {
    return componentStates.some((componentState) => componentState.studentData.response != null);
  }

  private hasShowWorkConnectedComponentThatHasWork(
    componentContent: any,
    studentData: any
  ): boolean {
    const connectedComponents = componentContent.connectedComponents;
    if (connectedComponents != null) {
      for (const connectedComponent of connectedComponents) {
        if (connectedComponent.type === 'showWork') {
          if (this.hasComponentStateForConnectedComponent(connectedComponent, studentData)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private hasComponentStateForConnectedComponent(
    connectedComponent: any,
    studentData: any
  ): boolean {
    return studentData.componentStates.some(
      (componentState) =>
        componentState.nodeId === connectedComponent.nodeId &&
        componentState.componentId === connectedComponent.componentId
    );
  }

  getClassmateResponsesFromComponents(
    runId: number,
    periodId: number,
    components: any[]
  ): Observable<any> {
    const requests = components.map((component) =>
      this.getClassmateResponses(runId, periodId, component.nodeId, component.componentId)
    );
    return forkJoin(requests).pipe(
      map((responses: any[]) => {
        return this.combineClassmatesResponses(responses);
      })
    );
  }

  private combineClassmatesResponses(responses: any[]): any {
    const studentWork = [];
    const annotations = [];
    responses.forEach((response) => {
      studentWork.push(...response.studentWork);
      annotations.push(...response.annotations);
    });
    return {
      annotations: annotations,
      studentWork: studentWork
    };
  }

  getClassmateResponses(
    runId: number,
    periodId: number,
    nodeId: string,
    componentId: string
  ): Observable<any> {
    const studentWorkRequest = this.http.get(
      `/api/classmate/discussion/student-work/${runId}/${periodId}/${nodeId}/${componentId}`
    );
    const annotationsRequest = this.http.get(
      `/api/classmate/discussion/annotations/${runId}/${periodId}/${nodeId}/${componentId}`
    );
    return forkJoin([studentWorkRequest, annotationsRequest]).pipe(
      map((response) => {
        return { studentWork: response[0], annotations: response[1] };
      })
    );
  }

  isTopLevelPost(componentState: any) {
    return componentState.studentData.componentStateIdReplyingTo == null;
  }

  isTopLevelComponentStateIdFound(
    topLevelComponentStateIdsFound: string[],
    componentStateId: string
  ) {
    return topLevelComponentStateIdsFound.indexOf(componentStateId) !== -1;
  }

  componentUsesSaveButton() {
    return false;
  }

  componentUsesSubmitButton() {
    return false;
  }

  componentStateHasStudentWork(componentState: any, componentContent: any) {
    if (this.isStudentWorkHasAttachment(componentState)) {
      return true;
    }
    if (this.isComponentHasStarterSentence(componentContent)) {
      return (
        this.isStudentWorkHasText(componentState) &&
        this.isStudentResponseDifferentFromStarterSentence(componentState, componentContent)
      );
    } else {
      return this.isStudentWorkHasText(componentState);
    }
  }

  isComponentHasStarterSentence(componentContent: any) {
    const starterSentence = componentContent.starterSentence;
    return starterSentence != null && starterSentence !== '';
  }

  isStudentResponseDifferentFromStarterSentence(componentState: any, componentContent: any) {
    const response = componentState.studentData.response;
    const starterSentence = componentContent.starterSentence;
    return response !== starterSentence;
  }

  isStudentWorkHasText(componentState: any) {
    const response = componentState.studentData.response;
    return response != null && response !== '';
  }

  isStudentWorkHasAttachment(componentState: any) {
    const attachments = componentState.studentData.attachments;
    return attachments != null && attachments.length > 0;
  }

  threadHasPostFromComponentAndWorkgroupId(
    componentState: any,
    componentId: string,
    workgroupId: number
  ): any {
    if (componentState.componentId === componentId && componentState.workgroupId === workgroupId) {
      return true;
    }
    for (const replyComponentState of componentState.replies) {
      if (
        replyComponentState.componentId === componentId &&
        replyComponentState.workgroupId === workgroupId
      ) {
        return true;
      }
    }
    return false;
  }

  getLatestInappropriateFlagAnnotationByStudentWorkId(
    annotations: any[] = [],
    studentWorkId: number
  ): any {
    for (const annotation of annotations.sort(serverSaveTimeComparator).reverse()) {
      if (studentWorkId === annotation.studentWorkId && annotation.type === 'inappropriateFlag') {
        return annotation;
      }
    }
    return null;
  }

  getClassResponses(
    componentStates: any[],
    annotations = [],
    myWorkgroupId: number,
    isStudentMode: boolean = false,
    anonymizeResponses: boolean = false
  ): any[] {
    const classResponses = [];
    componentStates = componentStates.sort(serverSaveTimeComparator);
    for (const componentState of componentStates) {
      if (componentState.studentData.isSubmit) {
        componentState.replies = [];
        this.setUsernames(componentState, myWorkgroupId, anonymizeResponses);
        const latestInappropriateFlagAnnotation =
          this.getLatestInappropriateFlagAnnotationByStudentWorkId(annotations, componentState.id);
        if (isStudentMode) {
          if (
            latestInappropriateFlagAnnotation == null ||
            !this.isInappropriateFlagDeleteAnnotation(latestInappropriateFlagAnnotation)
          ) {
            classResponses.push(componentState);
          }
        } else {
          if (latestInappropriateFlagAnnotation != null) {
            componentState.latestInappropriateFlagAnnotation = latestInappropriateFlagAnnotation;
          }
          classResponses.push(componentState);
        }
      }
    }
    return classResponses;
  }

  isInappropriateFlagDeleteAnnotation(annotation: any): boolean {
    return annotation.data.action === 'Delete';
  }

  setUsernames(
    componentState: any,
    myWorkgroupId: number,
    anonymizeResponses: boolean = false
  ): void {
    const { workgroupId } = componentState;
    if (anonymizeResponses && workgroupId !== myWorkgroupId) {
      this.setAnonymousUsername(componentState);
      return;
    }
    const usernames = this.configService.getUsernamesByWorkgroupId(workgroupId);
    if (usernames.length > 0) {
      componentState.usernames = this.configService.getUsernamesStringByWorkgroupId(workgroupId);
    } else if (componentState.usernamesArray != null) {
      componentState.usernames = componentState.usernamesArray
        .map(function (obj) {
          return obj.name;
        })
        .join(', ');
    } else {
      componentState.usernames = this.configService.getUserIdsStringByWorkgroupId(workgroupId);
    }
  }

  private setAnonymousUsername(componentState: any): void {
    const { workgroupId, periodId } = componentState;
    const workgroupIds = this.configService
      .getClassmateUserInfos()
      .filter((userInfo) => userInfo.periodId === periodId)
      .map((userInfo) => userInfo.workgroupId)
      .concat(workgroupId);
    componentState.usernames = new Anonymizer(workgroupId, workgroupIds).getName();
  }

  getResponsesMap(componentStates: any[]): any {
    const responsesMap: any = {};
    for (const componentState of componentStates) {
      responsesMap[componentState.id] = componentState;
    }
    for (const componentState of componentStates) {
      const componentStateIdReplyingTo = componentState.studentData.componentStateIdReplyingTo;
      if (componentStateIdReplyingTo) {
        if (
          responsesMap[componentStateIdReplyingTo] &&
          responsesMap[componentStateIdReplyingTo].replies
        ) {
          responsesMap[componentStateIdReplyingTo].replies.push(componentState);
        }
      }
    }
    return responsesMap;
  }

  /**
   * Get the level 1 responses which are posts that are not a reply to another response.
   * @return an object containing responses that are not a reply to another response
   */
  getLevel1Responses(
    classResponses: any[],
    componentId: string,
    workgroupId: number,
    isGradingMode: boolean = false
  ): any {
    const allResponses = [];
    const oddResponses = [];
    const evenResponses = [];
    for (const [index, classResponse] of Object.entries(classResponses)) {
      if (classResponse.studentData.componentStateIdReplyingTo == null) {
        if (
          isGradingMode &&
          !this.threadHasPostFromComponentAndWorkgroupId(classResponse, componentId, workgroupId)
        ) {
          continue;
        }
        if (Number(index) % 2 === 0) {
          evenResponses.push(classResponse);
        } else {
          oddResponses.push(classResponse);
        }
        allResponses.push(classResponse);
      }
    }
    return {
      all: allResponses.reverse(),
      col1: oddResponses.reverse(),
      col2: evenResponses.reverse()
    };
  }

  getDefaultTeacherSummarySystemPrompt(): string {
    return `You are a teacher who is summarizing students' discussion threads, which include posts and replies to the following question: "$QUESTION$".
    Each thread is in the format: $RESPONSE_FORMAT$.
    In the same language as the question, provide a summary of the threads in 100 words or less.`;
  }
}
