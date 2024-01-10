import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { generateRandomKey } from '../../../common/string/string';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { NotificationService } from '../../../services/notificationService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { StudentAssetRequest } from '../../../vle/studentAsset/StudentAssetRequest';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { ComponentStateRequest } from '../../ComponentStateRequest';
import { DiscussionService } from '../discussionService';

@Component({
  selector: 'discussion-student',
  templateUrl: 'discussion-student.component.html',
  styleUrls: ['discussion-student.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiscussionStudent extends ComponentStudent {
  classResponses: any[] = [];
  componentStateIdReplyingTo: number;
  newResponse: string = '';
  responsesMap: any = {};
  retrievedClassmateResponses: boolean = false;
  studentResponse: string = '';
  topLevelResponses: any = {};

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected dialog: MatDialog,
    private DiscussionService: DiscussionService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private NotificationService: NotificationService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      dialog,
      NodeService,
      NotebookService,
      StudentAssetService,
      StudentDataService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.ConfigService.isPreview()) {
      let componentStates = [];
      if (this.component.hasConnectedComponent()) {
        for (const connectedComponent of this.componentContent.connectedComponents) {
          componentStates = componentStates.concat(
            this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
              connectedComponent.nodeId,
              connectedComponent.componentId
            )
          );
        }
        if (this.isConnectedComponentImportWorkMode()) {
          componentStates = componentStates.concat(
            this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
              this.nodeId,
              this.componentId
            )
          );
        }
      } else {
        componentStates = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
          this.nodeId,
          this.componentId
        );
      }
      this.setClassResponses(componentStates);
    } else {
      if (this.component.hasConnectedComponent()) {
        const retrieveWorkFromTheseComponents = [];
        for (const connectedComponent of this.componentContent.connectedComponents) {
          retrieveWorkFromTheseComponents.push({
            nodeId: connectedComponent.nodeId,
            componentId: connectedComponent.componentId
          });
        }
        if (this.isConnectedComponentImportWorkMode()) {
          retrieveWorkFromTheseComponents.push({
            nodeId: this.nodeId,
            componentId: this.componentId
          });
        }
        this.getClassmateResponsesFromComponents(retrieveWorkFromTheseComponents);
      } else {
        if (this.isClassmateResponsesGated()) {
          const componentState = this.componentState;
          if (componentState != null) {
            if (
              this.DiscussionService.componentStateHasStudentWork(
                componentState,
                this.componentContent
              )
            ) {
              this.getClassmateResponses();
            }
          }
        } else {
          this.getClassmateResponses();
        }
      }
    }
    this.disableComponentIfNecessary();
    this.registerStudentWorkReceivedListener();
    this.broadcastDoneRenderingComponent();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  isConnectedComponentShowWorkMode() {
    if (this.component.hasConnectedComponent()) {
      let isShowWorkMode = true;
      for (const connectedComponent of this.componentContent.connectedComponents) {
        isShowWorkMode = isShowWorkMode && connectedComponent.type === 'showWork';
      }
      return isShowWorkMode;
    }
    return false;
  }

  isConnectedComponentImportWorkMode() {
    if (this.component.hasConnectedComponent()) {
      let isImportWorkMode = true;
      for (const connectedComponent of this.componentContent.connectedComponents) {
        isImportWorkMode = isImportWorkMode && connectedComponent.type === 'importWork';
      }
      return isImportWorkMode;
    }
    return false;
  }

  handleSubmitButtonClicked(componentStateReplyingTo: any = null): void {
    if (componentStateReplyingTo && componentStateReplyingTo.replyText) {
      const componentState = componentStateReplyingTo;
      const componentStateId = componentState.id;
      this.studentResponse = componentState.replyText;
      this.componentStateIdReplyingTo = componentStateId;
      this.isSubmit = true;
      this.isDirty = true;
      componentStateReplyingTo.replyText = null;
    } else {
      this.studentResponse = this.newResponse;
      this.isSubmit = true;
    }
    this.StudentDataService.broadcastComponentSubmitTriggered({
      nodeId: this.nodeId,
      componentId: this.componentId
    });
    if (this.isPreviewMode()) {
      this.saveForAuthoringPreviewMode('submit');
    }
  }

  handleStudentWorkSavedToServerAdditionalProcessing(componentState: any): void {
    this.clearComponentValues();
    if (
      !this.isPreviewMode() &&
      this.isClassmateResponsesGated() &&
      !this.retrievedClassmateResponses
    ) {
      this.getClassmateResponses();
    } else {
      this.addClassResponse(componentState);
    }
    this.disableComponentIfNecessary();
    this.sendPostToStudentsInThread(componentState);
    this.isSubmit = null;
  }

  sendPostToStudentsInThread(componentState) {
    const studentData = componentState.studentData;
    if (studentData != null && this.responsesMap != null) {
      const componentStateIdReplyingTo = studentData.componentStateIdReplyingTo;
      if (componentStateIdReplyingTo != null) {
        const fromWorkgroupId = componentState.workgroupId;
        const notificationType = 'DiscussionReply';
        const nodeId = componentState.nodeId;
        const componentId = componentState.componentId;
        const usernamesArray = this.ConfigService.getUsernamesByWorkgroupId(fromWorkgroupId);
        const usernames = usernamesArray
          .map((obj) => {
            return obj.name;
          })
          .join(', ');
        const notificationMessage = $localize`${usernames} replied to a discussion you were in!`;
        const workgroupsNotifiedSoFar = [];
        if (this.responsesMap[componentStateIdReplyingTo] != null) {
          this.sendPostToThreadCreator(
            componentStateIdReplyingTo,
            notificationType,
            nodeId,
            componentId,
            fromWorkgroupId,
            notificationMessage,
            workgroupsNotifiedSoFar
          );
          this.sendPostToThreadRepliers(
            componentStateIdReplyingTo,
            notificationType,
            nodeId,
            componentId,
            fromWorkgroupId,
            notificationMessage,
            workgroupsNotifiedSoFar
          );
        }
      }
    }
  }

  sendPostToThreadCreator(
    componentStateIdReplyingTo,
    notificationType,
    nodeId,
    componentId,
    fromWorkgroupId,
    notificationMessage,
    workgroupsNotifiedSoFar
  ) {
    const originalPostComponentState = this.responsesMap[componentStateIdReplyingTo];
    const toWorkgroupId = originalPostComponentState.workgroupId;
    if (toWorkgroupId != null && toWorkgroupId !== fromWorkgroupId) {
      const notification = this.NotificationService.createNewNotification(
        this.ConfigService.getRunId(),
        this.ConfigService.getPeriodId(),
        notificationType,
        nodeId,
        componentId,
        fromWorkgroupId,
        toWorkgroupId,
        notificationMessage
      );
      this.NotificationService.saveNotificationToServer(notification);
      workgroupsNotifiedSoFar.push(toWorkgroupId);
    }
  }

  sendPostToThreadRepliers(
    componentStateIdReplyingTo,
    notificationType,
    nodeId,
    componentId,
    fromWorkgroupId,
    notificationMessage,
    workgroupsNotifiedSoFar
  ) {
    if (this.responsesMap[componentStateIdReplyingTo].replies != null) {
      const replies = this.responsesMap[componentStateIdReplyingTo].replies;
      for (let r = 0; r < replies.length; r++) {
        const reply = replies[r];
        const toWorkgroupId = reply.workgroupId;
        if (
          toWorkgroupId != null &&
          toWorkgroupId !== fromWorkgroupId &&
          workgroupsNotifiedSoFar.indexOf(toWorkgroupId) === -1
        ) {
          const notification = this.NotificationService.createNewNotification(
            this.ConfigService.getRunId(),
            this.ConfigService.getPeriodId(),
            notificationType,
            nodeId,
            componentId,
            fromWorkgroupId,
            toWorkgroupId,
            notificationMessage
          );
          this.NotificationService.saveNotificationToServer(notification);
          workgroupsNotifiedSoFar.push(toWorkgroupId);
        }
      }
    }
  }

  protected doAttachStudentAsset(studentAssetRequest: StudentAssetRequest): void {
    this.attachStudentAsset(studentAssetRequest.asset);
  }

  registerStudentWorkReceivedListener() {
    this.subscriptions.add(
      this.StudentDataService.studentWorkReceived$.subscribe((componentState) => {
        if (
          (this.isWorkFromThisComponent(componentState) ||
            this.isFromConnectedComponent(componentState)) &&
          this.isWorkFromClassmate(componentState) &&
          this.retrievedClassmateResponses
        ) {
          this.addClassResponse(componentState);
        }
      })
    );
  }

  isWorkFromThisComponent(componentState) {
    return this.isForThisComponent(componentState);
  }

  getClassmateResponsesFromComponents(components: any[] = []): void {
    const runId = this.ConfigService.getRunId();
    const periodId = this.ConfigService.getPeriodId();
    this.DiscussionService.getClassmateResponsesFromComponents(
      runId,
      periodId,
      components
    ).subscribe((response: any) => {
      this.setClassResponses(response.studentWork, response.annotations);
    });
  }

  getClassmateResponses(): void {
    const runId = this.ConfigService.getRunId();
    const periodId = this.ConfigService.getPeriodId();
    this.DiscussionService.getClassmateResponses(
      runId,
      periodId,
      this.nodeId,
      this.componentId
    ).subscribe((response: any) => {
      this.setClassResponses(response.studentWork, response.annotations);
    });
  }

  submitButtonClicked() {
    this.isSubmit = true;
    this.disableComponentIfNecessary();
    this.handleSubmitButtonClicked();
  }

  studentDataChanged() {
    this.setIsDirty(true);
    this.createComponentStateAndBroadcast('change');
  }

  /**
   * Create a new component state populated with the student data
   * @param action the action that is triggering creating of this component state
   * e.g. 'submit', 'save', 'change'
   * @return a promise that will return a component state
   */
  createComponentState(action) {
    const componentState: any = this.createNewComponentState();
    const studentData: any = {
      response: this.studentResponse,
      attachments: this.attachments
    };
    if (this.componentStateIdReplyingTo != null) {
      studentData.componentStateIdReplyingTo = this.componentStateIdReplyingTo;
    }
    componentState.studentData = studentData;
    componentState.componentType = 'Discussion';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    componentState.isSubmit = this.isSubmit;
    if (
      (this.ConfigService.isPreview() && !this.componentStateIdReplyingTo) ||
      this.mode === 'authoring'
    ) {
      componentState.id = generateRandomKey();
    }
    if (this.isSubmit) {
      componentState.studentData.isSubmit = this.isSubmit;
      this.isSubmit = false;
      if (this.mode === 'authoring') {
        if (this.StudentDataService.studentData == null) {
          this.StudentDataService.studentData = {
            componentStates: [],
            events: [],
            annotations: []
          };
        }
        this.StudentDataService.studentData.componentStates.push(componentState);
        const componentStates = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
          this.nodeId,
          this.componentId
        );
        this.setClassResponses(componentStates);
        this.clearComponentValues();
        this.isDirty = false;
      }
    }
    return new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
  }

  clearComponentValues() {
    this.studentResponse = '';
    this.newResponse = '';
    this.attachments = [];
    this.componentStateIdReplyingTo = null;
  }

  disableComponentIfNecessary() {
    super.disableComponentIfNecessary();
    if (this.component.hasConnectedComponent()) {
      for (const connectedComponent of this.componentContent.connectedComponents) {
        if (connectedComponent.type === 'showWork') {
          this.isDisabled = true;
        }
      }
    }
  }

  showSaveButton() {
    return this.componentContent.showSaveButton;
  }

  showSubmitButton() {
    return this.componentContent.showSubmitButton;
  }

  isClassmateResponsesGated() {
    return this.componentContent.gateClassmateResponses;
  }

  setClassResponses(componentStates: any[], annotations: any[] = []): void {
    const isStudentMode = true;
    this.classResponses = this.DiscussionService.getClassResponses(
      componentStates,
      annotations,
      isStudentMode
    );
    this.responsesMap = this.DiscussionService.getResponsesMap(this.classResponses);
    this.topLevelResponses = this.DiscussionService.getLevel1Responses(
      this.classResponses,
      this.componentId,
      this.workgroupId
    );
    this.retrievedClassmateResponses = true;
  }

  addClassResponse(componentState: any): void {
    if (componentState.studentData.isSubmit) {
      this.DiscussionService.setUsernames(componentState);
      componentState.replies = [];
      this.classResponses.push(componentState);
      this.addResponseToResponsesMap(this.responsesMap, componentState);
      this.topLevelResponses = this.DiscussionService.getLevel1Responses(
        this.classResponses,
        this.componentId,
        this.workgroupId
      );
    }
  }

  addResponseToResponsesMap(responsesMap: any, componentState: any): void {
    responsesMap[componentState.id] = componentState;
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

  shouldCreateComponentState(request: ComponentStateRequest): boolean {
    return this.isDirty && request.isSubmit;
  }
}
