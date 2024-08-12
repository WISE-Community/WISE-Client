import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../../assets/wise5/services/configService';
import { CopyNodesService } from '../../assets/wise5/services/copyNodesService';
import { DataExportService } from '../../assets/wise5/services/dataExportService';
import { ClassroomStatusService } from '../../assets/wise5/services/classroomStatusService';
import { TeacherDataService } from '../../assets/wise5/services/teacherDataService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { TeacherWebSocketService } from '../../assets/wise5/services/teacherWebSocketService';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let service: DataExportService;
let configService: ConfigService;
const studentWorkgroupId = 200;
const teacherUserId = 1;
const teacherWorkgroupId = 100;

describe('DataExportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [
        ClassroomStatusService,
        CopyNodesService,
        DataExportService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(DataExportService);
    configService = TestBed.inject(ConfigService);
    spyOn(configService, 'isTeacherWorkgroupId').and.callFake((workgroupId: number) => {
      return workgroupId === teacherWorkgroupId;
    });
    spyOn(configService, 'isTeacherUserId').and.callFake((userId: number) => {
      return userId === teacherUserId;
    });
  });

  isTeacherEvent();
});

function isTeacherEvent() {
  it('should check if an event is a teacher event when it is', () => {
    const event = { userId: teacherUserId };
    expect(service.isTeacherEvent(event)).toEqual(true);
  });
  it('should check if an event is a teacher event when it is not', () => {
    const event = { workgroupId: studentWorkgroupId };
    expect(service.isTeacherEvent(event)).toEqual(false);
  });
}
