import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherDiscussionService } from '../teacherDiscussionService';
import { DiscussionShowWorkComponent } from './discussion-show-work.component';

const post = (id: number, workgroupId: number, replyingTo: number = null) => ({
  id,
  workgroupId,
  componentId: 'c1',
  serverSaveTime: id,
  studentData: { isSubmit: true, response: `post ${id}`, componentStateIdReplyingTo: replyingTo }
});

describe('DiscussionShowWorkComponent', () => {
  let states: any[];

  beforeEach(() => {
    states = [post(1, 10), post(2, 20, 1), post(3, 30)];
    TestBed.configureTestingModule({
      imports: [StudentTeacherCommonServicesModule, DiscussionShowWorkComponent],
      providers: [
        provideHttpClient(),
        TeacherDiscussionService,
        {
          provide: TeacherDataService,
          useValue: {
            getComponentStatesByWorkgroupId: (workgroupId: number) =>
              states.filter((state) => state.workgroupId === workgroupId),
            getComponentStatesByComponentId: () => states
          }
        }
      ]
    });
    spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue({
      id: 'c1',
      type: 'Discussion'
    });
    spyOn(TestBed.inject(ProjectService), 'injectAssetPaths').and.callFake((value) => value);
    spyOn(
      TestBed.inject(AnnotationService),
      'getLatestAnnotationByStudentWorkIdAndType'
    ).and.returnValue(null);
    spyOn(TestBed.inject(ConfigService), 'getUsernamesByWorkgroupId').and.returnValue(['A']);
    spyOn(TestBed.inject(ConfigService), 'getUsernamesStringByWorkgroupId').and.returnValue('A');
  });

  function threadsOf(workgroupId: number): any[] {
    const component = TestBed.createComponent(DiscussionShowWorkComponent).componentInstance;
    component.nodeId = 'n1';
    component.componentId = 'c1';
    component.workgroupId = workgroupId;
    component.ngOnInit();
    return (component as any).topLevelResponses.all;
  }

  it('shows the thread a team only replied in, with the reply', () => {
    const threads = threadsOf(20);
    expect(threads.map((thread) => thread.id)).toEqual([1]);
    expect(threads[0].replies.map((reply) => reply.id)).toEqual([2]);
  });

  it('shows the replies under the post of the team that started the thread', () => {
    const threads = threadsOf(10);
    expect(threads.map((thread) => thread.id)).toEqual([1]);
    expect(threads[0].replies.length).toEqual(1);
  });

  it('leaves out threads the team took no part in', () => {
    expect(threadsOf(30).map((thread) => thread.id)).toEqual([3]);
  });
});
