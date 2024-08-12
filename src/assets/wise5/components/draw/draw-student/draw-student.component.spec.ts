import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { Component } from '../../../common/Component';
import { ProjectService } from '../../../services/projectService';
import { StudentDataService } from '../../../services/studentDataService';
import { DrawService } from '../drawService';
import { DrawStudent } from './draw-student.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: DrawStudent;
let fixture: ComponentFixture<DrawStudent>;
const starterDrawData =
  '{"version":1,"dt":{"width":800,"height":600},"canvas":{"objects":[{"type":"rect","originX":"center","originY":"center","left":365,"top":162,"width":304,"height":162,"fill":"","stroke":"#333","strokeWidth":8,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0}],"background":"#fff"}}';

describe('DrawStudentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [DrawStudent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    jasmine.clock().install();
    fixture = TestBed.createComponent(DrawStudent);
    spyOn(TestBed.inject(ProjectService), 'isSpaceExists').and.returnValue(false);
    component = fixture.componentInstance;
    component.componentContent = TestBed.inject(DrawService).createComponent();
    component.componentContent.id = 'component1';
    component.componentContent.prompt = 'Draw some shapes.';
    component.component = new Component(component.componentContent, 'node1');
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    spyOn(component, 'subscribeToNotebookItemChosen').and.callFake(() => {});
    spyOn(component, 'studentDataChanged').and.callFake(() => {});
    fixture.detectChanges();
    // Run tick() so that the setTimeout() in ngAfterViewInit() in draw-student.component.ts has
    // time to run initializeDrawingTool().
    jasmine.clock().tick(1);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  initializeStudentData();
  getCanvas();
  setDrawData();
  isCanvasEmpty();
  resetDrawing();
  createComponentStateObject();
  createComponentStateWithCanvasObjects();
  setWidthAndHeight();
});

function createComponentState(objects: any[]): any {
  return {
    componentType: 'Draw',
    studentData: {
      drawData: JSON.stringify(createDrawData(objects))
    }
  };
}

function createDrawData(objects: any[]): any {
  return {
    canvas: {
      objects: objects
    },
    dt: {
      width: 800,
      height: 600
    }
  };
}

function createCanvasObject(type: string): any {
  return {
    type: type
  };
}

function initializeStudentData() {
  it('should initialize student data when there is a show work connected component', () => {
    component.componentContent.connectedComponents = [
      { nodeId: 'node', componentId: 'component1', type: 'showWork' }
    ];
    spyOn(
      TestBed.inject(StudentDataService),
      'getLatestComponentStateByNodeIdAndComponentId'
    ).and.returnValue(createComponentState([createCanvasObject('rect')]));
    expectNoDrawObject(component.getDrawData());
    component.initializeStudentData();
    expectRectangleDrawObject(component.getDrawData());
  });
  it('should initialize student data when there is previous student work', () => {
    component.componentState = createComponentState([createCanvasObject('rect')]);
    expectNoDrawObject(component.getDrawData());
    component.initializeStudentData();
    expectRectangleDrawObject(component.getDrawData());
  });
  it('should initialize student data when there is starter draw data', () => {
    component.componentContent.starterDrawData = starterDrawData;
    expectNoDrawObject(component.getDrawData());
    component.initializeStudentData();
    expectRectangleDrawObject(component.getDrawData());
  });
}

function expectNoDrawObject(drawDataString: string): void {
  const drawData = JSON.parse(drawDataString);
  expect(drawData.canvas.objects.length).toEqual(0);
}

function expectRectangleDrawObject(drawDataString: string): void {
  const drawData = JSON.parse(drawDataString);
  expect(drawData.canvas.objects.length).toEqual(1);
  expect(drawData.canvas.objects[0].type).toEqual('rect');
}

function getCanvas() {
  it('should get canvas', () => {
    const canvas = component.getCanvas();
    expect(canvas).not.toBeNull();
  });
}

function setDrawData() {
  it('should set the draw data', () => {
    component.drawingTool = {
      load: {}
    };
    spyOn(component.drawingTool, 'load').and.callFake(() => {});
    const componentState = {
      studentData: {
        drawData: starterDrawData,
        submitCounter: 2
      }
    };
    expect(component.submitCounter).toEqual(0);
    component.setDrawData(componentState);
    expect(component.drawingTool.load).toHaveBeenCalled();
    expect(component.submitCounter).toEqual(2);
  });
}

function isCanvasEmpty() {
  it('should check that the canvas is empty', () => {
    checkCanvasEmpty([], true);
  });

  it('should check that the canvas is not empty', () => {
    checkCanvasEmpty([{ id: 1 }, { id: 2 }], false);
  });
}

function checkCanvasEmpty(getObjectsReturnValue: any[], expectedIsEmptyValue: boolean): void {
  component.drawingTool = {
    canvas: {
      getObjects: {}
    }
  };
  spyOn(component.drawingTool.canvas, 'getObjects').and.callFake(() => {
    return getObjectsReturnValue;
  });
  const isEmpty = component.isCanvasEmpty();
  expect(component.drawingTool.canvas.getObjects).toHaveBeenCalled();
  expect(isEmpty).toEqual(expectedIsEmptyValue);
}

function resetDrawing() {
  it('should reset the drawing', () => {
    expect(getDrawObjects().length).toEqual(0);
    component.componentContent.starterDrawData = starterDrawData;
    spyOn(window, 'confirm').and.returnValue(true);
    component.resetDrawing();
    expectRectangleDrawObject(component.getDrawData());
  });
}

function getDrawObjects() {
  const drawData = JSON.parse(component.getDrawData());
  return drawData.canvas.objects;
}

function createComponentStateObject() {
  it('should create a component state object', () => {
    const componentState = component.createComponentStateObject();
    expect(componentState.studentData.drawData).not.toEqual('');
  });
}

function createComponentStateWithCanvasObjects() {
  it('should create component state with canvas objects', () => {
    const canvasObjects = [createCanvasObject('rect')];
    const componentState = component.createComponentStateWithCanvasObjects(canvasObjects);
    const drawData = JSON.parse(componentState.studentData.drawData);
    expect(drawData.canvas.objects.length).toEqual(1);
    expect(drawData.canvas.objects[0].type).toEqual('rect');
  });
}

function setWidthAndHeight() {
  it('should set the width and height', () => {
    expectWidthAndHeight(400, 300, 400, 300);
  });
  it('should set the width and height when they are null', () => {
    expectWidthAndHeight(null, null, 800, 600);
  });
}

function expectWidthAndHeight(
  componentContentWidth: number,
  componentContentHeight: number,
  expectedWidth: number,
  expectedHeight: number
): void {
  component.componentContent.width = componentContentWidth;
  component.componentContent.height = componentContentHeight;
  component.setWidthAndHeight();
  expect(component.width).toEqual(expectedWidth);
  expect(component.height).toEqual(expectedHeight);
}
