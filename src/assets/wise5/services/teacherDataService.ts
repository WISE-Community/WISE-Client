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
import { getIntersectOfArrays } from '../common/array/array';
import { serverSaveTimeComparator } from '../common/object/object';
import { Annotation } from '../common/Annotation';

@Injectable()
export class TeacherDataService extends DataService {
  studentData: any;
  currentPeriod = null;
  currentWorkgroup = null;
  previousStep = null;
  periods = [];
  nodeGradingSort = 'team';
  studentGradingSort = 'step';
  studentProgressSort = 'team';
  private currentPeriodChangedSource: Subject<any> = new Subject<any>();
  public currentPeriodChanged$: Observable<any> = this.currentPeriodChangedSource.asObservable();
  private currentWorkgroupChangedSource: Subject<any> = new Subject<any>();
  public currentWorkgroupChanged$: Observable<any> =
    this.currentWorkgroupChangedSource.asObservable();

  constructor(
    private annotationService: AnnotationService,
    private configService: ConfigService,
    private http: HttpClient,
    protected projectService: TeacherProjectService,
    private webSocketService: TeacherWebSocketService
  ) {
    super(projectService);
    this.studentData = {
      annotationsByNodeId: {},
      annotationsToWorkgroupId: {},
      componentStatesByWorkgroupId: {},
      componentStatesByNodeId: {},
      componentStatesByComponentId: {}
    };
    this.subscribeToEvents();
  }

  private subscribeToEvents(): void {
    this.annotationService.annotationSavedToServer$.subscribe((annotation: Annotation) => {
      this.handleAnnotationReceived(annotation);
    });

    this.webSocketService.newAnnotationReceived$.subscribe((annotation: Annotation) => {
      this.handleAnnotationReceived(annotation);
    });

    this.webSocketService.newStudentWorkReceived$.subscribe(({ studentWork }) => {
      this.addOrUpdateComponentState(studentWork);
      this.broadcastStudentWorkReceived({ studentWork: studentWork });
    });
  }

  private handleAnnotationReceived(annotation: Annotation): void {
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
    this.annotationService.setAnnotations(this.studentData.annotations);
    this.annotationService.broadcastAnnotationReceived(annotation);
  }

  saveEvent(context, nodeId, componentId, componentType, category, event, data) {
    const newEvent = {
      projectId: this.configService.getProjectId(),
      runId: this.configService.getRunId(),
      workgroupId: this.configService.getWorkgroupId(),
      clientSaveTime: new Date().getTime(),
      context: context,
      nodeId: nodeId,
      componentId: componentId,
      type: componentType,
      category: category,
      event: event,
      data: data
    };
    let body = new HttpParams().set('events', JSON.stringify([newEvent]));
    body = this.addCommonParams(body);
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };
    const url = this.configService.getConfigParam('teacherDataURL');
    return this.http
      .post(url, body, options)
      .toPromise()
      .then((data: any) => {
        return data.events;
      });
  }

  private addCommonParams(params: any): any {
    params = this.addProjectIdToHttpParams(params);
    params = this.addRunIdToHttpParams(params);
    params = this.addWorkgroupIdToHttpParams(params);
    return params;
  }

  private addProjectIdToHttpParams(params: any): any {
    const projectId = this.configService.getProjectId();
    return projectId != null ? params.set('projectId', projectId) : params;
  }

  private addRunIdToHttpParams(params: any): any {
    const runId = this.configService.getRunId();
    return runId != null ? params.set('runId', runId) : params;
  }

  private addWorkgroupIdToHttpParams(params: any): any {
    const workgroupId = this.configService.getWorkgroupId();
    return workgroupId != null ? params.set('workgroupId', workgroupId) : params;
  }

  retrieveStudentDataForNode(node: Node): Observable<any> {
    let params = new HttpParams()
      .set('runId', this.configService.getRunId())
      .set('getStudentWork', 'true')
      .set('getAnnotations', 'false')
      .set('getEvents', 'true');
    const components = node.getAllRelatedComponents();
    if (components.length > 0) {
      params = params.set('components', compressToEncodedURIComponent(JSON.stringify(components)));
    }
    return this.retrieveStudentData(params);
  }

  retrieveStudentDataByWorkgroupId(workgroupId: string): Observable<any> {
    const params = new HttpParams()
      .set('runId', this.configService.getRunId())
      .set('workgroupId', workgroupId)
      .set('toWorkgroupId', workgroupId)
      .set('getStudentWork', 'true')
      .set('getEvents', 'false')
      .set('getAnnotations', 'false');
    return this.retrieveStudentData(params);
  }

  retrieveAnnotations(): Observable<any> {
    const params = new HttpParams()
      .set('runId', this.configService.getRunId())
      .set('getStudentWork', 'false')
      .set('getEvents', 'false')
      .set('getAnnotations', 'true');
    return this.retrieveStudentData(params);
  }

  retrieveStudentData(params): Observable<any> {
    const url = this.configService.getConfigParam('teacherDataURL');
    const options = {
      params: params
    };
    return this.http.get(url, options).pipe(
      tap((data: any) => {
        this.handleStudentDataResponse(data);
      })
    );
  }

  private handleStudentDataResponse(resultData: any): any {
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

  processComponentStates(componentStates: any[]): void {
    this.initializeComponentStatesDataStructures();
    componentStates.forEach((componentState) => this.addOrUpdateComponentState(componentState));
  }

  private initializeComponentStatesDataStructures(): void {
    this.studentData.componentStatesByWorkgroupId = {};
    this.studentData.componentStatesByNodeId = {};
    this.studentData.componentStatesByComponentId = {};
  }

  private processEvents(events: any[]): void {
    events.sort(serverSaveTimeComparator);
    this.studentData.allEvents = events;
    this.studentData.eventsByWorkgroupId = {};
    this.studentData.eventsByNodeId = {};
    events.forEach((event) => {
      this.addEventToEventsByWorkgroupId(event);
      this.addEventToEventsByNodeId(event);
    });
  }

  private addEventToEventsByWorkgroupId(event: any): void {
    const eventWorkgroupId = event.workgroupId;
    if (this.studentData.eventsByWorkgroupId[eventWorkgroupId] == null) {
      this.studentData.eventsByWorkgroupId[eventWorkgroupId] = new Array();
    }
    this.studentData.eventsByWorkgroupId[eventWorkgroupId].push(event);
  }

  private addEventToEventsByNodeId(event: any): void {
    const eventNodeId = event.nodeId;
    if (this.studentData.eventsByNodeId[eventNodeId] == null) {
      this.studentData.eventsByNodeId[eventNodeId] = new Array();
    }
    this.studentData.eventsByNodeId[eventNodeId].push(event);
  }

  private processAnnotations(annotations: any[]): void {
    this.studentData.annotationsByNodeId = {};
    this.studentData.annotationsToWorkgroupId = {};
    this.studentData.annotations = annotations;
    annotations.forEach((annotation) => {
      this.addAnnotationToAnnotationsToWorkgroupId(annotation);
      this.addAnnotationToAnnotationsByNodeId(annotation);
    });
    this.annotationService.setAnnotations(this.studentData.annotations);
  }

  private addAnnotationToAnnotationsToWorkgroupId(annotation: any): void {
    const annotationWorkgroupId = annotation.toWorkgroupId;
    if (!this.studentData.annotationsToWorkgroupId[annotationWorkgroupId]) {
      this.studentData.annotationsToWorkgroupId[annotationWorkgroupId] = new Array();
    }
    this.studentData.annotationsToWorkgroupId[annotationWorkgroupId].push(annotation);
  }

  private addAnnotationToAnnotationsByNodeId(annotation: any): void {
    const annotationNodeId = annotation.nodeId;
    if (!this.studentData.annotationsByNodeId[annotationNodeId]) {
      this.studentData.annotationsByNodeId[annotationNodeId] = new Array();
    }
    this.studentData.annotationsByNodeId[annotationNodeId].push(annotation);
  }

  private addOrUpdateComponentState(componentState: any): void {
    this.addComponentStateByWorkgroupId(componentState);
    this.addComponentStateByNodeId(componentState);
    this.addComponentStateByComponentId(componentState);
  }

  private addComponentStateByWorkgroupId(componentState: any): void {
    const workgroupId = componentState.workgroupId;
    this.initializeComponentStatesByWorkgroupIdIfNecessary(workgroupId);
    const index = this.studentData.componentStatesByWorkgroupId[
      componentState.workgroupId
    ].findIndex((state) => state.id === componentState.id);
    if (index != -1) {
      this.studentData.componentStatesByWorkgroupId[workgroupId][index] = componentState;
    } else {
      this.studentData.componentStatesByWorkgroupId[workgroupId].push(componentState);
    }
  }

  private initializeComponentStatesByWorkgroupIdIfNecessary(workgroupId: string): void {
    if (this.studentData.componentStatesByWorkgroupId[workgroupId] == null) {
      this.studentData.componentStatesByWorkgroupId[workgroupId] = [];
    }
  }

  private addComponentStateByNodeId(componentState: any): void {
    const nodeId = componentState.nodeId;
    this.initializeComponentStatesByNodeIdIfNecessary(nodeId);
    const index = this.studentData.componentStatesByNodeId[componentState.nodeId].findIndex(
      (state) => state.id === componentState.id
    );
    if (index != -1) {
      this.studentData.componentStatesByNodeId[nodeId][index] = componentState;
    } else {
      this.studentData.componentStatesByNodeId[nodeId].push(componentState);
    }
  }

  private initializeComponentStatesByNodeIdIfNecessary(nodeId: string): void {
    if (this.studentData.componentStatesByNodeId[nodeId] == null) {
      this.studentData.componentStatesByNodeId[nodeId] = [];
    }
  }

  private addComponentStateByComponentId(componentState: any): void {
    const componentId = componentState.componentId;
    this.initializeComponentStatesByComponentIdIfNecessary(componentId);
    const index = this.studentData.componentStatesByComponentId[
      componentState.componentId
    ].findIndex((state) => state.id === componentState.id);
    if (index != -1) {
      this.studentData.componentStatesByComponentId[componentId][index] = componentState;
    } else {
      this.studentData.componentStatesByComponentId[componentId].push(componentState);
    }
  }

  private initializeComponentStatesByComponentIdIfNecessary(componentId: string): void {
    if (this.studentData.componentStatesByComponentId[componentId] == null) {
      this.studentData.componentStatesByComponentId[componentId] = [];
    }
  }

  getComponentStatesByWorkgroupId(workgroupId: number): any[] {
    return this.studentData.componentStatesByWorkgroupId[workgroupId] || [];
  }

  getComponentStatesByNodeId(nodeId: string): any[] {
    return this.studentData.componentStatesByNodeId[nodeId] || [];
  }

  getComponentStatesByComponentId(componentId: string): any[] {
    return this.studentData.componentStatesByComponentId[componentId] || [];
  }

  getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(workgroupId, nodeId, componentId) {
    return (
      this.getComponentStatesByWorkgroupIdAndNodeId(workgroupId, nodeId).findLast(
        (componentState) =>
          componentState.nodeId === nodeId && componentState.componentId === componentId
      ) ?? null
    );
  }

  getLatestComponentStateByWorkgroupIdNodeId(workgroupId: number, nodeId: string): any {
    return (
      this.getComponentStatesByWorkgroupIdAndNodeId(workgroupId, nodeId).findLast(
        (componentState) => componentState.nodeId === nodeId
      ) ?? null
    );
  }

  private getComponentStatesByWorkgroupIdAndNodeId(workgroupId: number, nodeId: string): any[] {
    const componentStatesByWorkgroupId = this.getComponentStatesByWorkgroupId(workgroupId);
    const componentStatesByNodeId = this.getComponentStatesByNodeId(nodeId);
    return getIntersectOfArrays(componentStatesByWorkgroupId, componentStatesByNodeId);
  }

  getComponentStatesByWorkgroupIdAndComponentId(workgroupId: number, componentId: string): any[] {
    const componentStatesByWorkgroupId = this.getComponentStatesByWorkgroupId(workgroupId);
    const componentStatesByComponentId = this.getComponentStatesByComponentId(componentId);
    return getIntersectOfArrays(componentStatesByWorkgroupId, componentStatesByComponentId);
  }

  getEventsByWorkgroupId(workgroupId: number): any[] {
    return this.studentData.eventsByWorkgroupId[workgroupId] || [];
  }

  getEventsByNodeId(nodeId: string): any[] {
    return this.studentData.eventsByNodeId[nodeId] || [];
  }

  getAnnotationsToWorkgroupId(workgroupId: number): any[] {
    return this.studentData.annotationsToWorkgroupId[workgroupId] || [];
  }

  getAnnotationsByNodeId(nodeId: string): any[] {
    return this.studentData.annotationsByNodeId[nodeId] || [];
  }

  setCurrentPeriod(period: any): void {
    const previousPeriod = this.currentPeriod;
    this.currentPeriod = period;
    this.clearCurrentWorkgroupIfNecessary(this.currentPeriod.periodId);
    if (previousPeriod == null || previousPeriod.periodId != this.currentPeriod.periodId) {
      this.currentPeriodChangedSource.next({
        previousPeriod: previousPeriod,
        currentPeriod: this.currentPeriod
      });
    }
  }

  private clearCurrentWorkgroupIfNecessary(periodId: number): void {
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

  getCurrentPeriod(): any {
    return this.currentPeriod;
  }

  getCurrentPeriodId(): number {
    return this.currentPeriod.periodId;
  }

  getPeriods(): any[] {
    return this.periods;
  }

  setPeriods(periods: any[]): void {
    this.periods = periods;
  }

  setCurrentWorkgroup(workgroup: any): void {
    this.currentWorkgroup = workgroup;
    this.currentWorkgroupChangedSource.next({ currentWorkgroup: this.currentWorkgroup });
  }

  getCurrentWorkgroup(): any {
    return this.currentWorkgroup;
  }

  getTotalScoreByWorkgroupId(workgroupId: number) {
    return this.annotationService.getTotalScore(
      this.studentData.annotationsToWorkgroupId[workgroupId]
    );
  }

  isWorkgroupShown(workgroup): boolean {
    return (
      this.isWorkgroupInCurrentPeriod(workgroup) &&
      workgroup.workgroupId != null &&
      (this.currentWorkgroup == null || this.isCurrentWorkgroup(workgroup.workgroupId))
    );
  }

  private isWorkgroupInCurrentPeriod(workgroup: any): boolean {
    return this.currentPeriod.periodId === -1 || workgroup.periodId === this.currentPeriod.periodId;
  }

  private isCurrentWorkgroup(workgroupId: number): boolean {
    return this.currentWorkgroup.workgroupId === workgroupId;
  }

  getPreviewUrl(): string {
    let previewUrl = this.configService.getConfigParam('previewProjectURL');
    const currentNodeId = this.getCurrentNodeId();
    if (!this.projectService.isGroupNode(currentNodeId)) {
      previewUrl += `/${currentNodeId}`;
    }
    return previewUrl;
  }
}
