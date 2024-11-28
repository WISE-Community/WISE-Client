import { DiscussionService } from '../../assets/wise5/components/discussion/discussionService';
import { TestBed } from '@angular/core/testing';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentAssetService } from '../../assets/wise5/services/studentAssetService';
import { TeacherDataService } from '../../assets/wise5/services/teacherDataService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { TeacherDiscussionService } from '../../assets/wise5/components/discussion/teacherDiscussionService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class MockTeacherDataService {
  getComponentStatesByComponentId() {}
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
      providers: [
        AnnotationService,
        ConfigService,
        DiscussionService,
        ProjectService,
        StudentAssetService,
        { provide: TeacherDataService, useClass: MockTeacherDataService },
        TeacherDiscussionService,
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    service = TestBed.inject(TeacherDiscussionService);
  });
  getPostAndAllRepliesWithComponentIdAndComponentStateId();
});

function getPostAndAllRepliesWithComponentIdAndComponentStateId() {
  it('should get post and all replies with component id and component state id', () => {
    spyOn(TestBed.inject(TeacherDataService), 'getComponentStatesByComponentId').and.returnValue([
      new ComponentState(1, nodeId, componentId, null, 'Hello', []),
      new ComponentState(2, nodeId, componentId, 1, 'World', []),
      new ComponentState(3, nodeId, componentId, null, 'OK', [])
    ]);
    const postAndAllReplies = service.getPostAndAllRepliesByComponentIds([componentId], 1);
    expect(postAndAllReplies.length).toEqual(2);
  });
}
