import { of } from 'rxjs';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';
import { millisecondsToDateTime } from '../../../common/datetime/datetime';
import { copy } from '../../../common/object/object';
import { ComponentState } from '../../../../../app/domain/componentState';
import { Annotation } from '../../../common/Annotation';
import { ComponentDataExportParams } from '../ComponentDataExportParams';
import { ExportItemComponent } from '../export-item/export-item.component';

export class ExportStrategyTester {
  annotationService: AnnotationService = new AnnotationService(null, null, null);
  component: any;
  componentExportStrategy: any;
  componentId: string = 'component1';
  componentPrompt: string = 'This is the prompt.';
  componentPosition: number = 0;
  componentPartNumber: number = this.componentPosition + 1;
  configService: ConfigService;
  dataExportService: DataExportService;
  endTimeMilliseconds: number = 1606780800000; // 2020-11-30
  endDate = millisecondsToDateTime(this.endTimeMilliseconds);
  generateCSVFileSpy: jasmine.Spy;
  nodeId: string = 'node1';
  nodePositionAndTitle: string = '1.1: Test Step';
  periodId: number = 100;
  periodName: string = 'Period 1';
  projectId: number = 10;
  projectTitle: string = 'Test Project';
  runId: number = 10;
  startTimeMilliseconds: number = 1577836800000; // 2019-12-31
  startDate = millisecondsToDateTime(this.startTimeMilliseconds);
  stepNumber: string = '1.1';
  studentName1 = 'Student A';
  studentName2 = 'Student B';
  studentWorkId1 = 10000;
  studentWorkId2 = 10001;
  studentWorkId3 = 10002;
  studentWorkId4 = 10003;
  studentWorkResponse1 = 'Hello';
  studentWorkResponse2 = 'World';
  studentWorkResponse3 = 'Heat';
  studentWorkResponse4 = 'Energy';
  studentWorkTimestampMilliseconds1 = 1577923200000; // 2020-01-01
  studentWorkTimestampMilliseconds2 = 1578009600000; // 2020-01-02
  studentWorkTimestampMilliseconds3 = 1578009600000; // 2020-01-03
  studentWorkTimestampMilliseconds4 = 1578096000000; // 2020-01-04
  studentWorkTimestamp1 = millisecondsToDateTime(this.studentWorkTimestampMilliseconds1);
  studentWorkTimestamp2 = millisecondsToDateTime(this.studentWorkTimestampMilliseconds2);
  studentWorkTimestamp3 = millisecondsToDateTime(this.studentWorkTimestampMilliseconds3);
  studentWorkTimestamp4 = millisecondsToDateTime(this.studentWorkTimestampMilliseconds4);
  teacherDataService: TeacherDataService;
  teacherProjectService: TeacherProjectService;
  teacherWebSocketService: TeacherWebSocketService = new TeacherWebSocketService(
    null,
    null,
    null,
    null
  );
  userId1: number = 100;
  userId2: number = 101;
  workgroupId1: number = 1000;
  workgroupId2: number = 1001;
  workgroupIdToUserInfo = {};
  workgroupUserInfo1 = {
    periodName: this.periodName,
    users: [{ id: this.userId1, name: this.studentName1 }]
  };
  workgroupUserInfo2 = {
    periodName: this.periodName,
    users: [{ id: this.userId2, name: this.studentName2 }]
  };

  setUpServices(): void {
    this.setUpConfigService();
    this.setUpDataExportService();
    this.setUpTeacherProjectService();
    this.setUpTeacherDataService();
    this.setUpWorkgroups();
  }

  setUpConfigService(): void {
    this.configService = new ConfigService(null, null);
    spyOn(this.configService, 'getUserInfoByWorkgroupId').and.callFake((workgroupId: number) => {
      return this.workgroupIdToUserInfo[workgroupId];
    });
    spyOn(this.configService, 'getRunId').and.returnValue(this.runId);
    spyOn(this.configService, 'getProjectId').and.returnValue(this.projectId);
    spyOn(this.configService, 'getRunName').and.returnValue(this.projectTitle);
    this.configService.config = {
      startTime: this.startTimeMilliseconds,
      endTime: this.endTimeMilliseconds
    };
  }

  setUpDataExportService(): void {
    this.dataExportService = new DataExportService(null, null, null);
    spyOn(this.dataExportService, 'retrieveStudentData').and.returnValue(of({}));
  }

  setUpTeacherProjectService(): void {
    this.teacherProjectService = new TeacherProjectService(null, null, null, null, null);
    spyOn(this.teacherProjectService, 'getNodePositionById').and.returnValue(this.stepNumber);
    spyOn(this.teacherProjectService, 'getNodePositionAndTitle').and.returnValue(
      this.nodePositionAndTitle
    );
    spyOn(this.teacherProjectService, 'getComponentPosition').and.returnValue(
      this.componentPosition
    );
    spyOn(this.teacherProjectService, 'getProjectTitle').and.returnValue(this.projectTitle);
  }

  setUpTeacherDataService(): void {
    this.teacherDataService = new TeacherDataService(
      null,
      this.annotationService,
      this.configService,
      this.teacherProjectService,
      this.teacherWebSocketService
    );
  }

  setUpWorkgroups(): void {
    this.addWorkgroup(this.workgroupId1, this.workgroupUserInfo1);
    this.addWorkgroup(this.workgroupId2, this.workgroupUserInfo2);
  }

  setUpExportStrategy(componentExportStrategy: AbstractDataExportStrategy): void {
    this.componentExportStrategy = componentExportStrategy;
    this.componentExportStrategy.controller = this.createDataExportComponent();
    this.componentExportStrategy.annotationService = this.annotationService;
    this.componentExportStrategy.configService = this.configService;
    this.componentExportStrategy.dataExportService = this.dataExportService;
    this.componentExportStrategy.projectService = this.teacherProjectService;
    this.componentExportStrategy.teacherDataService = this.teacherDataService;
  }

  createDataExportComponent(): any {
    const controller = new ExportItemComponent(
      this.annotationService,
      this.configService,
      this.dataExportService,
      this.teacherDataService,
      null,
      this.teacherProjectService,
      null,
      null
    );
    this.generateCSVFileSpy = spyOn(
      this.componentExportStrategy,
      'generateCSVFile'
    ).and.callFake(() => {});
    return controller;
  }

  setStudentData(componentStates: any[]): void {
    this.teacherDataService.processComponentStates(componentStates);
  }

  setAnnotations(annotations: any[]): void {
    this.annotationService.annotations = annotations;
  }

  addWorkgroup(workgroupId: number, workgroupUserInfo: any): void {
    this.workgroupIdToUserInfo[workgroupId] = workgroupUserInfo;
  }

  setComponent(component: any): void {
    this.component = component;
  }

  createExpectedFileName(componentTypeWithUnderscore: string): string {
    return (
      `${this.runId}_step_${this.stepNumber}_component_` +
      `${this.componentPartNumber}_${componentTypeWithUnderscore}_work.csv`
    );
  }

  createHeaderRowInsertAdditionalColumnsBeforeResponse(
    additionalHeaderColumns: string[]
  ): string[] {
    const headerRow = copy(this.componentExportStrategy.defaultColumnNames);
    additionalHeaderColumns.forEach((columnName) => {
      headerRow.splice(headerRow.indexOf('Reponse'), 0, columnName);
    });
    return headerRow;
  }

  createHeaderRowAddAdditionalColumnsAtEnd(additionalHeaderColumns: string[]): string[] {
    const headerRow = copy(this.componentExportStrategy.defaultColumnNames);
    return headerRow.concat(additionalHeaderColumns);
  }

  createComponentDataExportParams(
    canViewStudentNames: boolean = true,
    includeOnlySubmits: boolean = false,
    includeStudentNames: boolean = true
  ): ComponentDataExportParams {
    return {
      canViewStudentNames: canViewStudentNames,
      includeOnlySubmits: includeOnlySubmits,
      includeStudentNames: includeStudentNames,
      workSelectionType: null
    };
  }

  createComponentState(
    componentType: string,
    studentWorkId: number,
    timestamp: number,
    isSubmit: boolean,
    studentData: any,
    workgroupId: number
  ): ComponentState {
    return new ComponentState({
      id: studentWorkId,
      clientSaveTime: timestamp,
      componentId: this.componentId,
      componentType: componentType,
      isSubmit: isSubmit,
      nodeId: this.nodeId,
      periodId: this.periodId,
      runId: this.runId,
      serverSaveTime: timestamp,
      studentData: studentData,
      workgroupId: workgroupId
    });
  }

  createAnnotation(
    data: any,
    studentWorkId: number,
    toWorkgroupId: number,
    type: string
  ): Annotation {
    return new Annotation({
      componentId: this.componentId,
      data: data,
      nodeId: this.nodeId,
      studentWorkId: studentWorkId,
      toWorkgroupId: toWorkgroupId,
      type: type
    });
  }
}
