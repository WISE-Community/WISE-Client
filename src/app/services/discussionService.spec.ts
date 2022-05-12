import { DiscussionService } from '../../assets/wise5/components/discussion/discussionService';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
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

class MockTeacherDataService {
  getComponentStatesByComponentIds() {
    return [];
  }
}

let service: DiscussionService;
let http: HttpTestingController;
let studentDataService: StudentDataService;
const componentId = 'component1';
const nodeId = 'node1';
const periodId = 2;
const runId = 1;

describe('DiscussionService', () => {
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
        TeacherProjectService,
        TeacherWebSocketService,
        UtilService
      ]
    });

    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(DiscussionService);
    studentDataService = TestBed.inject(StudentDataService);
  });

  checkThatAComponentStateHasStudentWorkWhenStudentOnlyAttachedAFile();
  componentStateHasStudentWork();
  createComponent();
  getClassmateResponsesFromComponents();
  getClassmateResponses();
  hasShowWorkConnectedComponentThatHasWork();
  hasNodeEnteredEvent();
  isCompleted();
  isComponentHasStarterSentence();
  isStudentResponseDifferentFromStarterSentence();
  isStudentWorkHasText();
  isStudentWorkHasAttachment();
  isTopLevelComponentStateIdFound();
  isTopLevelPost();
});

function createComponentStateFromOnlyResponse(response: string, attachments: any[] = []) {
  return createComponentState(1, nodeId, componentId, null, response, attachments);
}

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

function createConnectedComponent(nodeId: string, componentId: string, type: string) {
  return {
    nodeId: nodeId,
    componentId: componentId,
    type: type
  };
}

function createNodeEvent(event: string) {
  return {
    event: event
  };
}

function createDiscussionComponent(starterSentence: string) {
  return {
    starterSentence: starterSentence
  };
}

function createComponent() {
  it('should create a discussion component', () => {
    const component = service.createComponent();
    expect(component.type).toEqual('Discussion');
    expect(component.prompt).toEqual('');
    expect(component.isStudentAttachmentEnabled).toEqual(true);
    expect(component.gateClassmateResponses).toEqual(true);
  });
}

function isCompleted() {
  let component: any;
  let componentStates: any[];
  let nodeEvents: any[];
  beforeEach(() => {
    component = {};
    componentStates = [];
    nodeEvents = [];
  });
  function expectIsCompleted(
    component: any,
    componentStates: any[],
    nodeEvents: any[],
    expectedResult: boolean
  ) {
    expect(service.isCompleted(component, componentStates, nodeEvents, null)).toEqual(
      expectedResult
    );
  }
  it(`should check if a component is completed when it does not have a show work connected component
      and it does not have any component states`, () => {
    expectIsCompleted(component, componentStates, nodeEvents, false);
  });
  it('should check if a component is completed when it has a show work connected component', () => {
    spyOn(studentDataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue([
      createComponentStateFromOnlyResponse('Hello World')
    ]);
    component.connectedComponents = [createConnectedComponent('node1', 'component1', 'showWork')];
    nodeEvents.push(createNodeEvent('nodeEntered'));
    expectIsCompleted(component, componentStates, nodeEvents, true);
  });
  it(`should check if a component is completed when it has a component state with a
      response`, () => {
    componentStates.push(createComponentStateFromOnlyResponse('Hello World'));
    expectIsCompleted(component, componentStates, nodeEvents, true);
  });
}

function hasShowWorkConnectedComponentThatHasWork() {
  let componentContent: any;
  beforeEach(() => {
    componentContent = {
      connectedComponents: []
    };
  });
  function expectHasShowWorkConnectedComponentThatHasWork(
    componentContent: any,
    expectedResult: boolean
  ) {
    expect(service.hasShowWorkConnectedComponentThatHasWork(componentContent)).toEqual(
      expectedResult
    );
  }
  it(`should check if there is a show work connected component when there are no connected
      components`, () => {
    expectHasShowWorkConnectedComponentThatHasWork(componentContent, false);
  });
  it(`should check if there is a show work connected component when there is a connected
      component`, () => {
    const connectedComponent = createConnectedComponent('node1', 'component1', 'showWork');
    componentContent.connectedComponents.push(connectedComponent);
    spyOn(studentDataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue([
      createComponentStateFromOnlyResponse('Hello World')
    ]);
    expectHasShowWorkConnectedComponentThatHasWork(componentContent, true);
  });
}

function hasNodeEnteredEvent() {
  function expectHasNodeEnteredEvent(nodeEvents: any[], expectedResult: boolean) {
    expect(service.hasNodeEnteredEvent(nodeEvents)).toEqual(expectedResult);
  }
  it('should check if there are any node entered events when there are none', () => {
    expectHasNodeEnteredEvent([createNodeEvent('nodeExited')], false);
  });
  it('should check if there are any node entered events when there is one', () => {
    expectHasNodeEnteredEvent([createNodeEvent('nodeEntered')], true);
  });
}

function getClassmateResponsesFromComponents() {
  it('should get classmate responses from components', () => {
    waitForAsync(() => {
      const componentState1 = { studentData: { response: 'Hello World' } };
      const componentState2 = { studentData: { response: 'Hello World 2' } };
      const annotation1 = { data: { action: 'Delete' } };
      const annotation2 = { data: { action: 'Undelete' } };
      const componentStates = [componentState1, componentState2];
      const annotations = [annotation1, annotation2];
      service
        .getClassmateResponsesFromComponents(runId, periodId, [
          { nodeId: nodeId, componentId: componentId }
        ])
        .subscribe((response: any) => {
          expect(response.studentWork).toEqual(componentStates);
          expect(response.annotations).toEqual(annotations);
        });
      http
        .expectOne(
          `/api/classmate/discussion/student-work/${runId}/${periodId}/${nodeId}/${componentId}`
        )
        .flush(componentStates);
      http
        .expectOne(
          `/api/classmate/discussion/annotations/${runId}/${periodId}/${nodeId}/${componentId}`
        )
        .flush(annotations);
    });
  });
}

function getClassmateResponses() {
  it(
    'should get classmate responses',
    waitForAsync(() => {
      const componentState1 = { studentData: { response: 'Hello World' } };
      const annotation1 = { data: { action: 'Delete' } };
      service
        .getClassmateResponses(runId, periodId, nodeId, componentId)
        .subscribe((response: any) => {
          expect(response.studentWork).toEqual([componentState1]);
          expect(response.annotations).toEqual([annotation1]);
        });
      http
        .expectOne(
          `/api/classmate/discussion/student-work/${runId}/${periodId}/${nodeId}/${componentId}`
        )
        .flush([componentState1]);
      http
        .expectOne(
          `/api/classmate/discussion/annotations/${runId}/${periodId}/${nodeId}/${componentId}`
        )
        .flush([annotation1]);
    })
  );
}

function isTopLevelPost() {
  let componentState: any;
  beforeEach(() => {
    componentState = createComponentStateFromOnlyResponse('');
  });
  function expectIsTopLevelPost(componentState: any, expectedResult: boolean) {
    expect(service.isTopLevelPost(componentState)).toEqual(expectedResult);
  }
  it('should check if a component state is a top level post when it is not', () => {
    componentState.studentData.componentStateIdReplyingTo = {};
    expectIsTopLevelPost(componentState, false);
  });
  it('should check if a component state is a top level post when it is', () => {
    expectIsTopLevelPost(componentState, true);
  });
}

function isTopLevelComponentStateIdFound() {
  it(`should check if the top the top level component state id has been found when it has not been
      found yet`, () => {
    expect(service.isTopLevelComponentStateIdFound(['id1', 'id2'], 'id3')).toEqual(false);
  });
  it(`should check if the top the top level component state id has been found when it has been
      found`, () => {
    expect(service.isTopLevelComponentStateIdFound(['id1', 'id2'], 'id2')).toEqual(true);
  });
}

function componentStateHasStudentWork() {
  let componentState: any;
  let componentContent: any;
  beforeEach(() => {
    componentState = createComponentStateFromOnlyResponse('');
    componentContent = createDiscussionComponent('');
  });
  function expectComponentStatehasStudentWork(
    componentState: any,
    componentContent: any,
    expectedResult: boolean
  ) {
    expect(service.componentStateHasStudentWork(componentState, componentContent)).toEqual(
      expectedResult
    );
  }
  it('should check if a component state has work when it has an attachment', () => {
    componentState.studentData.attachments.push({});
    expectComponentStatehasStudentWork(componentState, componentContent, true);
  });
  it(`should check if a component state has work when there is no starter sentence and no student
      response`, () => {
    expectComponentStatehasStudentWork(componentState, componentContent, false);
  });
  it(`should check if a component state has work when there is no starter sentence but there is
      a student response`, () => {
    componentState.studentData.response = 'Hello World';
    expectComponentStatehasStudentWork(componentState, componentContent, true);
  });
  it(`should check if a component state has work when there is a starter sentence and the student
      response is the same as the starter sentence`, () => {
    componentContent.starterSentence = 'I think...';
    componentState.studentData.response = 'I think...';
    expectComponentStatehasStudentWork(componentState, componentContent, false);
  });
  it(`should check if a component state has work when there is a starter sentence and the student
      response is different from the starter sentence`, () => {
    componentContent.starterSentence = 'I think...';
    componentState.studentData.response = 'Hello World';
    expectComponentStatehasStudentWork(componentState, componentContent, true);
  });
}

function isComponentHasStarterSentence() {
  let componentContent: any;
  beforeEach(() => {
    componentContent = createDiscussionComponent('');
  });
  function expectIsComponentHasStaterSentence(componentContent: any, expectedResult: boolean) {
    expect(service.isComponentHasStarterSentence(componentContent)).toEqual(expectedResult);
  }
  it('should check if a component has a starter sentence when it does not', () => {
    expectIsComponentHasStaterSentence(componentContent, false);
  });
  it('should check if a component has a starter sentence when it does', () => {
    componentContent.starterSentence = 'I think...';
    expectIsComponentHasStaterSentence(componentContent, true);
  });
}

function isStudentResponseDifferentFromStarterSentence() {
  let componentState: any;
  let componentContent: any;
  beforeEach(() => {
    componentState = createComponentStateFromOnlyResponse('');
    componentContent = createDiscussionComponent('');
  });
  function expectIsStudentResponseDifferentFromStarterSentence(
    componentState: any,
    componentContent: any,
    expectedResult: boolean
  ) {
    expect(
      service.isStudentResponseDifferentFromStarterSentence(componentState, componentContent)
    ).toEqual(expectedResult);
  }
  it(`should check if student response is different from starter sentence when it is the
      same`, () => {
    expectIsStudentResponseDifferentFromStarterSentence(componentState, componentContent, false);
  });
  it(`should check if student response is different from starter sentence when it is
      different`, () => {
    componentState.studentData.response = 'Hello World';
    expectIsStudentResponseDifferentFromStarterSentence(componentState, componentContent, true);
  });
}

function isStudentWorkHasText() {
  let componentState: any;
  beforeEach(() => {
    componentState = createComponentStateFromOnlyResponse('');
  });
  function expectIsStudentWorkHasText(componentState: any, expectedResult: boolean) {
    expect(service.isStudentWorkHasText(componentState)).toEqual(expectedResult);
  }
  it('should check if student work has text when it does not', () => {
    expectIsStudentWorkHasText(componentState, false);
  });
  it('should check if student work has text when it does', () => {
    componentState.studentData.response = 'Hello World';
    expectIsStudentWorkHasText(componentState, true);
  });
}

function isStudentWorkHasAttachment() {
  let componentState: any;
  beforeEach(() => {
    componentState = createComponentStateFromOnlyResponse('Hello World');
  });
  function expectIsStudentWorkHasAttachment(componentState: any, expectedResult: boolean) {
    expect(service.isStudentWorkHasAttachment(componentState)).toEqual(expectedResult);
  }
  it('should check if student work has attachment when it does not', () => {
    expectIsStudentWorkHasAttachment(componentState, false);
  });
  it('should check if student work has attachment when it does', () => {
    componentState.studentData.attachments.push({});
    expectIsStudentWorkHasAttachment(componentState, true);
  });
}

function checkThatAComponentStateHasStudentWorkWhenStudentOnlyAttachedAFile() {
  it(`should check that a component state has student work when student only attached a
      file`, () => {
    const componentState = createComponentState(1, nodeId, componentId, null, '', ['somefile.png']);
    const componentContent = {
      starterSentence: 'starter sentence'
    };
    const hasStudentWork = service.componentStateHasStudentWork(componentState, componentContent);
    expect(hasStudentWork).toEqual(true);
  });
}
