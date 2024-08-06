import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OpenResponseService } from '../../assets/wise5/components/openResponse/openResponseService';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentAssetService } from '../../assets/wise5/services/studentAssetService';
import { TagService } from '../../assets/wise5/services/tagService';
import { SessionService } from '../../assets/wise5/services/sessionService';
import { OpenResponseCompletionCriteriaService } from '../../assets/wise5/components/openResponse/openResponseCompletionCriteriaService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let service: OpenResponseService;
let completionCriteriaService: OpenResponseCompletionCriteriaService;

describe('OpenResponseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        AnnotationService,
        ConfigService,
        OpenResponseCompletionCriteriaService,
        OpenResponseService,
        ProjectService,
        SessionService,
        StudentAssetService,
        TagService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(OpenResponseService);
    completionCriteriaService = TestBed.inject(OpenResponseCompletionCriteriaService);
  });
  createComponent();
  isCompleted();
  displayAnnotation();
  getStudentDataString();
  componentStatehasStudentWork();
  hasComponentState();
  hasStarterSentence();
  hasResponse();
});

function createComponentContent() {
  return {
    type: 'OpenResponse',
    starterSentence: null,
    isStudentAttachmentEnabled: false,
    showSubmitButton: false
  };
}

function createNode() {
  return {
    showSaveButton: false,
    showSubmitButton: false
  };
}

function createComponentState(response: string, isSubmit: boolean = false) {
  return {
    studentData: {
      response: response,
      attachments: []
    },
    isSubmit: isSubmit
  };
}

function createAnnotation(type: string, displayToStudent: boolean) {
  return {
    type: type,
    displayToStudent: displayToStudent
  };
}

function createComponent() {
  it('should create an open response component', () => {
    const component = service.createComponent();
    expect(component.type).toEqual('OpenResponse');
    expect(component.starterSentence).toEqual(null);
    expect(component.isStudentAttachmentEnabled).toEqual(false);
  });
}

function isCompleted() {
  let component: any;
  let studentData: any;
  let node: any;
  beforeEach(() => {
    component = createComponentContent();
    studentData = { componentStates: [] };
    node = createNode();
  });
  function expectIsCompleted(
    component: any,
    componentStates: any,
    node: any,
    expectedResult: boolean
  ) {
    expect(service.isCompletedV2(node, component, componentStates)).toEqual(expectedResult);
  }
  it('should check if a component is completed when there are no component states', () => {
    expectIsCompleted(component, studentData, node, false);
  });
  it('should check if a component is completed when there are component states', () => {
    studentData.componentStates.push(createComponentState('Hello World'));
    expectIsCompleted(component, studentData, node, true);
  });
  it(`should check if a component is completed when submit is required but there are no
      submits`, () => {
    component.showSubmitButton = true;
    studentData.componentStates.push(createComponentState('Hello World', false));
    expectIsCompleted(component, studentData, node, false);
  });
  it(`should check if a component is completed when submit is required and there is a
      submit`, () => {
    component.showSubmitButton = true;
    studentData.componentStates.push(createComponentState('Hello World', true));
    expectIsCompleted(component, studentData, node, true);
  });
  it(`should check if a component is completed when it has a completion criteria it has not
      satisfied`, () => {
    component.completionCriteria = {};
    spyOn(completionCriteriaService, 'isSatisfied').and.returnValue(false);
    studentData.componentStates.push(createComponentState('Hello World', false));
    expectIsCompleted(component, studentData, node, false);
  });
  it(`should check if a component is completed when it has a completion criteria it has
      satisfied`, () => {
    component.completionCriteria = {};
    spyOn(completionCriteriaService, 'isSatisfied').and.returnValue(true);
    studentData.componentStates.push(createComponentState('Hello World', false));
    expectIsCompleted(component, studentData, node, true);
  });
}

function displayAnnotation() {
  let component: any;
  let annotation: any;
  beforeEach(() => {
    component = createComponentContent();
    annotation = createAnnotation('score', true);
  });
  function createAutoScoreAnnotation() {
    return createAnnotation('autoScore', true);
  }
  function createAutoCommentAnnotation() {
    return createAnnotation('autoComment', true);
  }
  function expectDisplayAnnotation(component: any, annotation: any, expectedResult: boolean) {
    expect(service.displayAnnotation(component, annotation)).toEqual(expectedResult);
  }
  it('should check if annotation should be displayed when display to student is false', () => {
    expectDisplayAnnotation(component, createAnnotation('score', false), false);
  });
  it('should check if annotation should be displayed when type is score', () => {
    expectDisplayAnnotation(component, createAnnotation('score', true), true);
  });
  it('should check if annotation should be displayed when type is comment', () => {
    expectDisplayAnnotation(component, createAnnotation('comment', true), true);
  });
  it('should check if annotation should be displayed when type is autoScore', () => {
    expectDisplayAnnotation(component, createAutoScoreAnnotation(), true);
  });
  it(`should check if annotation should be displayed when type is autoScore and CRater is set to not
      show score`, () => {
    component.cRater = { showScore: false };
    expectDisplayAnnotation(component, createAutoScoreAnnotation(), false);
  });
  it(`should check if annotation should be displayed when type is autoScore and CRater is set to
      show score`, () => {
    component.cRater = { showScore: true };
    expectDisplayAnnotation(component, createAutoScoreAnnotation(), true);
  });
  it(`should check if annotation should be displayed when type is autoScore and show auto score is
      set to false`, () => {
    component.showAutoScore = false;
    expectDisplayAnnotation(component, createAutoScoreAnnotation(), false);
  });
  it('should check if annotation should be displayed when type is autoComment', () => {
    expectDisplayAnnotation(component, createAutoCommentAnnotation(), true);
  });
  it(`should check if annotation should be displayed when type is autoComment and CRater is set to
      not show feedback`, () => {
    component.cRater = { showFeedback: false };
    expectDisplayAnnotation(component, createAutoCommentAnnotation(), false);
  });
  it(`should check if annotation should be displayed when type is autoComment and CRater is set to
      show feedback`, () => {
    component.cRater = { showFeedback: true };
    expectDisplayAnnotation(component, createAutoCommentAnnotation(), true);
  });
  it(`should check if annotation should be displayed when type is autoComment and show auto comment
      is set to false`, () => {
    component.showAutoFeedback = false;
    expectDisplayAnnotation(component, createAutoCommentAnnotation(), false);
  });
}

function getStudentDataString() {
  it('should get the student data string', () => {
    const response = 'Hello World';
    const componentState = createComponentState(response);
    expect(service.getStudentDataString(componentState)).toEqual(response);
  });
}

function componentStatehasStudentWork() {
  let componentState: any;
  let component: any;
  beforeEach(() => {
    componentState = createComponentState('');
    component = createComponentContent();
    component.starterSentence = 'I think...';
  });
  function expectComponentStateHasStudentWork(
    componentState: any,
    component: any,
    expectedResult: boolean
  ) {
    expect(service.componentStateHasStudentWork(componentState, component)).toEqual(expectedResult);
  }
  it('should check if a component state has student work when it does not have work', () => {
    expectComponentStateHasStudentWork(componentState, component, false);
  });
  it('should check if a component state has student work when it does have work', () => {
    componentState.studentData.response = 'Hello World';
    expectComponentStateHasStudentWork(componentState, component, true);
  });
  it(`should check if a component state has student work when it has work equal to the starter
      sentence`, () => {
    componentState.studentData.response = 'I think...';
    expectComponentStateHasStudentWork(componentState, component, false);
  });
}

function hasComponentState() {
  it('should check if there are any component states when there are none', () => {
    expect(service.hasComponentState([])).toEqual(false);
  });
  it('should check if there are any component states when there are component states', () => {
    expect(service.hasComponentState([createComponentState('Hello World')])).toEqual(true);
  });
}

function hasStarterSentence() {
  let component: any;
  beforeEach(() => {
    component = createComponentContent();
  });
  it('should check if a component has a starter sentence when it is false', () => {
    expect(service.hasStarterSentence(component)).toEqual(false);
  });
  it('should check if a component has a starter sentence when it is true', () => {
    component.starterSentence = 'I think...';
    expect(service.hasStarterSentence(component)).toEqual(true);
  });
}

function hasResponse() {
  let componentState: any;
  beforeEach(() => {
    componentState = createComponentState('');
  });
  it('should check if a component state has a response when there is no text response', () => {
    expect(service.hasResponse(componentState)).toEqual(false);
  });
  it('should check if a component state has a response when there is a text response', () => {
    componentState.studentData.response = 'Hello World';
    expect(service.hasResponse(componentState)).toEqual(true);
  });
  it(`should check if a component state has a response when there is  an attachment but no text
      response`, () => {
    componentState.studentData.attachments.push({});
    expect(service.hasResponse(componentState)).toEqual(true);
  });
}
