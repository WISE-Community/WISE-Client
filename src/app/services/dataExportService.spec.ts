import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { AchievementService } from '../../assets/wise5/services/achievementService';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { DataExportService } from '../../assets/wise5/services/dataExportService';
import { NotificationService } from '../../assets/wise5/services/notificationService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { SessionService } from '../../assets/wise5/services/sessionService';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { StudentStatusService } from '../../assets/wise5/services/studentStatusService';
import { TagService } from '../../assets/wise5/services/tagService';
import { TeacherDataService } from '../../assets/wise5/services/teacherDataService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { TeacherWebSocketService } from '../../assets/wise5/services/teacherWebSocketService';
import { UtilService } from '../../assets/wise5/services/utilService';

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
        ConfigService,
        DataExportService,
        NotificationService,
        ProjectService,
        SessionService,
        StudentDataService,
        StudentStatusService,
        TagService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        UtilService
      ],
      imports: [HttpClientTestingModule, UpgradeModule]
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

  processEvents();
  isTeacherEvent();
  addStudentEvent();
  addTeacherEvent();
});

function addStudentEvent() {
  it('should add student event', () => {
    service.initializeEventsDataStructures();
    const workgroupId = 200;
    expect(!service.studentEventsByWorkgroupId.has(workgroupId));
    service.addStudentEvent({ workgroupId: workgroupId });
    expect(service.studentEventsByWorkgroupId.has(workgroupId));
  });
}

function addTeacherEvent() {
  it('should add teacher event', () => {
    service.initializeEventsDataStructures();
    const userId = 1;
    expect(!service.teacherEventsByUserId.has(userId));
    service.addTeacherEvent({ workgroupId: userId });
    expect(service.teacherEventsByUserId.has(userId));
  });
}

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

function processEvents() {
  it('should process events', () => {
    const events = [
      { workgroupId: studentWorkgroupId, serverSaveTime: 3000 },
      { userId: teacherUserId, serverSaveTime: 1000 },
      { workgroupId: studentWorkgroupId, serverSaveTime: 2000 },
      { workgroupId: studentWorkgroupId, serverSaveTime: 5000 },
      { userId: teacherUserId, serverSaveTime: 4000 }
    ];
    service.processEvents(events);
    const studentEvents = service.studentEventsByWorkgroupId.get(studentWorkgroupId);
    expect(studentEvents.length).toEqual(3);
    expect(studentEvents[0].serverSaveTime).toEqual(2000);
    expect(studentEvents[1].serverSaveTime).toEqual(3000);
    expect(studentEvents[2].serverSaveTime).toEqual(5000);
    const teacherEvents = service.teacherEventsByUserId.get(teacherUserId);
    expect(teacherEvents.length).toEqual(2);
    expect(teacherEvents[0].serverSaveTime).toEqual(1000);
    expect(teacherEvents[1].serverSaveTime).toEqual(4000);
  });
}
