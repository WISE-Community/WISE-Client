import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { UpgradeModule } from '@angular/upgrade/static';
import { AchievementService } from '../../../services/achievementService';
import { AnnotationService } from '../../../services/annotationService';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { ConfigService } from '../../../services/configService';
import { NotificationService } from '../../../services/notificationService';
import { PeerGroupService } from '../../../services/peerGroupService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentDataService } from '../../../services/studentDataService';
import { StudentStatusService } from '../../../services/studentStatusService';
import { TagService } from '../../../services/tagService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { TeacherWorkService } from '../../../services/teacherWorkService';
import { UtilService } from '../../../services/utilService';
import { PeerChatService } from '../peerChatService';
import { PeerGroup } from '../PeerGroup';
import { PeerGroupMember } from '../PeerGroupMember';
import { PeerChatGradingComponent } from './peer-chat-grading.component';
import { of } from 'rxjs';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';

let component: PeerChatGradingComponent;
let fixture: ComponentFixture<PeerChatGradingComponent>;
const peerGroupId = 100;
const periodId = 10;
const response = 'Hello World';
const studentWorkgroupId1 = 1001;
const studentWorkgroupId2 = 1002;
const teacherWorkgroupId = 1;

const peerGroup = new PeerGroup(
  peerGroupId,
  [
    new PeerGroupMember(studentWorkgroupId1, periodId),
    new PeerGroupMember(studentWorkgroupId2, periodId)
  ],
  new PeerGrouping()
);

describe('PeerChatGradingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, UpgradeModule],
      declarations: [PeerChatGradingComponent],
      providers: [
        AchievementService,
        AnnotationService,
        ClassroomStatusService,
        ConfigService,
        NotificationService,
        PeerChatService,
        PeerGroupService,
        ProjectService,
        SessionService,
        StudentDataService,
        StudentStatusService,
        TagService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        TeacherWorkService,
        UtilService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatGradingComponent);
    spyOn(TestBed.inject(ProjectService), 'getComponentByNodeIdAndComponentId').and.returnValue({});
    spyOn(TestBed.inject(ConfigService), 'getRunId').and.returnValue(1);
    spyOn(TestBed.inject(ConfigService), 'getWorkgroupId').and.returnValue(100);
    spyOn(TestBed.inject(ConfigService), 'getTeacherWorkgroupIds').and.returnValue([
      teacherWorkgroupId
    ]);
    spyOn(TestBed.inject(ConfigService), 'isTeacherWorkgroupId').and.callFake(
      (workgroupId: number) => {
        return workgroupId === teacherWorkgroupId;
      }
    );
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriodId').and.returnValue(10);
    spyOn(TestBed.inject(PeerGroupService), 'retrievePeerGroup').and.callFake(() => {
      return of(peerGroup);
    });
    spyOn(TestBed.inject(NotificationService), 'saveNotificationToServer').and.callFake(() => {
      return Promise.resolve();
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  submitTeacherResponse();
});

function submitTeacherResponse() {
  it('submit teacher response', () => {
    const saveWorkSpy = spyOn(TestBed.inject(TeacherWorkService), 'saveWork').and.returnValue(of());
    component.submitTeacherResponse(response);
    expect(saveWorkSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ studentData: { response: response } })
    );
  });
}
