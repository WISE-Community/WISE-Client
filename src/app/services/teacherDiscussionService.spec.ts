import { DiscussionService } from '../../assets/wise5/components/discussion/discussionService';
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentAssetService } from '../../assets/wise5/services/studentAssetService';
import { TagService } from '../../assets/wise5/services/tagService';
import { SessionService } from '../../assets/wise5/services/sessionService';
import { TeacherDataService } from '../../assets/wise5/services/teacherDataService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { TeacherWebSocketService } from '../../assets/wise5/services/teacherWebSocketService';
import { AchievementService } from '../../assets/wise5/services/achievementService';
import { NotificationService } from '../../assets/wise5/services/notificationService';
import { ClassroomStatusService } from '../../assets/wise5/services/classroomStatusService';
import { TeacherDiscussionService } from '../../assets/wise5/components/discussion/teacherDiscussionService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class MockTeacherDataService {
  getComponentStatesByComponentIds() {
    return [];
  }
}

class ComponentState {
  studentData: any = {};

  constructor(
    protected id: number,
    protected nodeId: string,
    protected componentId: string,
    componentStateIdReplyingTo: number,
    response: string,
    attachments: any[]
  ) {
    this.studentData.attachments = attachments;
    this.studentData.componentStateIdReplyingTo = componentStateIdReplyingTo;
    this.studentData.response = response;
  }
}

let service: TeacherDiscussionService;
const componentId = 'component1';
const nodeId = 'node1';

describe('TeacherDiscussionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        AchievementService,
        AnnotationService,
        ClassroomStatusService,
        ConfigService,
        DiscussionService,
        NotificationService,
        ProjectService,
        SessionService,
        StudentAssetService,
        TagService,
        { provide: TeacherDataService, useClass: MockTeacherDataService },
        TeacherDiscussionService,
        TeacherProjectService,
        TeacherWebSocketService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});

    service = TestBed.inject(TeacherDiscussionService);
  });

  getPostAndAllRepliesWithComponentIdAndComponentStateId();
});

function getPostAndAllRepliesWithComponentIdAndComponentStateId() {
  it('should get post and all replies with component id and component state id', () => {
    spyOn(TestBed.inject(TeacherDataService), 'getComponentStatesByComponentIds').and.callFake(
      () => {
        const componentStates = [
          new ComponentState(1, nodeId, componentId, null, 'Hello', []),
          new ComponentState(2, nodeId, componentId, 1, 'World', []),
          new ComponentState(3, nodeId, componentId, null, 'OK', [])
        ];
        return componentStates;
      }
    );
    const postAndAllReplies = service.getPostAndAllRepliesByComponentIds([componentId], 1);
    expect(postAndAllReplies.length).toEqual(2);
  });
}
