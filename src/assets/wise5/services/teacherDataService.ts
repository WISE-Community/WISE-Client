'use strict';

import { HttpClient, HttpParams } from '@angular/common/http';
import { AnnotationService } from './annotationService';
import { ConfigService } from './configService';
import { TeacherProjectService } from './teacherProjectService';
import { TeacherWebSocketService } from './teacherWebSocketService';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { DataService } from '../../../app/services/data.service';
import { Node } from '../common/Node';
import { compressToEncodedURIComponent } from 'lz-string';
import { isMatchingPeriods } from '../common/period/period';
import { getIntersectOfArrays } from '../common/array/array';
import { serverSaveTimeComparator } from '../common/object/object';

@Injectable()
export class TeacherDataService extends DataService {
  studentData: any;
  currentPeriod = null;
  currentWorkgroup = null;
  currentStep = null;
  previousStep = null;
  runStatus = null;
  periods = [];
  nodeGradingSort = 'team';
  studentGradingSort = 'step';
  studentProgressSort = 'team';
  private currentPeriodChangedSource: Subject<any> = new Subject<any>();
  public currentPeriodChanged$: Observable<any> = this.currentPeriodChangedSource.asObservable();
  private currentWorkgroupChangedSource: Subject<any> = new Subject<any>();
  public currentWorkgroupChanged$: Observable<any> = this.currentWorkgroupChangedSource.asObservable();

  constructor(
    private http: HttpClient,
    private AnnotationService: AnnotationService,
    private ConfigService: ConfigService,
    protected ProjectService: TeacherProjectService,
    private TeacherWebSocketService: TeacherWebSocketService
  ) {
    super(ProjectService);
    this.studentData = {
      annotationsByNodeId: {},
      annotationsToWorkgroupId: {},
      componentStatesByWorkgroupId: {},
      componentStatesByNodeId: {},
      componentStatesByComponentId: {}
    };
    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.AnnotationService.annotationSavedToServer$.subscribe(({ annotation }) => {
      this.handleAnnotationReceived(annotation);
    });

    this.TeacherWebSocketService.newAnnotationReceived$.subscribe(({ annotation }) => {
      this.handleAnnotationReceived(annotation);
    });

    this.TeacherWebSocketService.newStudentWorkReceived$.subscribe(({ studentWork }) => {
      this.addOrUpdateComponentState(studentWork);
      this.broadcastStudentWorkReceived({ studentWork: studentWork });
    });

    this.ConfigService.configRetrieved$.subscribe(() => {
      if (this.ConfigService.isClassroomMonitor()) {
        this.retrieveRunStatus();
      }
    });
  }

  handleAnnotationReceived(annotation) {
    this.studentData.annotations.push(annotation);
    const toWorkgroupId = annotation.toWorkgroupId;
    if (this.studentData.annotationsToWorkgroupId[toWorkgroupId] == null) {
      this.studentData.annotationsToWorkgroupId[toWorkgroupId] = new Array();
    }
    this.studentData.annotationsToWorkgroupId[toWorkgroupId].push(annotation);
    const nodeId = annotation.nodeId;
    if (this.studentData.annotationsByNodeId[nodeId] == null) {
      this.studentData.annotationsByNodeId[nodeId] = new Array();
    }
    this.studentData.annotationsByNodeId[nodeId].push(annotation);
    this.AnnotationService.setAnnotations(this.studentData.annotations);
    this.AnnotationService.broadcastAnnotationReceived({ annotation: annotation });
  }

  saveEvent(context, nodeId, componentId, componentType, category, event, data) {
    const newEvent = this.createEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      event,
      data
    );
    const events = [newEvent];
    let body = new HttpParams().set('events', JSON.stringify(events));
    body = this.addCommonParams(body);
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };
    const url = this.ConfigService.getConfigParam('teacherDataURL');
    return this.http
      .post(url, body, options)
      .toPromise()
      .then((data: any) => {
        return data.events;
      });
  }

  saveAddComponentEvent(nodeId: string, newComponent: any): void {
    this.saveEvent('AuthoringTool', nodeId, null, null, 'Authoring', 'componentCreated', {
      componentId: newComponent.id,
      componentType: newComponent.type
    });
  }

  addCommonParams(params) {
    params = this.addProjectIdToHttpParams(params);
    params = this.addRunIdToHttpParams(params);
    params = this.addWorkgroupIdToHttpParams(params);
    return params;
  }

  addProjectIdToHttpParams(params) {
    const projectId = this.ConfigService.getProjectId();
    if (projectId != null) {
      return params.set('projectId', projectId);
    } else {
      return params;
    }
  }

  addRunIdToHttpParams(params) {
    const runId = this.ConfigService.getRunId();
    if (runId != null) {
      return params.set('runId', runId);
    } else {
      return params;
    }
  }

  addWorkgroupIdToHttpParams(params) {
    const workgroupId = this.ConfigService.getWorkgroupId();
    if (workgroupId != null) {
      return params.set('workgroupId', workgroupId);
    } else {
      return params;
    }
  }

  createEvent(context, nodeId, componentId, componentType, category, event, data) {
    const newEvent = {
      projectId: this.ConfigService.getProjectId(),
      runId: this.ConfigService.getRunId(),
      workgroupId: this.ConfigService.getWorkgroupId(),
      clientSaveTime: Date.parse(new Date().toString()),
      context: context,
      nodeId: nodeId,
      componentId: componentId,
      type: componentType,
      category: category,
      event: event,
      data: data
    };
    return newEvent;
  }

  retrieveStudentDataForNode(node: Node): Observable<any> {
    let params = new HttpParams()
      .set('runId', this.ConfigService.getRunId())
      .set('getStudentWork', 'true')
      .set('getAnnotations', 'false')
      .set('getEvents', 'false');
    const components = this.getAllRelatedComponents(node);
    if (components.length > 0) {
      params = params.set('components', compressToEncodedURIComponent(JSON.stringify(components)));
    }
    return this.retrieveStudentData(params);
  }

  getAllRelatedComponents(node: Node): any {
    const components = node.getNodeIdComponentIds();
    return components.concat(this.getConnectedComponentsWithRequiredStudentData(components));
  }

  getConnectedComponentsWithRequiredStudentData(components): any {
    const connectedComponents = [];
    for (const component of components) {
      const componentContent = this.ProjectService.getComponent(
        component.nodeId,
        component.componentId
      );
      if (this.isConnectedComponentStudentDataRequired(componentContent)) {
        for (const connectedComponent of componentContent.connectedComponents) {
          connectedComponents.push(connectedComponent);
        }
      }
    }
    return connectedComponents;
  }

  isConnectedComponentStudentDataRequired(componentContent) {
    return (
      componentContent.type === 'Discussion' &&
      componentContent.connectedComponents != null &&
      componentContent.connectedComponents.length !== 0
    );
  }

  retrieveStudentDataByWorkgroupId(workgroupId) {
    const params = new HttpParams()
      .set('runId', this.ConfigService.getRunId())
      .set('workgroupId', workgroupId)
      .set('toWorkgroupId', workgroupId)
      .set('getStudentWork', 'true')
      .set('getEvents', 'false')
      .set('getAnnotations', 'false');
    return this.retrieveStudentData(params);
  }

  retrieveAnnotations() {
    const params = new HttpParams()
      .set('runId', this.ConfigService.getRunId())
      .set('getStudentWork', 'false')
      .set('getEvents', 'false')
      .set('getAnnotations', 'true');
    return this.retrieveStudentData(params);
  }

  retrieveLatestStudentDataByNodeIdAndComponentIdAndPeriodId(nodeId, componentId, periodId) {
    let params = new HttpParams()
      .set('runId', this.ConfigService.getRunId())
      .set('nodeId', nodeId)
      .set('componentId', componentId)
      .set('getStudentWork', 'true')
      .set('getEvents', 'false')
      .set('getAnnotations', 'false')
      .set('onlyGetLatest', 'true');
    if (periodId != null) {
      params = params.set('periodId', periodId);
    }
    return this.retrieveStudentData(params).subscribe((result) => {
      return result.studentWorkList;
    });
  }

  retrieveStudentData(params): Observable<any> {
    const url = this.ConfigService.getConfigParam('teacherDataURL');
    const options = {
      params: params
    };
    return this.http.get(url, options).pipe(
      tap((data: any) => {
        this.handleStudentDataResponse(data);
      })
    );
  }

  handleStudentDataResponse(resultData) {
    const { studentWorkList: componentStates, events, annotations } = resultData;
    if (componentStates != null) {
      this.processComponentStates(componentStates);
    }
    if (events != null) {
      this.processEvents(events);
    }
    if (annotations != null) {
      this.processAnnotations(annotations);
    }
    return resultData;
  }

  processComponentStates(componentStates) {
    this.initializeComponentStatesDataStructures();
    for (const componentState of componentStates) {
      this.addOrUpdateComponentState(componentState);
    }
  }

  initializeComponentStatesDataStructures(): void {
    this.studentData.componentStatesByWorkgroupId = {};
    this.studentData.componentStatesByNodeId = {};
    this.studentData.componentStatesByComponentId = {};
  }

  processEvents(events) {
    events.sort(serverSaveTimeComparator);
    this.studentData.allEvents = events;
    this.initializeEventsDataStructures();
    for (const event of events) {
      this.addEventToEventsByWorkgroupId(event);
      this.addEventToEventsByNodeId(event);
    }
  }

  initializeEventsDataStructures() {
    this.studentData.eventsByWorkgroupId = {};
    this.studentData.eventsByNodeId = {};
  }

  addEventToEventsByWorkgroupId(event) {
    const eventWorkgroupId = event.workgroupId;
    if (this.studentData.eventsByWorkgroupId[eventWorkgroupId] == null) {
      this.studentData.eventsByWorkgroupId[eventWorkgroupId] = new Array();
    }
    this.studentData.eventsByWorkgroupId[eventWorkgroupId].push(event);
  }

  addEventToEventsByNodeId(event) {
    const eventNodeId = event.nodeId;
    if (this.studentData.eventsByNodeId[eventNodeId] == null) {
      this.studentData.eventsByNodeId[eventNodeId] = new Array();
    }
    this.studentData.eventsByNodeId[eventNodeId].push(event);
  }

  processAnnotations(annotations) {
    this.initializeAnnotationsDataStructures();
    this.studentData.annotations = annotations;
    for (const annotation of annotations) {
      this.addAnnotationToAnnotationsToWorkgroupId(annotation);
      this.addAnnotationToAnnotationsByNodeId(annotation);
    }
    this.AnnotationService.setAnnotations(this.studentData.annotations);
  }

  initializeAnnotationsDataStructures(): void {
    this.studentData.annotationsByNodeId = {};
    this.studentData.annotationsToWorkgroupId = {};
  }

  addAnnotationToAnnotationsToWorkgroupId(annotation) {
    const annotationWorkgroupId = annotation.toWorkgroupId;
    if (!this.studentData.annotationsToWorkgroupId[annotationWorkgroupId]) {
      this.studentData.annotationsToWorkgroupId[annotationWorkgroupId] = new Array();
    }
    this.studentData.annotationsToWorkgroupId[annotationWorkgroupId].push(annotation);
  }

  addAnnotationToAnnotationsByNodeId(annotation) {
    const annotationNodeId = annotation.nodeId;
    if (!this.studentData.annotationsByNodeId[annotationNodeId]) {
      this.studentData.annotationsByNodeId[annotationNodeId] = new Array();
    }
    this.studentData.annotationsByNodeId[annotationNodeId].push(annotation);
  }

  addOrUpdateComponentState(componentState) {
    this.addComponentStateByWorkgroupId(componentState);
    this.addComponentStateByNodeId(componentState);
    this.addComponentStateByComponentId(componentState);
  }

  addComponentStateByWorkgroupId(componentState) {
    const workgroupId = componentState.workgroupId;
    this.initializeComponentStatesByWorkgroupIdIfNecessary(workgroupId);
    const index = this.getComponentStateByWorkgroupIdIndex(componentState);
    if (index != -1) {
      this.studentData.componentStatesByWorkgroupId[workgroupId][index] = componentState;
    } else {
      this.studentData.componentStatesByWorkgroupId[workgroupId].push(componentState);
    }
  }

  initializeComponentStatesByWorkgroupIdIfNecessary(workgroupId) {
    if (this.studentData.componentStatesByWorkgroupId[workgroupId] == null) {
      this.studentData.componentStatesByWorkgroupId[workgroupId] = [];
    }
  }

  getComponentStateByWorkgroupIdIndex(componentState) {
    const workgroupId = componentState.workgroupId;
    const componentStates = this.studentData.componentStatesByWorkgroupId[workgroupId];
    for (let w = 0; w < componentStates.length; w++) {
      if (componentStates[w].id === componentState.id) {
        return w;
      }
    }
    return -1;
  }

  addComponentStateByNodeId(componentState) {
    const nodeId = componentState.nodeId;
    this.initializeComponentStatesByNodeIdIfNecessary(nodeId);
    const index = this.getComponentStateByNodeIdIndex(componentState);
    if (index != -1) {
      this.studentData.componentStatesByNodeId[nodeId][index] = componentState;
    } else {
      this.studentData.componentStatesByNodeId[nodeId].push(componentState);
    }
  }

  initializeComponentStatesByNodeIdIfNecessary(nodeId) {
    if (this.studentData.componentStatesByNodeId[nodeId] == null) {
      this.studentData.componentStatesByNodeId[nodeId] = [];
    }
  }

  getComponentStateByNodeIdIndex(componentState) {
    const nodeId = componentState.nodeId;
    const componentStates = this.studentData.componentStatesByNodeId[nodeId];
    for (let n = 0; n < componentStates.length; n++) {
      if (componentStates[n].id === componentState.id) {
        return n;
      }
    }
    return -1;
  }

  addComponentStateByComponentId(componentState) {
    const componentId = componentState.componentId;
    this.initializeComponentStatesByComponentIdIfNecessary(componentId);
    const index = this.getComponentStateByComponentIdIndex(componentState);
    if (index != -1) {
      this.studentData.componentStatesByComponentId[componentId][index] = componentState;
    } else {
      this.studentData.componentStatesByComponentId[componentId].push(componentState);
    }
  }

  initializeComponentStatesByComponentIdIfNecessary(componentId) {
    if (this.studentData.componentStatesByComponentId[componentId] == null) {
      this.studentData.componentStatesByComponentId[componentId] = [];
    }
  }

  getComponentStateByComponentIdIndex(componentState) {
    const componentId = componentState.componentId;
    const componentStates = this.studentData.componentStatesByComponentId[componentId];
    for (let c = 0; c < componentStates.length; c++) {
      if (componentStates[c].id === componentState.id) {
        return c;
      }
    }
    return -1;
  }

  retrieveRunStatus() {
    const url = this.ConfigService.getConfigParam('runStatusURL');
    const params = new HttpParams().set('runId', this.ConfigService.getConfigParam('runId'));
    const options = {
      params: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };
    return this.http
      .get(url, options)
      .toPromise()
      .then((data: any) => {
        this.runStatus = data;
        this.initializePeriods();
      });
  }

  getComponentStatesByWorkgroupId(workgroupId) {
    return this.studentData.componentStatesByWorkgroupId[workgroupId] || [];
  }

  getComponentStatesByNodeId(nodeId) {
    return this.studentData.componentStatesByNodeId[nodeId] || [];
  }

  getComponentStatesByComponentId(componentId) {
    return this.studentData.componentStatesByComponentId[componentId] || [];
  }

  getComponentStatesByComponentIds(componentIds) {
    let componentStatesByComponentId = [];
    for (const componentId of componentIds) {
      componentStatesByComponentId = componentStatesByComponentId.concat(
        this.studentData.componentStatesByComponentId[componentId]
      );
    }
    return componentStatesByComponentId;
  }

  getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(workgroupId, nodeId, componentId) {
    const componentStates = this.getComponentStatesByWorkgroupIdAndNodeId(workgroupId, nodeId);
    for (let c = componentStates.length - 1; c >= 0; c--) {
      const componentState = componentStates[c];
      if (this.isComponentStateMatchingNodeIdComponentId(componentState, nodeId, componentId)) {
        return componentState;
      }
    }
    return null;
  }

  isComponentStateMatchingNodeIdComponentId(componentState, nodeId, componentId) {
    return componentState.nodeId === nodeId && componentState.componentId === componentId;
  }

  getLatestComponentStateByWorkgroupIdNodeId(workgroupId, nodeId) {
    const componentStates = this.getComponentStatesByWorkgroupIdAndNodeId(workgroupId, nodeId);
    for (let c = componentStates.length - 1; c >= 0; c--) {
      const componentState = componentStates[c];
      if (this.isComponentStateMatchingNodeId(componentState, nodeId)) {
        return componentState;
      }
    }
    return null;
  }

  isComponentStateMatchingNodeId(componentState, nodeId) {
    return componentState.nodeId === nodeId;
  }

  /**
   * @param workgroupId the workgroup id
   * @return An array of component states. Each component state will be the latest component state
   * for a component.
   */
  getLatestComponentStatesByWorkgroupId(workgroupId) {
    const componentStates = [];
    const componentsFound = {};
    const componentStatesForWorkgroup = this.getComponentStatesByWorkgroupId(workgroupId);
    for (let csb = componentStatesForWorkgroup.length - 1; csb >= 0; csb--) {
      const componentState = componentStatesForWorkgroup[csb];
      const key = this.getComponentStateNodeIdComponentIdKey(componentState);
      if (componentsFound[key] == null) {
        componentStates.push(componentState);
        componentsFound[key] = true;
      }
    }
    componentStates.reverse();
    return componentStates;
  }

  injectRevisionCounterIntoComponentStates(componentStates) {
    const componentRevisionCounter = {};
    for (const componentState of componentStates) {
      const key = this.getComponentStateNodeIdComponentIdKey(componentState);
      if (componentRevisionCounter[key] == null) {
        componentRevisionCounter[key] = 1;
      }
      const revisionCounter = componentRevisionCounter[key];
      componentState.revisionCounter = revisionCounter;
      componentRevisionCounter[key] = revisionCounter + 1;
    }
  }

  getComponentStateNodeIdComponentIdKey(componentState) {
    return componentState.nodeId + '-' + componentState.componentId;
  }

  getComponentStatesByWorkgroupIdAndNodeId(workgroupId, nodeId) {
    const componentStatesByWorkgroupId = this.getComponentStatesByWorkgroupId(workgroupId);
    const componentStatesByNodeId = this.getComponentStatesByNodeId(nodeId);
    return getIntersectOfArrays(componentStatesByWorkgroupId, componentStatesByNodeId);
  }

  getComponentStatesByWorkgroupIdAndComponentId(workgroupId, componentId) {
    const componentStatesByWorkgroupId = this.getComponentStatesByWorkgroupId(workgroupId);
    const componentStatesByComponentId = this.getComponentStatesByComponentId(componentId);
    return getIntersectOfArrays(componentStatesByWorkgroupId, componentStatesByComponentId);
  }

  getComponentStatesByWorkgroupIdAndComponentIds(workgroupId, componentIds) {
    const componentStatesByWorkgroupId = this.getComponentStatesByWorkgroupId(workgroupId);
    let componentStatesByComponentId = [];
    for (const componentId of componentIds) {
      componentStatesByComponentId = componentStatesByComponentId.concat(
        this.getComponentStatesByComponentId(componentId)
      );
    }
    return getIntersectOfArrays(componentStatesByWorkgroupId, componentStatesByComponentId);
  }

  getEventsByWorkgroupId(workgroupId) {
    return this.studentData.eventsByWorkgroupId[workgroupId] || [];
  }

  getEventsByNodeId(nodeId) {
    return this.studentData.eventsByNodeId[nodeId] || [];
  }

  getLatestEventByWorkgroupIdAndNodeIdAndType(workgroupId, nodeId, eventType) {
    const eventsByWorkgroupId = this.getEventsByWorkgroupId(workgroupId);
    for (let e = eventsByWorkgroupId.length - 1; e >= 0; e--) {
      const event = eventsByWorkgroupId[e];
      if (this.isEventMatchingNodeIdEventType(event, nodeId, eventType)) {
        return event;
      }
    }
    return null;
  }

  isEventMatchingNodeIdEventType(event, nodeId, eventType) {
    return event.nodeId === nodeId && event.event === eventType;
  }

  getAnnotationsToWorkgroupId(workgroupId: number) {
    return this.studentData.annotationsToWorkgroupId[workgroupId] || [];
  }

  getAnnotationsByNodeId(nodeId: string) {
    return this.studentData.annotationsByNodeId[nodeId] || [];
  }

  getAnnotationsByNodeIdAndComponentId(nodeId: string, componentId: string): any[] {
    const annotationsByNodeId = this.getAnnotationsByNodeId(nodeId);
    return annotationsByNodeId.filter((annotation: any) => annotation.componentId === componentId);
  }

  getAnnotationsByNodeIdAndPeriodId(nodeId, periodId) {
    const annotationsByNodeId = this.studentData.annotationsByNodeId[nodeId];
    if (annotationsByNodeId != null) {
      return annotationsByNodeId.filter((annotation) => {
        return isMatchingPeriods(annotation.periodId, periodId);
      });
    } else {
      return [];
    }
  }

  initializePeriods() {
    const periods = [...this.ConfigService.getPeriods()];
    if (this.currentPeriod == null) {
      this.setCurrentPeriod(periods[0]);
    }
    this.addAllPeriods(periods);
    let mergedPeriods = periods;
    if (this.runStatus.periods != null) {
      mergedPeriods = this.mergeConfigAndRunStatusPeriods(periods, this.runStatus.periods);
    }
    this.periods = mergedPeriods;
    this.runStatus.periods = mergedPeriods;
  }

  addAllPeriods(periods: any[]): void {
    periods.unshift({
      periodId: -1,
      periodName: $localize`All Periods`
    });
  }

  mergeConfigAndRunStatusPeriods(configPeriods, runStatusPeriods) {
    const mergedPeriods = [];
    for (const configPeriod of configPeriods) {
      const runStatusPeriod = this.getRunStatusPeriodById(runStatusPeriods, configPeriod.periodId);
      if (runStatusPeriod == null) {
        mergedPeriods.push(configPeriod);
      } else {
        mergedPeriods.push(runStatusPeriod);
      }
    }
    return mergedPeriods;
  }

  getRunStatusPeriodById(runStatusPeriods, periodId) {
    for (const runStatusPeriod of runStatusPeriods) {
      if (runStatusPeriod.periodId == periodId) {
        return runStatusPeriod;
      }
    }
    return null;
  }

  setCurrentPeriod(period) {
    const previousPeriod = this.currentPeriod;
    this.currentPeriod = period;
    this.clearCurrentWorkgroupIfNecessary(this.currentPeriod.periodId);
    if (previousPeriod == null || previousPeriod.periodId != this.currentPeriod.periodId) {
      this.broadcastCurrentPeriodChanged({
        previousPeriod: previousPeriod,
        currentPeriod: this.currentPeriod
      });
    }
  }

  broadcastCurrentPeriodChanged(previousAndCurrentPeriod: any) {
    this.currentPeriodChangedSource.next(previousAndCurrentPeriod);
  }

  clearCurrentWorkgroupIfNecessary(periodId) {
    const currentWorkgroup = this.getCurrentWorkgroup();
    if (currentWorkgroup) {
      if (periodId !== -1 && currentWorkgroup.periodId !== periodId) {
        this.setCurrentWorkgroup(null);
      }
    }
  }

  clearCurrentPeriod(): void {
    this.currentPeriod = null;
  }

  getCurrentPeriod() {
    return this.currentPeriod;
  }

  getCurrentPeriodId() {
    return this.currentPeriod.periodId;
  }

  getPeriods() {
    return this.periods;
  }

  getRunStatus() {
    return this.runStatus;
  }

  getVisiblePeriodsById(currentPeriodId: number): any {
    if (currentPeriodId === -1) {
      return this.getPeriods().slice(1);
    } else {
      return [this.getPeriodById(currentPeriodId)];
    }
  }

  setCurrentWorkgroup(workgroup) {
    this.currentWorkgroup = workgroup;
    this.broadcastCurrentWorkgroupChanged({ currentWorkgroup: this.currentWorkgroup });
  }

  broadcastCurrentWorkgroupChanged(args: any) {
    this.currentWorkgroupChangedSource.next(args);
  }

  getCurrentWorkgroup() {
    return this.currentWorkgroup;
  }

  setCurrentStep(step) {
    this.currentStep = step;
  }

  getCurrentStep() {
    return this.currentStep;
  }

  getTotalScoreByWorkgroupId(workgroupId: number) {
    return this.AnnotationService.getTotalScore(
      this.studentData.annotationsToWorkgroupId[workgroupId]
    );
  }

  private getPeriodById(periodId: number): any {
    return this.getPeriods().find((period) => period.periodId === periodId);
  }

  /**
   * The pause screen status was changed for the given periodId. Update period accordingly.
   * @param periodId the id of the period to toggle
   * @param isPaused Boolean whether the period should be paused or not
   */
  pauseScreensChanged(periodId: number, isPaused: boolean): void {
    this.updatePausedRunStatusValue(periodId, isPaused);
    this.saveRunStatusThenHandlePauseScreen(periodId, isPaused);
    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'TeacherAction',
      data = { periodId: periodId },
      event = isPaused ? 'pauseScreen' : 'unPauseScreen';
    this.saveEvent(context, nodeId, componentId, componentType, category, event, data);
  }

  private saveRunStatusThenHandlePauseScreen(periodId: number, isPaused: boolean): void {
    this.saveRunStatus().subscribe(() => {
      if (isPaused) {
        this.TeacherWebSocketService.pauseScreens(periodId);
      } else {
        this.TeacherWebSocketService.unPauseScreens(periodId);
      }
    });
  }

  private saveRunStatus(): Observable<void> {
    const url = this.ConfigService.getConfigParam('runStatusURL');
    const body = new HttpParams()
      .set('runId', this.ConfigService.getConfigParam('runId'))
      .set('status', JSON.stringify(this.runStatus));
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };
    return this.http.post<void>(url, body, options);
  }

  /**
   * Update the paused value for a period in our run status
   * @param periodId the period id or -1 for all periods
   * @param isPaused whether the period is paused or not
   */
  private updatePausedRunStatusValue(periodId: number, isPaused: boolean): void {
    if (this.runStatus == null) {
      this.runStatus = this.createRunStatus();
    }
    if (periodId === -1) {
      this.updateAllPeriodsPausedValue(isPaused);
    } else {
      this.updatePeriodPausedValue(periodId, isPaused);
    }
  }

  private createRunStatus(): any {
    const periods = this.ConfigService.getPeriods();
    periods.forEach((period) => (period.paused = false));
    return {
      runId: this.ConfigService.getConfigParam('runId'),
      periods: periods
    };
  }

  private updateAllPeriodsPausedValue(isPaused: boolean): void {
    for (const period of this.runStatus.periods) {
      period.paused = isPaused;
    }
  }

  private updatePeriodPausedValue(periodId: number, isPaused: boolean): void {
    for (const period of this.runStatus.periods) {
      if (period.periodId === periodId) {
        period.paused = isPaused;
      }
    }
  }

  isWorkgroupShown(workgroup): boolean {
    return (
      this.isWorkgroupInCurrentPeriod(workgroup) &&
      workgroup.workgroupId != null &&
      (this.currentWorkgroup == null || this.isCurrentWorkgroup(workgroup.workgroupId))
    );
  }

  isWorkgroupInCurrentPeriod(workgroup: any): boolean {
    return this.currentPeriod.periodId === -1 || workgroup.periodId === this.currentPeriod.periodId;
  }

  isCurrentWorkgroup(workgroupId: number): boolean {
    return this.currentWorkgroup.workgroupId === workgroupId;
  }
}
