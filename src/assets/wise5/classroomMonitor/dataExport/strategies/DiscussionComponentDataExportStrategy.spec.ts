import { of } from 'rxjs';
import { DataExportService } from '../../../services/dataExportService';
import { DataExportComponent } from '../data-export/data-export.component';
import { DiscussionComponentDataExportStrategy } from './DiscussionComponentDataExportStrategy';
import { TeacherDataService } from '../../../services/teacherDataService';
import { ConfigService } from '../../../services/configService';
import { AnnotationService } from '../../../services/annotationService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';

const componentId = 'component1';
const componentPosition = 0;
const componentPrompt = 'Discuss with your classmates.';
const componentType = 'Discussion';
const nodeId = 'node1';
const nodePositionAndTitle = '1.1: Discuss';
const periodName = 'Period 1';
const projectId = 10;
const projectTitle = 'Discussion Project';
const runId = 10;
const stepNumber = '1.1';
const studentName1 = 'Student A';
const studentName2 = 'Student B';
const studentWorkId1 = 10000;
const studentWorkId2 = 10001;
const studentWorkResponse1 = 'Hello';
const studentWorkResponse2 = 'World';
const userId1 = 100;
const userId2 = 101;
const workgroupId1 = 1000;
const workgroupId2 = 1001;

const componentPartNumber = componentPosition + 1;
const studentData1 = { response: studentWorkResponse1 };
const studentData2 = { componentStateIdReplyingTo: studentWorkId1, response: studentWorkResponse2 };
const workgroupUserInfo1 = {
  periodName: periodName,
  users: [{ id: userId1, name: studentName1 }]
};
const workgroupUserInfo2 = {
  periodName: periodName,
  users: [{ id: userId2, name: studentName2 }]
};

const annotationService: AnnotationService = new AnnotationService(null, null, null);
let configService: ConfigService;
let dataExportService: DataExportService;
let discussionExportStrategy: DiscussionComponentDataExportStrategy;
let generateCSVFileSpy: jasmine.Spy;
let teacherDataService: TeacherDataService;
let teacherProjectService: TeacherProjectService;
const teacherWebSocketService: TeacherWebSocketService = new TeacherWebSocketService(
  null,
  null,
  null,
  null
);

describe('DiscussionComponentDataExportStrategy', () => {
  describe('export', () => {
    it('generates export with correct rows of data', () => {
      setUpServices();
      setUpDiscussionExportStrategy();
      setStudentData([
        createDiscussionComponentState(studentWorkId1, workgroupId1, studentData1),
        createDiscussionComponentState(studentWorkId2, workgroupId2, studentData2)
      ]);
      discussionExportStrategy.export();
      expect(discussionExportStrategy.controller.generateCSVFile).toHaveBeenCalledWith(
        [
          discussionExportStrategy.defaultDiscussionColumnNames,
          [
            1,
            workgroupId1,
            userId1,
            studentName1,
            '',
            '',
            '',
            '',
            periodName,
            projectId,
            projectTitle,
            runId,
            '',
            '',
            '',
            '',
            nodeId,
            componentId,
            componentPartNumber,
            nodePositionAndTitle,
            componentType,
            componentPrompt,
            studentData1,
            studentWorkId1,
            studentWorkId1,
            1,
            studentWorkResponse1
          ],
          [
            2,
            workgroupId2,
            userId2,
            studentName2,
            '',
            '',
            '',
            '',
            periodName,
            projectId,
            projectTitle,
            runId,
            '',
            '',
            '',
            '',
            nodeId,
            componentId,
            componentPartNumber,
            nodePositionAndTitle,
            componentType,
            componentPrompt,
            studentData2,
            studentWorkId1,
            studentWorkId2,
            2,
            studentWorkResponse2
          ]
        ],
        `${runId}_step_${stepNumber}_component_${componentPartNumber}_discussion_work.csv`
      );
    });
  });
});

function setUpServices(): void {
  setUpConfigService();
  setUpDataExportService();
  setUpTeacherProjectService();
  setUpTeacherDataService();
}

function setUpConfigService(): void {
  configService = new ConfigService(null, null);
  spyOn(configService, 'getUserInfoByWorkgroupId').and.callFake((workgroupId: number) => {
    switch (workgroupId) {
      case workgroupId1:
        return workgroupUserInfo1;
      case workgroupId2:
        return workgroupUserInfo2;
    }
  });
  spyOn(configService, 'getRunId').and.returnValue(runId);
  spyOn(configService, 'getProjectId').and.returnValue(projectId);
}

function setUpDataExportService(): void {
  dataExportService = new DataExportService(null, null, null);
  spyOn(dataExportService, 'retrieveStudentData').and.returnValue(of({}));
}

function setUpTeacherProjectService(): void {
  teacherProjectService = new TeacherProjectService(null, null, null, null, null);
  spyOn(teacherProjectService, 'getNodePositionById').and.returnValue(stepNumber);
  spyOn(teacherProjectService, 'getNodePositionAndTitle').and.returnValue(nodePositionAndTitle);
  spyOn(teacherProjectService, 'getComponentPosition').and.returnValue(componentPosition);
  spyOn(teacherProjectService, 'getProjectTitle').and.returnValue(projectTitle);
}

function setUpTeacherDataService(): void {
  teacherDataService = new TeacherDataService(
    null,
    annotationService,
    configService,
    teacherProjectService,
    teacherWebSocketService
  );
}

function setUpDiscussionExportStrategy(): void {
  discussionExportStrategy = new DiscussionComponentDataExportStrategy(nodeId, {
    id: componentId,
    type: componentType,
    prompt: componentPrompt
  });
  discussionExportStrategy.controller = createDataExportComponent();
  discussionExportStrategy.dataExportService = dataExportService;
  discussionExportStrategy.teacherDataService = teacherDataService;
  discussionExportStrategy.configService = configService;
  discussionExportStrategy.projectService = teacherProjectService;
}

function createDataExportComponent(): any {
  const controller = new DataExportComponent(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );
  spyOn(controller, 'showDownloadingExportMessage').and.callFake(() => {});
  generateCSVFileSpy = spyOn(controller, 'generateCSVFile').and.callFake(() => {});
  spyOn(controller, 'hideDownloadingExportMessage').and.callFake(() => {});
  controller.includeStudentNames = true;
  return controller;
}

function createDiscussionComponentState(id: number, workgroupId: number, studentData: any): any {
  const componentState = {
    id: id,
    workgroupId: workgroupId,
    studentData: studentData
  };
  return componentState;
}

function setStudentData(componentStates: any[]): void {
  spyOn(teacherDataService, 'getComponentStatesByComponentId').and.returnValue(componentStates);
}
