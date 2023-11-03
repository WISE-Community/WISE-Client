import { of } from 'rxjs';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { DataExportComponent } from '../data-export/data-export.component';
import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';
import { millisecondsToDateTime } from '../../../common/datetime/datetime';

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
  endTimeMilliseconds: number = 1606780800000;
  endDate = millisecondsToDateTime(this.endTimeMilliseconds);
  generateCSVFileSpy: jasmine.Spy;
  nodeId: string = 'node1';
  nodePositionAndTitle: string = '1.1: Test Step';
  periodName: string = 'Period 1';
  projectId: number = 10;
  projectTitle: string = 'Test Project';
  runId: number = 10;
  startTimeMilliseconds: number = 1577836800000;
  startDate = millisecondsToDateTime(this.startTimeMilliseconds);
  stepNumber: string = '1.1';
  studentName1 = 'Student A';
  studentName2 = 'Student B';
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
    const controller = new DataExportComponent(
      this.annotationService,
      null,
      this.configService,
      this.dataExportService,
      null,
      null,
      this.teacherProjectService,
      null,
      null,
      this.teacherDataService
    );
    spyOn(controller, 'showDownloadingExportMessage').and.callFake(() => {});
    this.generateCSVFileSpy = spyOn(controller, 'generateCSVFile').and.callFake(() => {});
    spyOn(controller, 'hideDownloadingExportMessage').and.callFake(() => {});
    controller.includeStudentNames = true;
    return controller;
  }

  setStudentData(componentStates: any[]): void {
    spyOn(this.teacherDataService, 'getComponentStatesByComponentId').and.returnValue(
      componentStates
    );
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
}
