import { ComponentService } from '../componentService';
import { ConfigService } from '../../services/configService';
import { TeacherDataService } from '../../services/teacherDataService';
import { UtilService } from '../../services/utilService';
import { UpgradeModule } from '@angular/upgrade/static';
import { StudentDataService } from '../../services/studentDataService';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class DiscussionService extends ComponentService {
  TeacherDataService: TeacherDataService;

  constructor(
    private upgrade: UpgradeModule,
    private http: HttpClient,
    private ConfigService: ConfigService,
    protected StudentDataService: StudentDataService,
    protected UtilService: UtilService
  ) {
    super(StudentDataService, UtilService);
    if (['classroomMonitor', 'author'].includes(this.ConfigService.getMode())) {
      /*
       * In the Classroom Monitor, we need access to the TeacherDataService so we can retrieve posts
       * for all students.
       */
      this.TeacherDataService = this.upgrade.$injector.get('TeacherDataService');
    }
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
    return component;
  }

  isCompleted(component: any, componentStates: any[], componentEvents: any[], nodeEvents: any[]) {
    if (this.hasShowWorkConnectedComponentThatHasWork(component)) {
      return this.hasNodeEnteredEvent(nodeEvents);
    }
    return this.hasAnyComponentStateWithResponse(componentStates);
  }

  hasAnyComponentStateWithResponse(componentStates: any[]) {
    for (const componentState of componentStates) {
      if (componentState.studentData.response != null) {
        return true;
      }
    }
    return false;
  }

  hasShowWorkConnectedComponentThatHasWork(componentContent: any) {
    const connectedComponents = componentContent.connectedComponents;
    if (connectedComponents != null) {
      for (const connectedComponent of connectedComponents) {
        if (connectedComponent.type === 'showWork') {
          const componentStates = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
            connectedComponent.nodeId,
            connectedComponent.componentId
          );
          if (componentStates.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  hasNodeEnteredEvent(nodeEvents: any[]) {
    for (const nodeEvent of nodeEvents) {
      if (nodeEvent.event === 'nodeEntered') {
        return true;
      }
    }
    return false;
  }

  getClassmateResponses(runId: number, periodId: number, components: any[]) {
    return new Promise((resolve, reject) => {
      let params = new HttpParams()
        .set('runId', runId + '')
        .set('periodId', periodId + '')
        .set('getStudentWork', true + '')
        .set('getAnnotations', true + '');
      for (const component of components) {
        params = params.append('components', JSON.stringify(component));
      }
      const options = {
        params: params
      };
      const url = this.ConfigService.getConfigParam('studentDataURL');
      this.http
        .get(url, options)
        .toPromise()
        .then((data) => {
          resolve(data);
        });
    });
  }

  workgroupHasWorkForComponent(workgroupId: number, componentId: string) {
    return (
      this.TeacherDataService.getComponentStatesByWorkgroupIdAndComponentId(
        workgroupId,
        componentId
      ).length > 0
    );
  }

  getPostsAssociatedWithComponentIdsAndWorkgroupId(componentIds: string[], workgroupId: number) {
    let allPosts = [];
    const topLevelComponentStateIdsFound = [];
    const componentStates = this.TeacherDataService.getComponentStatesByWorkgroupIdAndComponentIds(
      workgroupId,
      componentIds
    );
    for (const componentState of componentStates) {
      const componentStateIdReplyingTo = componentState.studentData.componentStateIdReplyingTo;
      if (this.isTopLevelPost(componentState)) {
        if (
          !this.isTopLevelComponentStateIdFound(topLevelComponentStateIdsFound, componentState.id)
        ) {
          allPosts = allPosts.concat(
            this.getPostAndAllRepliesByComponentIds(componentIds, componentState.id)
          );
          topLevelComponentStateIdsFound.push(componentState.id);
        }
      } else {
        if (
          !this.isTopLevelComponentStateIdFound(
            topLevelComponentStateIdsFound,
            componentStateIdReplyingTo
          )
        ) {
          allPosts = allPosts.concat(
            this.getPostAndAllRepliesByComponentIds(componentIds, componentStateIdReplyingTo)
          );
          topLevelComponentStateIdsFound.push(componentStateIdReplyingTo);
        }
      }
    }
    return allPosts;
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

  getPostAndAllRepliesByComponentIds(componentIds: string[], componentStateId: number) {
    const postAndAllReplies = [];
    const componentStatesForComponentIds = this.TeacherDataService.getComponentStatesByComponentIds(
      componentIds
    );
    for (const componentState of componentStatesForComponentIds) {
      if (componentState.id === componentStateId) {
        postAndAllReplies.push(componentState);
      } else {
        const componentStateIdReplyingTo = componentState.studentData.componentStateIdReplyingTo;
        if (componentStateIdReplyingTo === componentStateId) {
          postAndAllReplies.push(componentState);
        }
      }
    }
    return postAndAllReplies;
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
    for (const annotation of annotations.sort(this.UtilService.sortByServerSaveTime).reverse()) {
      if (studentWorkId === annotation.studentWorkId && annotation.type === 'inappropriateFlag') {
        return annotation;
      }
    }
    return null;
  }

  getClassResponses(
    componentStates: any[],
    annotations = [],
    isStudentMode: boolean = false
  ): any[] {
    const classResponses = [];
    componentStates = componentStates.sort(this.UtilService.sortByServerSaveTime);
    for (const componentState of componentStates) {
      if (componentState.studentData.isSubmit) {
        componentState.replies = [];
        this.setUsernames(componentState);
        const latestInappropriateFlagAnnotation = this.getLatestInappropriateFlagAnnotationByStudentWorkId(
          annotations,
          componentState.id
        );
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

  setUsernames(componentState: any): void {
    const workgroupId = componentState.workgroupId;
    const usernames = this.ConfigService.getUsernamesByWorkgroupId(workgroupId);
    if (usernames.length > 0) {
      componentState.usernames = this.ConfigService.getUsernamesStringByWorkgroupId(workgroupId);
    } else if (componentState.usernamesArray != null) {
      componentState.usernames = componentState.usernamesArray
        .map(function (obj) {
          return obj.name;
        })
        .join(', ');
    } else {
      componentState.usernames = this.ConfigService.getUserIdsStringByWorkgroupId(workgroupId);
    }
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
}
