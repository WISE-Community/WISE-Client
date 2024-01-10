import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { ConfigService } from '../../../services/configService';
import { NotificationService } from '../../../services/notificationService';
import { PeerGroupService } from '../../../services/peerGroupService';
import { ProjectService } from '../../../services/projectService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { TeacherWorkService } from '../../../services/teacherWorkService';
import { PeerGroup } from '../PeerGroup';
import { PeerGroupMember } from '../PeerGroupMember';
import { PeerChatGradingComponent } from './peer-chat-grading.component';
import { of } from 'rxjs';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ComponentContent } from '../../../common/ComponentContent';

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
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      declarations: [PeerChatGradingComponent],
      providers: [
        ClassroomStatusService,
        PeerGroupService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        TeacherWorkService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerChatGradingComponent);
    spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue({} as ComponentContent);
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
