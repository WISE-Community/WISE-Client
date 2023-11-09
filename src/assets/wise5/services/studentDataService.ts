'use strict';

import { Injectable } from '@angular/core';
import { ConfigService } from './configService';
import { AnnotationService } from './annotationService';
import { ProjectService } from './projectService';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { DataService } from '../../../app/services/data.service';
import { generateRandomKey } from '../common/string/string';

@Injectable()
export class StudentDataService extends DataService {
  dummyStudentWorkId: number = 1;
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
  private dataRetrievedSource: Subject<any> = new Subject<any>();
  public dataRetrieved$: Observable<any> = this.dataRetrievedSource.asObservable();
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
    this.dataRetrievedSource.next(this.studentData);
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
    this.dataRetrievedSource.next(this.studentData);
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

  populateHistories(events) {
    this.stackHistory = [];
    for (const event of events) {
      if (event.event === 'nodeEntered') {
        this.updateStackHistory(event.nodeId);
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
      componentState.requestToken = generateRandomKey();
      this.addComponentState(componentState);
      studentWorkList.push(componentState);
    }
    return studentWorkList;
  }

  prepareEventsForSave(events) {
    for (const event of events) {
      event.requestToken = generateRandomKey();
      this.addEvent(event);
    }
  }

  prepareAnnotationsForSave(annotations) {
    for (const annotation of annotations) {
      annotation.requestToken = generateRandomKey();
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
          this.AnnotationService.broadcastAnnotationSavedToServer(localAnnotation);
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

  getComponentStates(): any[] {
    return this.studentData.componentStates;
  }

  getComponentStatesByNodeId(nodeId: string): any[] {
    return this.studentData.componentStates.filter(
      (componentState) => componentState.nodeId === nodeId
    );
  }

  getComponentStatesByNodeIdAndComponentId(nodeId: string, componentId: string): any[] {
    return this.studentData.componentStates.filter(
      (componentState) =>
        componentState.nodeId === nodeId && componentState.componentId === componentId
    );
  }

  getEvents(): any[] {
    return this.studentData.events;
  }

  getEventsByNodeId(nodeId: string): any[] {
    return this.studentData.events.filter((event) => event.nodeId === nodeId);
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

  getTotalScore() {
    return this.AnnotationService.getTotalScore(this.studentData.annotations);
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
