import '../../assets/wise5/lib/jquery/jquery-global';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentAssetService } from '../../assets/wise5/services/studentAssetService';
import { TagService } from '../../assets/wise5/services/tagService';
import { DrawService } from '../../assets/wise5/components/draw/drawService';
import { SessionService } from '../../assets/wise5/services/sessionService';

let service: DrawService;
let defaultDrawDataWithNoObjectsField: string = '{"canvas":{}}';
let drawDataWithEmptyObjects: string = '{"canvas":{"objects":[]}}';
let drawDataWithObjects: string = '{"canvas":{"objects":[{}]}}';

describe('DrawService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AnnotationService,
        ConfigService,
        DrawService,
        ProjectService,
        SessionService,
        StudentAssetService,
        TagService
      ]
    });
    service = TestBed.inject(DrawService);
  });
  createComponent();
  isCompleted();
  hasComponentStateWithIsSubmitTrue();
  hasComponentStateWithDrawData();
  removeBackgroundFromComponentState();
  componentStateHasStudentWork();
  isDrawDataContainsObjects();
  isStarterDrawDataExists();
  isStudentDrawDataDifferentFromStarterData();
  initializeDrawingTool();
  setUpTools();
});

function createComponentState(drawData: string, isSubmit: boolean = false) {
  return {
    studentData: {
      drawData: drawData
    },
    isSubmit: isSubmit
  };
}

function createDrawComponent(starterDrawData: string) {
  return {
    starterDrawData: starterDrawData
  };
}

function createComponent() {
  it('should create a draw component', () => {
    const component = service.createComponent();
    expect(component.type).toEqual('Draw');
    expect(component.stamps.Stamps.length).toEqual(0);
    expect(component.tools.select).toEqual(true);
    expect(component.tools.line).toEqual(true);
    expect(component.tools.shape).toEqual(true);
    expect(component.tools.freeHand).toEqual(true);
    expect(component.tools.text).toEqual(true);
    expect(component.tools.stamp).toEqual(true);
    expect(component.tools.strokeColor).toEqual(true);
    expect(component.tools.fillColor).toEqual(true);
    expect(component.tools.clone).toEqual(true);
    expect(component.tools.strokeWidth).toEqual(true);
    expect(component.tools.sendBack).toEqual(true);
    expect(component.tools.sendForward).toEqual(true);
    expect(component.tools.undo).toEqual(true);
    expect(component.tools.redo).toEqual(true);
    expect(component.tools.delete).toEqual(true);
  });
}

function isCompleted() {
  let node: any;
  let componentStates: any;
  beforeEach(() => {
    node = {};
    componentStates = [createComponentState(defaultDrawDataWithNoObjectsField)];
  });
  function expectIsCompleted(componentStates: any[], node: any, expectedResult: boolean) {
    expect(service.isCompleted({}, componentStates, [], node)).toEqual(expectedResult);
  }
  it('should check is completed when there are no component states', () => {
    expectIsCompleted([], node, false);
  });
  it('should check is completed when submit is not required and there is a component state', () => {
    expectIsCompleted(componentStates, node, true);
  });
  it(`should check is completed when submit is required and there is component state with is submit
      false`, () => {
    node.showSubmitButton = true;
    expectIsCompleted(componentStates, node, false);
  });
  it(`should check is completed when submit is required and there is component state with is submit
      true`, () => {
    node.showSubmitButton = true;
    componentStates[0].isSubmit = true;
    expectIsCompleted(componentStates, node, true);
  });
}

function hasComponentStateWithIsSubmitTrue() {
  function expectHasComponentStateWithIsSubmitTrue(
    componentStates: any[],
    expectedResult: boolean
  ) {
    expect(service.hasComponentStateWithIsSubmitTrue(componentStates)).toEqual(expectedResult);
  }
  it('should check if any component state has is submit true when there are none', () => {
    const componentStates = [createComponentState('')];
    expectHasComponentStateWithIsSubmitTrue(componentStates, false);
  });
  it('should check if any component state has is submit true when there is one', () => {
    const componentStates = [createComponentState('', true)];
    expectHasComponentStateWithIsSubmitTrue(componentStates, true);
  });
}

function hasComponentStateWithDrawData() {
  function expectHasComponentStateWithDrawData(componentStates: any[], expectedResult: boolean) {
    expect(service.hasComponentStateWithDrawData(componentStates)).toEqual(expectedResult);
  }
  it('should check if there is a component state with draw data when there are no component states', () => {
    const componentStates = [];
    expectHasComponentStateWithDrawData(componentStates, false);
  });
  it(`should check if there is a component state with draw data when there is a compenent state with
      draw data`, () => {
    const componentStates = [createComponentState('')];
    expectHasComponentStateWithDrawData(componentStates, true);
  });
}

function removeBackgroundFromComponentState() {
  it('should remove background from component state', () => {
    const drawData = '{"canvas":{"backgroundImage":"my-background.jpg"}}';
    const componentState = createComponentState(drawData);
    service.removeBackgroundFromComponentState(componentState);
    expect(componentState.studentData.drawData).toEqual(defaultDrawDataWithNoObjectsField);
  });
}

function componentStateHasStudentWork() {
  let componentState: any;
  let componentContent: any;
  beforeEach(() => {
    componentState = createComponentState(drawDataWithEmptyObjects);
    componentContent = createDrawComponent(null);
  });
  function expectComponentStateHasStudentWork(
    componentState: any,
    componentContent: any,
    expectedResult: boolean
  ) {
    expect(service.componentStateHasStudentWork(componentState, componentContent)).toEqual(
      expectedResult
    );
  }
  it(`should check if component state has student work when component content is not provided
      and component state does not have any objects`, () => {
    expectComponentStateHasStudentWork(componentState, null, false);
  });
  it(`should check if component state has student work when component content is not provided
      and component state does have an object`, () => {
    componentState = createComponentState(drawDataWithObjects);
    expectComponentStateHasStudentWork(componentState, null, true);
  });
  it(`should check if component state has student work when there is no starter draw data and
      component state does not have any objects`, () => {
    expectComponentStateHasStudentWork(componentState, componentContent, false);
  });
  it(`should check if component state has student work when there is no starter draw data and
      component state does have an object`, () => {
    componentState = createComponentState(drawDataWithObjects);
    expectComponentStateHasStudentWork(componentState, componentContent, true);
  });
  it(`should check if component state has student work when there is starter draw data and
      component state draw data is the same as the starter draw data`, () => {
    componentState = createComponentState(drawDataWithObjects);
    componentContent = createDrawComponent(drawDataWithObjects);
    expectComponentStateHasStudentWork(componentState, componentContent, false);
  });
  it(`should check if component state has student work when there is starter draw data and
      component state draw data is different from the starter draw data`, () => {
    componentState = createComponentState(drawDataWithEmptyObjects);
    componentContent = createDrawComponent(drawDataWithObjects);
    expectComponentStateHasStudentWork(componentState, componentContent, true);
  });
}

function isDrawDataContainsObjects() {
  let drawDataObj: any;
  beforeEach(() => {
    drawDataObj = {
      canvas: {}
    };
  });
  function expectIsDrawDataContainsObjects(drawData: any, expectedResult: boolean) {
    expect(service.isDrawDataContainsObjects(drawData)).toEqual(expectedResult);
  }
  it('should check if draw data contains objects when it does not contain any objects', () => {
    expectIsDrawDataContainsObjects(drawDataObj, false);
  });
  it('should check if draw data contains objects when it does contain an object', () => {
    drawDataObj.canvas.objects = [{}];
    expectIsDrawDataContainsObjects(drawDataObj, true);
  });
}

function isStarterDrawDataExists() {
  function expectIsStarterDrawDataExists(componentContent: any, expectedResult: boolean) {
    expect(service.isStarterDrawDataExists(componentContent)).toEqual(expectedResult);
  }
  it('should check if starter draw data exists when it does not exist', () => {
    const componentContent = {};
    expectIsStarterDrawDataExists(componentContent, false);
  });
  it('should check if starter draw data exists when it does exist', () => {
    const componentContent = {
      starterDrawData: defaultDrawDataWithNoObjectsField
    };
    expectIsStarterDrawDataExists(componentContent, true);
  });
}

function isStudentDrawDataDifferentFromStarterData() {
  function expectIsStudentDrawDataDifferentFromStarterData(
    drawDataString: string,
    starterDrawData: string,
    expectedResult: boolean
  ) {
    expect(
      service.isStudentDrawDataDifferentFromStarterData(drawDataString, starterDrawData)
    ).toEqual(expectedResult);
  }
  it('should check when student draw data is the same as starter draw data', () => {
    expectIsStudentDrawDataDifferentFromStarterData(
      defaultDrawDataWithNoObjectsField,
      defaultDrawDataWithNoObjectsField,
      false
    );
  });
  it('should check when student draw data is different from starter draw data', () => {
    const studentDrawData = '{"canvas":{"objects":[]}}';
    expectIsStudentDrawDataDifferentFromStarterData(
      studentDrawData,
      defaultDrawDataWithNoObjectsField,
      true
    );
  });
}

function initializeDrawingTool() {
  it('should initialize the drawing tool', () => {
    const drawingToolId: string = 'drawing-tool';
    const stamps = {};
    const width: number = 400;
    const height: number = 300;
    const drawingTool = service.initializeDrawingTool(drawingToolId, stamps, width, height);
    expect(drawingTool).not.toBeNull();
    expect(drawingTool.options.stamps).toEqual(stamps);
    expect(drawingTool.canvas.width).toEqual(width);
    expect(drawingTool.canvas.height).toEqual(height);
  });
}

function setUpTools() {
  it('should set up only specific tools', () => {
    const expectedValues = [
      { name: 'select', isVisible: true },
      { name: 'line', isVisible: true },
      { name: 'shape', isVisible: true },
      { name: 'freeHand', isVisible: false },
      { name: 'text', isVisible: false },
      { name: 'stamp', isVisible: false },
      { name: 'strokeColor', isVisible: false },
      { name: 'fillColor', isVisible: false },
      { name: 'clone', isVisible: false },
      { name: 'strokeWidth', isVisible: false },
      { name: 'sendBack', isVisible: false },
      { name: 'sendForward', isVisible: false },
      { name: 'undo', isVisible: false },
      { name: 'redo', isVisible: false },
      { name: 'delete', isVisible: false }
    ];
    const tools = {};
    for (const expectedValue of expectedValues) {
      tools[expectedValue.name] = expectedValue.isVisible;
    }
    const drawingToolId = service.getDrawingToolId('node1-component1');
    createDrawingToolDiv(drawingToolId);
    service.initializeDrawingTool(drawingToolId, {});
    service.setUpTools(drawingToolId, tools, false);
    for (const expectedValue of expectedValues) {
      expectToolToBeVisible(drawingToolId, expectedValue.name, expectedValue.isVisible);
    }
  });
}

function createDrawingToolDiv(drawingToolId: string): void {
  const drawingToolDiv = document.createElement('div');
  drawingToolDiv.setAttribute('id', drawingToolId);
  document.body.appendChild(drawingToolDiv);
}

function expectToolToBeVisible(drawingToolId: string, name: string, isVisible: boolean): void {
  const label = service.toolFieldToLabel[name];
  expect($(`#${drawingToolId}`).find(`[title="${label}"]`).is(':visible')).toEqual(isVisible);
}
