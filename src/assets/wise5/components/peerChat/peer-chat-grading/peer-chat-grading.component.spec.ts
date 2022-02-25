import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { UpgradeModule } from '@angular/upgrade/static';
import { AchievementService } from '../../../services/achievementService';
import { AnnotationService } from '../../../services/annotationService';
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
import { PeerChatGradingComponent } from './peer-chat-grading.component';

describe('PeerChatGradingComponent', () => {
  let component: PeerChatGradingComponent;
  let fixture: ComponentFixture<PeerChatGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, UpgradeModule],
      declarations: [PeerChatGradingComponent],
      providers: [
        AchievementService,
        AnnotationService,
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
    component = fixture.componentInstance;
    spyOn(TestBed.inject(ProjectService), 'getComponentByNodeIdAndComponentId').and.returnValue({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
