import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { AchievementService } from '../../assets/wise5/services/achievementService';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { CopyNodesService } from '../../assets/wise5/services/copyNodesService';
import { DataExportService } from '../../assets/wise5/services/dataExportService';
import { NotificationService } from '../../assets/wise5/services/notificationService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { SessionService } from '../../assets/wise5/services/sessionService';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { ClassroomStatusService } from '../../assets/wise5/services/classroomStatusService';
import { TagService } from '../../assets/wise5/services/tagService';
import { TeacherDataService } from '../../assets/wise5/services/teacherDataService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { TeacherWebSocketService } from '../../assets/wise5/services/teacherWebSocketService';
import { UtilService } from '../../assets/wise5/services/utilService';
import { MatDialogModule } from '@angular/material/dialog';

let service: DataExportService;
let configService: ConfigService;
const studentWorkgroupId = 200;
const teacherUserId = 1;
const teacherWorkgroupId = 100;

describe('DataExportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AchievementService,
        AnnotationService,
        ClassroomStatusService,
        ConfigService,
        CopyNodesService,
        DataExportService,
        NotificationService,
        ProjectService,
        SessionService,
        StudentDataService,
        TagService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        UtilService
      ],
      imports: [HttpClientTestingModule, MatDialogModule, UpgradeModule]
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
