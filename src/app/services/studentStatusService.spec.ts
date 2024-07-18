import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentStatus } from '../../assets/wise5/common/StudentStatus';
import { ConfigService } from '../../assets/wise5/services/configService';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { StudentStatusService } from '../../assets/wise5/services/studentStatusService';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { NodeProgressService } from '../../assets/wise5/services/nodeProgressService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { ProjectLocale } from '../domain/projectLocale';

let configService: ConfigService;
let http: HttpClient;
let nodeProgressService: NodeProgressService;
let service: StudentStatusService;
let studentDataService: StudentDataService;

const runId = 1;
const periodId = 2;
const workgroupId = 3;
const nodeId = 'node1';
const nodeStatuses = {};
const projectCompletion = {
  totalItems: 2,
  totalItemsWithWork: 0,
  completedItems: 1,
  completedItemsWithWork: 0
};
const computerAvatarId = 'robot1';
const studentStatusUrl = '/api/studentStatus';

describe('StudentStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule]
    });
    configService = TestBed.inject(ConfigService);
    http = TestBed.inject(HttpClient);
    nodeProgressService = TestBed.inject(NodeProgressService);
    service = TestBed.inject(StudentStatusService);
    studentDataService = TestBed.inject(StudentDataService);
  });
  retrieveStudentStatus();
  saveStudentStatus();
});

function retrieveStudentStatus() {
  describe('retrieveStudentStatus()', () => {
    retrieveStudentStatus_ReceiveNull_SetNewStatus();
    retrieveStudentStatus_ReceiveStudentStatus_SetStudentStatus();
  });
}

function retrieveStudentStatus_ReceiveNull_SetNewStatus() {
  it('should retrieve new student status when backend returns null', () => {
    setIsPreview(false);
    expectNewStudentStatus();
    const httpGetSpy = spyOn(http, 'get').and.returnValue(of(null));
    service.retrieveStudentStatus();
    expect(httpGetSpy).toHaveBeenCalled();
    expect(service.getStudentStatus()).toEqual(new StudentStatus());
  });
}

function retrieveStudentStatus_ReceiveStudentStatus_SetStudentStatus() {
  it('should retrieve student status and receive a student status', () => {
    setIsPreview(false);
    expectNewStudentStatus();
    const studentStatus = new StudentStatus({ computerAvatarId: 'robot1' });
    const studentStatusWrapper = createStudentStatusWrapper(studentStatus);
    const httpGetSpy = spyOn(http, 'get').and.returnValue(of(studentStatusWrapper));
    service.retrieveStudentStatus();
    expect(httpGetSpy).toHaveBeenCalled();
    expect(service.getStudentStatus()).toEqual(studentStatus);
  });
}

function saveStudentStatus() {
  describe('saveStudentStatus()', () => {
    saveStudentStatus_nodeStatusChanged_PostStudentStatus();
  });
}

function saveStudentStatus_nodeStatusChanged_PostStudentStatus() {
  it('should post student status on nodeStatusChanged', () => {
    setIsPreview(false);
    setIsRunActive(true);
    spyOn(configService, 'getRunId').and.returnValue(runId);
    spyOn(configService, 'getPeriodId').and.returnValue(periodId);
    spyOn(configService, 'getWorkgroupId').and.returnValue(workgroupId);
    spyOn(configService, 'getStudentStatusURL').and.returnValue(studentStatusUrl);
    spyOn(studentDataService, 'getCurrentNodeId').and.returnValue(nodeId);
    spyOn(nodeProgressService, 'getNodeProgress').and.returnValue(projectCompletion);
    spyOn(TestBed.inject(ProjectService), 'getLocale').and.returnValue(
      new ProjectLocale({ default: 'en_US', supported: [] })
    );
    const httpPostSpy = spyOn(http, 'post').and.callFake((url: string, body: any) => {
      return of({} as any);
    });
    service.setComputerAvatarId(computerAvatarId);
    studentDataService.broadcastNodeStatusesChanged();
    const studentStatusJSON = {
      runId: runId,
      periodId: periodId,
      workgroupId: workgroupId,
      currentNodeId: nodeId,
      nodeStatuses: nodeStatuses,
      projectCompletion: projectCompletion,
      computerAvatarId: computerAvatarId
    };
    const studentStatusParams = createStudentStatusParams(
      runId,
      periodId,
      workgroupId,
      studentStatusJSON
    );
    expect(httpPostSpy).toHaveBeenCalledWith(studentStatusUrl, studentStatusParams);
  });
}

function setIsPreview(value: boolean) {
  spyOn(TestBed.inject(ConfigService), 'isPreview').and.returnValue(value);
}

function setIsRunActive(value: boolean) {
  spyOn(TestBed.inject(ConfigService), 'isRunActive').and.returnValue(value);
}

function expectNewStudentStatus() {
  expect(service.getStudentStatus()).toEqual(new StudentStatus());
}

function createStudentStatusWrapper(studentStatus: StudentStatus): any {
  return {
    status: JSON.stringify(studentStatus)
  };
}

function createStudentStatusParams(
  runId: number,
  periodId: number,
  workgroupId: number,
  status: any
): any {
  return {
    runId: runId,
    periodId: periodId,
    workgroupId: workgroupId,
    status: JSON.stringify(status)
  };
}
