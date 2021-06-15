import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { StudentStatusService } from '../../assets/wise5/services/studentStatusService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { UpgradeModule } from '@angular/upgrade/static';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { UtilService } from '../../assets/wise5/services/utilService';
import { SessionService } from '../../assets/wise5/services/sessionService';

let configService: ConfigService;
let service: StudentStatusService;
let http: HttpTestingController;

describe('StudentStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      providers: [
        AnnotationService,
        ConfigService,
        ProjectService,
        SessionService,
        StudentStatusService,
        UtilService
      ]
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(StudentStatusService);
    configService = TestBed.inject(ConfigService);
  });
  retrieveStudentStatuses();
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
    service.retrieveStudentStatuses();
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
