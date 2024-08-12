import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ClassroomStatusService } from '../../assets/wise5/services/classroomStatusService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { NodeProgress } from '../../assets/wise5/common/NodeProgress';
import { createStudentStatus } from '../../assets/wise5/common/StudentStatus';
import { NodeStatus } from '../../assets/wise5/common/NodeStatus';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { copy } from '../../assets/wise5/common/object/object';
import * as project from './sampleData/curriculum/ClassroomStatusServiceSpec.project.json';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let configService: ConfigService;
let projectService: ProjectService;
let service: ClassroomStatusService;
let http: HttpTestingController;

const groupId1 = 'group1';
const nodeId1 = 'node1';
const nodeId2 = 'node2';
const nodeId3 = 'node3';
const nodeId4 = 'node4';
let nodeStatusesWorkgroup1: any;
let nodeStatusesWorkgroup2: any;
const periodId1 = 1;
let projectProgressWorkgroup1: NodeProgress;
let projectProgressWorkgroup2: NodeProgress;
const runId1 = 1;
const workgroupId1 = 1;
const workgroupId2 = 2;

describe('ClassroomStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StudentTeacherCommonServicesModule],
    providers: [ClassroomStatusService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ClassroomStatusService);
    configService = TestBed.inject(ConfigService);
    projectService = TestBed.inject(ProjectService);

    // The project structure looks like this
    // group1
    //   node1 HTML
    //   node2 HTML and Open Response
    //   node3 Multiple Choice
    //   node4 HTML
    projectService.setProject(copy(project));
  });
  retrieveStudentStatuses();
  getNodeCompletion();
});

function retrieveStudentStatuses() {
  describe('retrieveStudentStatuses', () => {
    retrieveStudentStatuses_SetStudentStatuses();
  });
}

function retrieveStudentStatuses_SetStudentStatuses() {
  it('retrieve and set student statuses for current run', () => {
    const runId = 1;
    const workgroup2Id = 2;
    const statusPostTimestamp = 12345;
    const workgroupsInRun = [{ workgroupId: workgroup2Id }];
    spyOn(configService, 'getRunId').and.returnValue(runId);
    spyOn(configService, 'getClassmateUserInfos').and.returnValue(workgroupsInRun);
    service.retrieveStudentStatuses().subscribe();
    http.expectOne(`/api/teacher/run/${runId}/student-status`).flush([
      {
        status: `{"runId": ${runId}, "workgroupId": ${workgroup2Id}}`,
        timestamp: statusPostTimestamp,
        workgroupId: workgroup2Id
      },
      {
        status: -1,
        timestamp: -1,
        workgroupId: -1
      }
    ]);
    expect(configService.getRunId).toHaveBeenCalled();
    expect(configService.getClassmateUserInfos).toHaveBeenCalled();
    expect(service.studentStatuses.length).toEqual(1);
    expect(service.studentStatuses[0].workgroupId).toEqual(workgroup2Id);
    expect(service.studentStatuses[0].postTimestamp).toEqual(statusPostTimestamp);
  });
}

function getNodeCompletion() {
  describe('getNodeCompletion', () => {
    beforeEach(() => {
      // workgroup 1 has finished all 4 steps
      projectProgressWorkgroup1 = new NodeProgress(4, 2, 100, 100, 4, 2);
      nodeStatusesWorkgroup1 = createNodeStatuses();

      // workgroup 2 has finished 2 of 4 steps
      projectProgressWorkgroup2 = new NodeProgress(2, 1, 50, 50, 4, 2);
      nodeStatusesWorkgroup2 = createNodeStatuses();
      nodeStatusesWorkgroup2[groupId1].progress = new NodeProgress(2, 1, 50, 50, 4, 2);
      nodeStatusesWorkgroup2[nodeId3].isCompleted = false;
      nodeStatusesWorkgroup2[nodeId4].isCompleted = false;

      service.studentStatuses = [
        createStudentStatus(
          null,
          nodeId4,
          nodeStatusesWorkgroup1,
          periodId1,
          projectProgressWorkgroup1,
          runId1,
          workgroupId1
        ),
        createStudentStatus(
          null,
          nodeId2,
          nodeStatusesWorkgroup2,
          periodId1,
          projectProgressWorkgroup2,
          runId1,
          workgroupId2
        )
      ];
    });
    getNodeCompletion_GroupNode();
    getNodeCompletion_StepNode();
  });
}

function getNodeCompletion_GroupNode() {
  describe('get lesson completion', () => {
    getNodeCompletion_GroupNode_AllWorkgroups();
    getNodeCompletion_GroupNode_OneWorkgroup();
  });
}

function getNodeCompletion_GroupNode_AllWorkgroups() {
  describe('for all workgroups', () => {
    getNodeCompletion_GroupNode_AllWorkgroups_AllSteps();
    getNodeCompletion_GroupNode_AllWorkgroups_OnlyWorkSteps();
  });
}

function getNodeCompletion_GroupNode_AllWorkgroups_AllSteps() {
  describe('for all steps', () => {
    it('returns the group completion for all the workgroups', () => {
      const lessonCompletion = service.getNodeCompletion(groupId1, periodId1, null, false);
      expectCompletion(lessonCompletion, 6, 8, 75);
    });
  });
}

function getNodeCompletion_GroupNode_AllWorkgroups_OnlyWorkSteps() {
  describe('for only work steps', () => {
    describe('lesson node status is new version', () => {
      it('returns the group completion for all the workgroups', () => {
        const lessonCompletion = service.getNodeCompletion(groupId1, periodId1, null, true);
        expectCompletion(lessonCompletion, 3, 4, 75);
      });
    });
    describe('lesson node status is legacy version', () => {
      it('returns the group completion for all the workgroups', () => {
        nodeStatusesWorkgroup1[groupId1].progress = null;
        nodeStatusesWorkgroup2[groupId1].progress = null;
        const lessonCompletion = service.getNodeCompletion(groupId1, periodId1, null, true);
        expectCompletion(lessonCompletion, 3, 4, 75);
      });
    });
  });
}

function getNodeCompletion_GroupNode_OneWorkgroup() {
  describe('for a specific workgroup', () => {
    getNodeCompletion_GroupNode_OneWorkgroup_AllSteps();
    getNodeCompletion_GroupNode_OneWorkgroup_OnlyWorkSteps();
  });
}

function getNodeCompletion_GroupNode_OneWorkgroup_AllSteps() {
  describe('for all steps', () => {
    it('returns the group completion for the workgroup', () => {
      const lessonCompletion = service.getNodeCompletion(groupId1, periodId1, workgroupId1, false);
      expectCompletion(lessonCompletion, 4, 4, 100);
    });
  });
}

function getNodeCompletion_GroupNode_OneWorkgroup_OnlyWorkSteps() {
  describe('for only work steps', () => {
    describe('lesson node status is new version', () => {
      it('returns the group completion for the workgroup', () => {
        const lessonCompletion = service.getNodeCompletion(groupId1, periodId1, workgroupId1, true);
        expectCompletion(lessonCompletion, 2, 2, 100);
      });
    });
    describe('lesson node status is legacy version', () => {
      it('returns the group completion for the workgroup', () => {
        nodeStatusesWorkgroup1[groupId1].progress = null;
        const lessonCompletion = service.getNodeCompletion(groupId1, periodId1, workgroupId1, true);
        expectCompletion(lessonCompletion, 2, 2, 100);
      });
    });
  });
}

function getNodeCompletion_StepNode() {
  describe('get step completion for all workgroups', () => {
    it('returns the step completion for all the workgroups', () => {
      const nodeCompletion = service.getNodeCompletion(nodeId3, periodId1);
      expectCompletion(nodeCompletion, 1, 2, 50);
    });
  });
  describe('get step completion for a workgroup that has completed the step', () => {
    it('returns the step completion for the workgroup', () => {
      const nodeCompletion = service.getNodeCompletion(nodeId3, periodId1, workgroupId1);
      expectCompletion(nodeCompletion, 1, 1, 100);
    });
  });
  describe('get step completion for a workgroup that has not completed the step', () => {
    it('returns the step completion for the workgroup', () => {
      const nodeCompletion = service.getNodeCompletion(nodeId3, periodId1, workgroupId2);
      expectCompletion(nodeCompletion, 0, 1, 0);
    });
  });
  describe('get step completion for a workgroup that can not see the step', () => {
    it('returns the step completion for the workgroup', () => {
      nodeStatusesWorkgroup2[nodeId3].isVisible = false;
      nodeStatusesWorkgroup2[nodeId4].isVisible = false;
      const nodeCompletion = service.getNodeCompletion(nodeId3, periodId1, workgroupId2);
      expectCompletion(nodeCompletion, 0, 0, 0);
    });
  });
}

function createNodeStatuses() {
  const nodeStatuses = {};
  const groupNodeStatus = new NodeStatus(groupId1);
  groupNodeStatus.progress = new NodeProgress(4, 2, 100, 100, 4, 2);
  nodeStatuses[groupId1] = groupNodeStatus;
  nodeStatuses[nodeId1] = new NodeStatus(nodeId1);
  nodeStatuses[nodeId2] = new NodeStatus(nodeId2);
  nodeStatuses[nodeId3] = new NodeStatus(nodeId3);
  nodeStatuses[nodeId4] = new NodeStatus(nodeId4);
  return nodeStatuses;
}

function expectCompletion(
  nodeCompletion: any,
  expectedCompletedItems: number,
  expectedTotalItems: number,
  expectedCompletionPct: number
) {
  expect(nodeCompletion.completedItems).toEqual(expectedCompletedItems);
  expect(nodeCompletion.totalItems).toEqual(expectedTotalItems);
  expect(nodeCompletion.completionPct).toEqual(expectedCompletionPct);
}
