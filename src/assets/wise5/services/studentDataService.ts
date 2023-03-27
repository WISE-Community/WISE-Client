'use strict';

import { Injectable } from '@angular/core';
import { ConfigService } from './configService';
import { AnnotationService } from './annotationService';
import { ProjectService } from './projectService';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { DataService } from '../../../app/services/data.service';
import { ComponentServiceLookupService } from './componentServiceLookupService';
import { RandomKeyService } from './randomKeyService';

@Injectable()
export class StudentDataService extends DataService {
  dummyStudentWorkId: number = 1;
  maxScore: any = null;
  nodeStatuses: any = {};
  previousStep = null;
  runStatus: any = null;
  saveToServerRequestCount: number = 0;
  stackHistory = []; // array of node id's
  studentData: any = {
    componentStates: [],
    events: [],
    annotations: []
  };
  visitedNodesHistory = [];

  private nodeClickLockedSource: Subject<any> = new Subject<any>();
  public nodeClickLocked$: Observable<any> = this.nodeClickLockedSource.asObservable();
  private componentDirtySource: Subject<boolean> = new Subject<boolean>();
  public componentDirty$: Observable<any> = this.componentDirtySource.asObservable();
  private componentSaveTriggeredSource: Subject<boolean> = new Subject<boolean>();
  public componentSaveTriggered$: Observable<any> = this.componentSaveTriggeredSource.asObservable();
  private componentSubmitDirtySource: Subject<boolean> = new Subject<boolean>();
  public componentSubmitDirty$: Observable<any> = this.componentSubmitDirtySource.asObservable();
  private componentSubmitTriggeredSource: Subject<boolean> = new Subject<boolean>();
  public componentSubmitTriggered$: Observable<any> = this.componentSubmitTriggeredSource.asObservable();
  private componentStudentDataSource: Subject<any> = new Subject<any>();
  public componentStudentData$: Observable<any> = this.componentStudentDataSource.asObservable();
  private studentWorkSavedToServerSource: Subject<any> = new Subject<any>();
  public studentWorkSavedToServer$: Observable<any> = this.studentWorkSavedToServerSource.asObservable();
  private navItemIsExpandedSource: Subject<any> = new Subject<any>();
  public navItemIsExpanded$: Observable<any> = this.navItemIsExpandedSource.asObservable();
  private nodeStatusesChangedSource: Subject<void> = new Subject<void>();
  public nodeStatusesChanged$: Observable<void> = this.nodeStatusesChangedSource.asObservable();
  private updateNodeStatusesSource: Subject<void> = new Subject<void>();
  public updateNodeStatuses$: Observable<void> = this.updateNodeStatusesSource.asObservable();

  constructor(
    public http: HttpClient,
    private AnnotationService: AnnotationService,
    private componentServiceLookupService: ComponentServiceLookupService,
    private ConfigService: ConfigService,
    protected ProjectService: ProjectService
  ) {
    super(ProjectService);
  }

  broadcastComponentStudentData(componentStudentData: any) {
    this.componentStudentDataSource.next(componentStudentData);
  }

  retrieveStudentData() {
    this.nodeStatuses = {};
    if (this.ConfigService.isPreview()) {
      this.retrieveStudentDataForPreview();
    } else {
      return this.retrieveStudentDataForSignedInStudent();
    }
  }

  retrieveStudentDataForPreview() {
    this.studentData = {
      componentStates: [],
      events: [],
      annotations: [],
      username: $localize`Preview Student`,
      userId: '0'
    };
    this.AnnotationService.setAnnotations(this.studentData.annotations);
    this.populateHistories(this.studentData.events);
    this.updateNodeStatuses();
  }

  updateNodeStatuses(): void {
    this.updateNodeStatusesSource.next();
  }

  getNodeStatusByNodeId(nodeId: string): any {
    return this.nodeStatuses[nodeId];
  }

  retrieveStudentDataForSignedInStudent() {
    const params = new HttpParams()
      .set('runId', this.ConfigService.getRunId())
      .set('workgroupId', this.ConfigService.getWorkgroupId() + '')
      .set('getStudentWork', true + '')
      .set('getEvents', true + '')
      .set('getAnnotations', true + '')
      .set('toWorkgroupId', this.ConfigService.getWorkgroupId());
    const options = {
      params: params
    };
    return this.http
      .get(this.ConfigService.getConfigParam('studentDataURL'), options)
      .toPromise()
      .then((resultData) => {
        return this.handleStudentDataResponse(resultData);
      });
  }

  handleStudentDataResponse(resultData) {
    this.studentData = {
      componentStates: []
    };
    const studentWorkList = resultData.studentWorkList;
    for (const studentWork of studentWorkList) {
      if (studentWork.componentId != null) {
        this.studentData.componentStates.push(studentWork);
      }
    }
    this.studentData.events = resultData.events;
    this.studentData.annotations = resultData.annotations;
    this.AnnotationService.setAnnotations(this.studentData.annotations);
    this.populateHistories(this.studentData.events);
    this.updateNodeStatuses();
    return this.studentData;
  }

  retrieveRunStatus() {
    if (this.ConfigService.isPreview()) {
      this.runStatus = {
        periods: []
      };
    } else {
      const params = new HttpParams().set('runId', this.ConfigService.getConfigParam('runId'));
      const options = {
        params: params
      };
      return this.http
        .get(this.ConfigService.getConfigParam('runStatusURL'), options)
        .toPromise()
        .then((runStatus: any) => {
          this.runStatus = runStatus;
          if (this.runStatus != null && this.runStatus.periods == null) {
            this.runStatus.periods = [];
          }
        });
    }
  }

  broadcastNodeStatusesChanged() {
    this.maxScore = this.getMaxScore();
    this.nodeStatusesChangedSource.next();
  }

  isNodeVisitedAfterTimestamp(event, nodeId, timestamp) {
    return (
      event.nodeId == nodeId && event.event === 'nodeEntered' && event.clientSaveTime > timestamp
    );
  }

  hasWorkCreatedAfterTimestamp(nodeId, componentId, timestamp) {
    const componentState = this.getLatestComponentStateByNodeIdAndComponentId(nodeId, componentId);
    return componentState != null && componentState.clientSaveTime > timestamp;
  }

  getBranchPathTakenEventsByNodeId(fromNodeId) {
    const branchPathTakenEvents = [];
    for (const event of this.studentData.events) {
      if (fromNodeId === event.nodeId && 'branchPathTaken' === event.event) {
        branchPathTakenEvents.push(event);
      }
    }
    return branchPathTakenEvents;
  }

  getScoreValueFromScoreAnnotation(scoreAnnotation: any, scoreId: string): number {
    if (scoreId == null) {
      return this.AnnotationService.getScoreValueFromScoreAnnotation(scoreAnnotation);
    } else {
      return this.AnnotationService.getSubScoreValueFromScoreAnnotation(scoreAnnotation, scoreId);
    }
  }

  isScoreInExpectedScores(expectedScores, score) {
    return (
      expectedScores.indexOf(score) != -1 ||
      (score != null && expectedScores.indexOf(score.toString()) != -1)
    );
  }

  getNotebookItemsByNodeId(notebook, nodeId) {
    const notebookItemsByNodeId = [];
    for (const notebookItem of notebook.allItems) {
      if (notebookItem.nodeId === nodeId) {
        notebookItemsByNodeId.push(notebookItem);
      }
    }
    return notebookItemsByNodeId;
  }

  populateHistories(events) {
    this.stackHistory = [];
    this.visitedNodesHistory = [];
    for (const event of events) {
      if (event.event === 'nodeEntered') {
        this.updateStackHistory(event.nodeId);
        this.updateVisitedNodesHistory(event.nodeId);
      }
    }
  }

  getStackHistoryAtIndex(index) {
    if (index < 0) {
      index = this.stackHistory.length + index;
    }
    if (this.stackHistory.length > 0) {
      return this.stackHistory[index];
    }
    return null;
  }

  getStackHistory() {
    return this.stackHistory;
  }

  updateStackHistory(nodeId) {
    const indexOfNodeId = this.stackHistory.indexOf(nodeId);
    if (indexOfNodeId === -1) {
      this.stackHistory.push(nodeId);
    } else {
      this.stackHistory.splice(indexOfNodeId + 1, this.stackHistory.length);
    }
  }

  updateVisitedNodesHistory(nodeId) {
    const indexOfNodeId = this.visitedNodesHistory.indexOf(nodeId);
    if (indexOfNodeId === -1) {
      this.visitedNodesHistory.push(nodeId);
    }
  }

  getVisitedNodesHistory() {
    return this.visitedNodesHistory;
  }

  isNodeVisited(nodeId) {
    const visitedNodesHistory = this.visitedNodesHistory;
    const indexOfNodeId = visitedNodesHistory.indexOf(nodeId);
    return indexOfNodeId !== -1;
  }

  createComponentState() {
    return {
      timestamp: Date.parse(new Date().toString())
    };
  }

  addComponentState(componentState) {
    this.studentData.componentStates.push(componentState);
  }

  addEvent(event) {
    this.studentData.events.push(event);
  }

  addAnnotation(annotation) {
    this.studentData.annotations.push(annotation);
  }

  saveComponentEvent(component, category, event, data) {
    if (component == null || category == null || event == null) {
      alert(
        $localize`StudentDataService.saveComponentEvent: component, category, event args must not be null`
      );
      return;
    }
    const context = 'Component';
    const nodeId = component.nodeId;
    const componentId = component.componentId;
    const componentType = component.componentType;
    if (nodeId == null || componentId == null || componentType == null) {
      alert(
        $localize`StudentDataService.saveComponentEvent: nodeId, componentId, componentType must not be null`
      );
      return;
    }
    this.saveEvent(context, nodeId, componentId, componentType, category, event, data);
  }

  saveVLEEvent(nodeId, componentId, componentType, category, event, data) {
    if (category == null || event == null) {
      alert($localize`StudentDataService.saveVLEEvent: category and event args must not be null`);
      return;
    }
    const context = 'VLE';
    return this.saveEvent(context, nodeId, componentId, componentType, category, event, data);
  }

  saveEvent(context, nodeId, componentId, componentType, category, event, data) {
    const events = [];
    const newEvent = this.createNewEvent(
      nodeId,
      componentId,
      context,
      componentType,
      category,
      event,
      data
    );
    events.push(newEvent);
    const componentStates = undefined;
    const annotations = undefined;
    return this.saveToServer(componentStates, events, annotations);
  }

  createNewEvent(nodeId, componentId, context, componentType, category, event, data) {
    return {
      nodeId: nodeId,
      componentId: componentId,
      context: context,
      type: componentType,
      category: category,
      event: event,
      data: data,
      projectId: this.ConfigService.getProjectId(),
      runId: this.ConfigService.getRunId(),
      periodId: this.ConfigService.getPeriodId(),
      workgroupId: this.ConfigService.getWorkgroupId(),
      clientSaveTime: Date.parse(new Date().toString())
    };
  }

  saveAnnotations(annotations) {
    const componentStates = undefined;
    const events = undefined;
    this.saveToServer(componentStates, events, annotations);
  }

  saveToServer(componentStates = [], events = [], annotations = []) {
    this.saveToServerRequestCount += 1;
    const studentWorkList = this.prepareComponentStatesForSave(componentStates);
    this.prepareEventsForSave(events);
    this.prepareAnnotationsForSave(annotations);
    if (this.ConfigService.isPreview()) {
      return this.handlePreviewSaveToServer(studentWorkList, events, annotations);
    } else if (!this.ConfigService.isRunActive()) {
      return Promise.resolve();
    } else {
      const params = {
        projectId: this.ConfigService.getProjectId(),
        runId: this.ConfigService.getRunId(),
        workgroupId: this.ConfigService.getWorkgroupId(),
        studentWorkList: JSON.stringify(studentWorkList),
        events: JSON.stringify(events),
        annotations: JSON.stringify(annotations)
      };
      return this.http
        .post(this.ConfigService.getConfigParam('studentDataURL'), params)
        .toPromise()
        .then(
          (resultData: any) => {
            return this.handleSaveToServerSuccess(resultData);
          },
          (resultData: any) => {
            return this.handleSaveToServerError();
          }
        );
    }
  }

  prepareComponentStatesForSave(componentStates) {
    const studentWorkList = [];
    for (const componentState of componentStates) {
      componentState.requestToken = RandomKeyService.generate();
      this.addComponentState(componentState);
      studentWorkList.push(componentState);
    }
    return studentWorkList;
  }

  prepareEventsForSave(events) {
    for (const event of events) {
      event.requestToken = RandomKeyService.generate();
      this.addEvent(event);
    }
  }

  prepareAnnotationsForSave(annotations) {
    for (const annotation of annotations) {
      annotation.requestToken = RandomKeyService.generate();
      if (annotation.id == null) {
        this.addAnnotation(annotation);
      }
    }
  }

  handlePreviewSaveToServer(studentWorkList, events, annotations) {
    const savedStudentDataResponse = {
      studentWorkList: studentWorkList,
      events: events,
      annotations: annotations
    };
    this.copyClientSaveTimeToServerSaveTime(savedStudentDataResponse);
    this.handleSaveToServerSuccess(savedStudentDataResponse);
    return Promise.resolve(savedStudentDataResponse);
  }

  copyClientSaveTimeToServerSaveTime(studentDataResponse: any): void {
    for (const studentWork of studentDataResponse.studentWorkList) {
      studentWork.serverSaveTime = studentWork.clientSaveTime;
    }
    for (const event of studentDataResponse.events) {
      event.serverSaveTime = event.clientSaveTime;
    }
    for (const annotation of studentDataResponse.annotations) {
      annotation.serverSaveTime = annotation.clientSaveTime;
    }
  }

  handleSaveToServerSuccess(savedStudentDataResponse) {
    if (savedStudentDataResponse.studentWorkList) {
      this.processSavedStudentWorkList(savedStudentDataResponse.studentWorkList);
    }
    if (savedStudentDataResponse.events) {
      this.processSavedEvents(savedStudentDataResponse.events);
    }
    if (savedStudentDataResponse.annotations) {
      this.processSavedAnnotations(savedStudentDataResponse.annotations);
    }
    this.saveToServerRequestCount -= 1;
    if (this.saveToServerRequestCount == 0) {
      /*
       * we have received the reponse to all of the saveToServer requests
       * so we will now update the student status and save it to the
       * server
       */
      this.updateNodeStatuses();
    }
    return Promise.resolve(savedStudentDataResponse);
  }

  processSavedStudentWorkList(savedStudentWorkList) {
    const localStudentWorkList = this.studentData.componentStates;
    for (const savedStudentWork of savedStudentWorkList) {
      for (let l = localStudentWorkList.length - 1; l >= 0; l--) {
        const localStudentWork = localStudentWorkList[l];
        if (this.isMatchingRequestToken(localStudentWork, savedStudentWork)) {
          if (this.ConfigService.isPreview()) {
            this.setDummyIdIntoLocalId(localStudentWork);
            this.setDummyServerSaveTimeIntoLocalServerSaveTime(localStudentWork);
          } else {
            this.setRemoteIdIntoLocalId(savedStudentWork, localStudentWork);
            this.setRemoteServerSaveTimeIntoLocalServerSaveTime(savedStudentWork, localStudentWork);
          }
          this.clearRequestToken(localStudentWork);
          this.broadcastStudentWorkSavedToServer(localStudentWork);
          break;
        }
      }
    }
  }

  broadcastStudentWorkSavedToServer(componentState: any) {
    this.studentWorkSavedToServerSource.next(componentState);
  }

  isMatchingRequestToken(localObj, remoteObj) {
    return localObj.requestToken != null && localObj.requestToken === remoteObj.requestToken;
  }

  setRemoteIdIntoLocalId(remoteObject, localObject) {
    localObject.id = remoteObject.id;
  }

  setDummyIdIntoLocalId(localObject) {
    localObject.id = this.dummyStudentWorkId;
    this.dummyStudentWorkId++;
  }

  setRemoteServerSaveTimeIntoLocalServerSaveTime(remoteObject, localObject) {
    localObject.serverSaveTime = remoteObject.serverSaveTime;
  }

  setDummyServerSaveTimeIntoLocalServerSaveTime(localObject) {
    localObject.serverSaveTime = Date.parse(new Date().toString());
  }

  clearRequestToken(obj) {
    obj.requestToken = null;
  }

  processSavedEvents(savedEvents) {
    const localEvents = this.studentData.events;
    for (const savedEvent of savedEvents) {
      for (let l = localEvents.length - 1; l >= 0; l--) {
        const localEvent = localEvents[l];
        if (this.isMatchingRequestToken(localEvent, savedEvent)) {
          this.setRemoteIdIntoLocalId(savedEvent, localEvent);
          this.setRemoteServerSaveTimeIntoLocalServerSaveTime(savedEvent, localEvent);
          this.clearRequestToken(localEvent);
          break;
        }
      }
    }
  }

  processSavedAnnotations(savedAnnotations) {
    const localAnnotations = this.studentData.annotations;
    for (const savedAnnotation of savedAnnotations) {
      for (let l = localAnnotations.length - 1; l >= 0; l--) {
        const localAnnotation = localAnnotations[l];
        if (this.isMatchingRequestToken(localAnnotation, savedAnnotation)) {
          this.setRemoteIdIntoLocalId(savedAnnotation, localAnnotation);
          this.setRemoteServerSaveTimeIntoLocalServerSaveTime(savedAnnotation, localAnnotation);
          this.clearRequestToken(localAnnotation);
          this.AnnotationService.broadcastAnnotationSavedToServer({ annotation: localAnnotation });
          break;
        }
      }
    }
  }

  handleSaveToServerError() {
    this.saveToServerRequestCount -= 1;
    return Promise.resolve({});
  }

  getLatestComponentState() {
    const componentStates = this.studentData.componentStates;
    if (componentStates.length > 0) {
      return componentStates[componentStates.length - 1];
    }
    return null;
  }

  isComponentSubmitDirty(): boolean {
    const latestComponentState = this.getLatestComponentState();
    return latestComponentState && !latestComponentState.isSubmit;
  }

  /**
   * Get the latest component state for the given node id and component id.
   * @param nodeId the node id
   * @param componentId the component id (optional)
   * @return the latest component state with the matching node id and component id or null if none
   * are found
   */
  getLatestComponentStateByNodeIdAndComponentId(nodeId: string, componentId: string = null): any {
    const componentStates = this.studentData.componentStates;
    for (let c = componentStates.length - 1; c >= 0; c--) {
      const componentState = componentStates[c];
      if (componentState.nodeId === nodeId) {
        if (componentId == null || componentState.componentId === componentId) {
          return componentState;
        }
      }
    }
    return null;
  }

  getLatestSubmitComponentState(nodeId, componentId) {
    const componentStates = this.studentData.componentStates;
    for (let c = componentStates.length - 1; c >= 0; c--) {
      const componentState = componentStates[c];
      if (
        componentState.nodeId === nodeId &&
        componentState.componentId === componentId &&
        componentState.isSubmit
      ) {
        return componentState;
      }
    }
    return null;
  }

  getStudentWorkByStudentWorkId(studentWorkId) {
    for (const componentState of this.studentData.componentStates) {
      if (componentState.id === studentWorkId) {
        return componentState;
      }
    }
    return null;
  }

  getComponentStates() {
    return this.studentData.componentStates;
  }

  getComponentStatesByNodeId(nodeId) {
    const componentStatesByNodeId = [];
    for (const componentState of this.studentData.componentStates) {
      if (componentState.nodeId === nodeId) {
        componentStatesByNodeId.push(componentState);
      }
    }
    return componentStatesByNodeId;
  }

  getComponentStatesByNodeIdAndComponentId(nodeId, componentId) {
    const componentStatesByNodeIdAndComponentId = [];
    for (const componentState of this.studentData.componentStates) {
      if (componentState.nodeId === nodeId && componentState.componentId === componentId) {
        componentStatesByNodeIdAndComponentId.push(componentState);
      }
    }
    return componentStatesByNodeIdAndComponentId;
  }

  getEvents() {
    return this.studentData.events;
  }

  getEventsByNodeId(nodeId) {
    const eventsByNodeId = [];
    const events = this.studentData.events;
    for (const event of events) {
      if (event.nodeId === nodeId) {
        eventsByNodeId.push(event);
      }
    }
    return eventsByNodeId;
  }

  getEventsByNodeIdAndComponentId(nodeId, componentId) {
    const eventsByNodeId = [];
    const events = this.studentData.events;
    for (const event of events) {
      if (event.nodeId === nodeId && event.componentId === componentId) {
        eventsByNodeId.push(event);
      }
    }
    return eventsByNodeId;
  }

  /**
   * Get the node id of the latest node entered event for an active node that
   * exists in the project. We need to check if the node exists in the project
   * in case the node has been deleted from the project. We also need to check
   * that the node is active in case the node has been moved to the inactive
   * section of the project.
   * @return the node id of the latest node entered event for an active node
   * that exists in the project
   */
  getLatestNodeEnteredEventNodeIdWithExistingNode() {
    const events = this.studentData.events;
    for (let e = events.length - 1; e >= 0; e--) {
      const event = events[e];
      if (event.event == 'nodeEntered' && this.isNodeExistAndActive(event.nodeId)) {
        return event.nodeId;
      }
    }
    return null;
  }

  isNodeExistAndActive(nodeId) {
    return this.ProjectService.getNodeById(nodeId) != null && this.ProjectService.isActive(nodeId);
  }

  /**
   * Get progress information for a given node
   * @param nodeId the node id
   * @returns object with number of completed items (both all and for items that capture student
   * work), number of visible items (all/with work), completion % (for all items, items with student
   * work)
   */
  getNodeProgressById(nodeId: string, nodeStatuses: any): any {
    const progress = {
      totalItems: 0,
      totalItemsWithWork: 0,
      completedItems: 0,
      completedItemsWithWork: 0
    };
    if (this.ProjectService.isGroupNode(nodeId)) {
      for (const childNodeId of this.ProjectService.getChildNodeIdsById(nodeId)) {
        if (this.ProjectService.isGroupNode(childNodeId)) {
          this.updateGroupNodeProgress(childNodeId, progress, nodeStatuses);
        } else {
          this.updateStepNodeProgress(childNodeId, progress, nodeStatuses);
        }
      }
      this.calculateAndInjectCompletionPercentage(progress);
      this.calculateAndInjectCompletionPercentageWithWork(progress);
    }
    // TODO: implement for steps (using components instead of child nodes)?
    return progress;
  }

  private updateGroupNodeProgress(nodeId: string, progress: any, nodeStatuses: any): any {
    const nodeStatus = nodeStatuses[nodeId];
    if (nodeStatus.progress.totalItemsWithWork > -1) {
      progress.completedItems += nodeStatus.progress.completedItems;
      progress.totalItems += nodeStatus.progress.totalItems;
      progress.completedItemsWithWork += nodeStatus.progress.completedItemsWithWork;
      progress.totalItemsWithWork += nodeStatus.progress.totalItemsWithWork;
    } else {
      // we have a legacy node status so we'll need to calculate manually
      const groupProgress = this.getNodeProgressById(nodeId, nodeStatuses);
      progress.completedItems += groupProgress.completedItems;
      progress.totalItems += groupProgress.totalItems;
      progress.completedItemsWithWork += groupProgress.completedItemsWithWork;
      progress.totalItemsWithWork += groupProgress.totalItemsWithWork;
    }
    return progress;
  }

  private updateStepNodeProgress(nodeId: string, progress: any, nodeStatuses: any): any {
    const nodeStatus = nodeStatuses[nodeId];
    if (nodeStatus.isVisible) {
      progress.totalItems++;
      const hasWork = this.ProjectService.nodeHasWork(nodeId);
      if (hasWork) {
        progress.totalItemsWithWork++;
      }
      if (nodeStatus.isCompleted) {
        progress.completedItems++;
        if (hasWork) {
          progress.completedItemsWithWork++;
        }
      }
    }
    return progress;
  }

  calculateAndInjectCompletionPercentage(progress) {
    const totalItems = progress.totalItems;
    const completedItems = progress.completedItems;
    progress.completionPct = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;
  }

  calculateAndInjectCompletionPercentageWithWork(progress) {
    const totalItemsWithWork = progress.totalItemsWithWork;
    const completedItemsWithWork = progress.completedItemsWithWork;
    progress.completionPctWithWork = totalItemsWithWork
      ? Math.round((completedItemsWithWork / totalItemsWithWork) * 100)
      : 0;
  }

  /**
   * Check if the given node or component is completed
   * @param nodeId the node id
   * @param componentId (optional) the component id
   * @returns whether the node or component is completed
   */
  isCompleted(nodeId, componentId = null) {
    let result = false;
    if (nodeId && componentId) {
      result = this.isComponentCompleted(nodeId, componentId);
    } else if (this.ProjectService.isGroupNode(nodeId)) {
      result = this.isGroupNodeCompleted(nodeId);
    } else if (this.ProjectService.isApplicationNode(nodeId)) {
      result = this.isStepNodeCompleted(nodeId);
    }
    return result;
  }

  private isComponentCompleted(nodeId: string, componentId: string): boolean {
    const component = this.ProjectService.getComponent(nodeId, componentId);
    if (component != null) {
      const node = this.ProjectService.getNodeById(nodeId);
      const componentType = component.type;
      const service = this.componentServiceLookupService.getService(componentType);
      if (['OpenResponse', 'Discussion'].includes(componentType)) {
        return service.isCompletedV2(node, component, this.studentData);
      } else {
        const componentStates = this.getComponentStatesByNodeIdAndComponentId(nodeId, componentId);
        const nodeEvents = this.getEventsByNodeId(nodeId);
        return service.isCompleted(component, componentStates, nodeEvents, node);
      }
    }
    return false;
  }

  isStepNodeCompleted(nodeId) {
    let result = true;
    const components = this.ProjectService.getComponents(nodeId);
    for (const component of components) {
      const isComponentCompleted = this.isComponentCompleted(nodeId, component.id);
      result = result && isComponentCompleted;
    }
    return result;
  }

  isGroupNodeCompleted(nodeId) {
    let result = true;
    const nodeIds = this.ProjectService.getChildNodeIdsById(nodeId);
    for (const id of nodeIds) {
      if (
        this.nodeStatuses[id] == null ||
        !this.nodeStatuses[id].isVisible ||
        !this.nodeStatuses[id].isCompleted
      ) {
        result = false;
        break;
      }
    }
    return result;
  }

  endCurrentNodeAndSetCurrentNodeByNodeId(nodeId) {
    if (this.nodeStatuses[nodeId].isVisitable) {
      this.setCurrentNodeByNodeId(nodeId);
    } else {
      this.nodeClickLocked(nodeId);
    }
  }

  nodeClickLocked(nodeId) {
    this.broadcastNodeClickLocked({ nodeId: nodeId });
  }

  broadcastNodeClickLocked(args: any) {
    this.nodeClickLockedSource.next(args);
  }

  getTotalScore() {
    return this.AnnotationService.getTotalScore(this.studentData.annotations);
  }

  getProjectCompletion() {
    const nodeId = 'group0';
    return this.getNodeProgressById(nodeId, this.nodeStatuses);
  }

  getRunStatus() {
    return this.runStatus;
  }

  getAnnotations() {
    return this.studentData.annotations;
  }

  getLatestComponentStatesByNodeId(nodeId) {
    const latestComponentStates = [];
    const node = this.ProjectService.getNodeById(nodeId);
    if (node != null) {
      const components = node.components;
      if (components != null) {
        for (const component of components) {
          const componentId = component.id;
          let componentState = this.getLatestComponentStateByNodeIdAndComponentId(
            nodeId,
            componentId
          );
          if (componentState == null) {
            /*
             * there is no component state for the component so we will create an object that just
             * contains the node id and component id
             */
            componentState = {};
            componentState.nodeId = nodeId;
            componentState.componentId = componentId;
          }
          latestComponentStates.push(componentState);
        }
      }
    }
    return latestComponentStates;
  }

  getLatestComponentStateByNodeId(nodeId) {
    const componentStates = this.getComponentStatesByNodeId(nodeId);
    if (componentStates.length > 0) {
      return componentStates[componentStates.length - 1];
    } else {
      return null;
    }
  }

  getStudentWorkById(id) {
    const params = new HttpParams()
      .set('runId', this.ConfigService.getRunId())
      .set('id', id + '')
      .set('getStudentWork', true + '')
      .set('getEvents', false + '')
      .set('getAnnotations', false + '')
      .set('onlyGetLatest', true + '');
    const options = {
      params: params
    };
    return this.http
      .get(this.ConfigService.getConfigParam('studentDataURL'), options)
      .toPromise()
      .then((resultData: any) => {
        if (resultData != null && resultData.studentWorkList.length > 0) {
          return resultData.studentWorkList[0];
        }
        return null;
      });
  }

  /**
   * Get the max possible score for the project
   * @returns the sum of the max scores for all the nodes in the project visible
   * to the current workgroup or null if none of the visible components has max scores.
   */
  getMaxScore() {
    let maxScore = null;
    for (const property in this.nodeStatuses) {
      if (this.nodeStatuses.hasOwnProperty(property)) {
        const nodeStatus = this.nodeStatuses[property];
        const nodeId = nodeStatus.nodeId;
        if (nodeStatus.isVisible && !this.ProjectService.isGroupNode(nodeId)) {
          const nodeMaxScore = this.ProjectService.getMaxScoreForNode(nodeId);
          if (nodeMaxScore) {
            if (maxScore == null) {
              maxScore = 0;
            }
            maxScore += nodeMaxScore;
          }
        }
      }
    }
    return maxScore;
  }

  broadcastComponentDirty(args: any) {
    this.componentDirtySource.next(args);
  }
  broadcastComponentSaveTriggered(args: any) {
    this.componentSaveTriggeredSource.next(args);
  }
  broadcastComponentSubmitDirty(args: any) {
    this.componentSubmitDirtySource.next(args);
  }
  broadcastComponentSubmitTriggered(args: any) {
    this.componentSubmitTriggeredSource.next(args);
  }
  setNavItemExpanded(nodeId: string, isExpanded: boolean) {
    this.navItemIsExpandedSource.next({ nodeId: nodeId, isExpanded: isExpanded });
  }
}
