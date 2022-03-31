import { DiscussionService } from '../../assets/wise5/components/discussion/discussionService';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentAssetService } from '../../assets/wise5/services/studentAssetService';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { TagService } from '../../assets/wise5/services/tagService';
import { UtilService } from '../../assets/wise5/services/utilService';
import { SessionService } from '../../assets/wise5/services/sessionService';
import { TeacherDataService } from '../../assets/wise5/services/teacherDataService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { TeacherWebSocketService } from '../../assets/wise5/services/teacherWebSocketService';
import { AchievementService } from '../../assets/wise5/services/achievementService';
import { NotificationService } from '../../assets/wise5/services/notificationService';
import { ClassroomStatusService } from '../../assets/wise5/services/classroomStatusService';
import { TeacherDiscussionService } from '../../assets/wise5/components/discussion/teacherDiscussionService';

class MockTeacherDataService {
  getComponentStatesByComponentIds() {
    return [];
  }
}

let service: TeacherDiscussionService;
const componentId = 'component1';
const nodeId = 'node1';

describe('TeacherDiscussionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
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
        StudentDataService,
        TagService,
        { provide: TeacherDataService, useClass: MockTeacherDataService },
        TeacherDiscussionService,
        TeacherProjectService,
        TeacherWebSocketService,
        UtilService
      ]
    });

    service = TestBed.inject(TeacherDiscussionService);
  });

  getPostAndAllRepliesWithComponentIdAndComponentStateId();
});

function createComponentState(
  componentStateId,
  nodeId,
  componentId,
  componentStateIdReplyingTo,
  response,
  attachments
) {
  return {
    id: componentStateId,
    nodeId: nodeId,
    componentId: componentId,
    studentData: {
      attachments: attachments,
      componentStateIdReplyingTo: componentStateIdReplyingTo,
      response: response
    }
  };
}

function getPostAndAllRepliesWithComponentIdAndComponentStateId() {
  it('should get post and all replies with component id and component state id', () => {
    spyOn(TestBed.inject(TeacherDataService), 'getComponentStatesByComponentIds').and.callFake(
      () => {
        const componentStates = [
          createComponentState(1, nodeId, componentId, null, 'Hello', []),
          createComponentState(2, nodeId, componentId, 1, 'World', []),
          createComponentState(3, nodeId, componentId, null, 'OK', [])
        ];
        return componentStates;
      }
    );
    const postAndAllReplies = service.getPostAndAllRepliesByComponentIds([componentId], 1);
    expect(postAndAllReplies.length).toEqual(2);
  });
}
