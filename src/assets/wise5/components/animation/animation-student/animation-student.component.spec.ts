import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { Component } from '../../../common/Component';
import { AnimationService } from '../animationService';
import { AnimationStudent } from './animation-student.component';

let component: AnimationStudent;
const componentId = 'component1';
let fixture: ComponentFixture<AnimationStudent>;
const nodeId = 'node1';
const objectId1 = '2uiqxlkvcc';
const object1 = {
  id: objectId1,
  type: 'image',
  data: [
    {
      t: 0,
      x: 0
    },
    {
      t: 10,
      x: 50
    },
    {
      t: 20,
      x: 0
    }
  ],
  image: 'Swimmer.png',
  dataX: 0,
  dataY: 0
};

describe('AnimationStudent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      declarations: [AnimationStudent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AnimationStudent);
    component = fixture.componentInstance;
    const componentContent = TestBed.inject(AnimationService).createComponent();
    componentContent.id = componentId;
    componentContent.prompt = 'Play the animation.';
    componentContent.objects = [object1];
    component.component = new Component(componentContent, nodeId);
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    spyOn(component, 'subscribeToNotebookItemChosen').and.callFake(() => {});
    spyOn(component, 'studentDataChanged').and.callFake(() => {});
    fixture.detectChanges();
  });

  initializeWidthValues();
  initializeHeightValues();
  initializeDataXOrigin();
  initializeDataYOrigin();
  initializeCoordinateSystem();
  createSVGObjects();
  initializeObjectPosition();
  hasDataPointAtTimeZero();
  setPositionFromDataPoint();
  initializeTimerText();
  getTimerTextX();
  isComponentStateFromDataSource();
  getTrialFromComponentState();
  convertSeriesDataToAnimationData();
  isObjectMovingOnlyInXDirection();
  isObjectMovingOnlyInYDirection();
  shouldConvertDataXToPixelX();
  shouldConvertDataYToPixelY();
  isFieldIncreasing();
  isFieldDecreasing();
  setStudentWork();
  createComponentStateObject();
  confirmSubmit();
  setSpeed();
});

function createDataPoint(time: number, x: number, y: number): any {
  return {
    t: time,
    x: x,
    y: y
  };
}

function isObjectMovingOnlyInXDirection() {
  const currentDataPoint = createDataPoint(0, 0, 0);
  describe('isObjectMovingOnlyInXDirection', () => {
    it('should check if object is moving only in x direction when it is moving up', () => {
      const nextDataPoint = createDataPoint(1, 0, 10);
      expectIsObjectMovingOnlyInXDirection(currentDataPoint, nextDataPoint, false);
    });
    it('should check if object is moving only in x direction when it is moving right', () => {
      const nextDataPoint = createDataPoint(1, 10, 0);
      expectIsObjectMovingOnlyInXDirection(currentDataPoint, nextDataPoint, true);
    });
    it('should check if object is moving only in x direction when it is moving up and right', () => {
      const nextDataPoint = createDataPoint(1, 10, 10);
      expectIsObjectMovingOnlyInXDirection(currentDataPoint, nextDataPoint, false);
    });
  });
}

function expectIsObjectMovingOnlyInXDirection(
  currentDataPoint: any,
  nextDataPoint: any,
  expectedValue: boolean
): void {
  expect(component.isObjectMovingOnlyInXDirection(currentDataPoint, nextDataPoint)).toEqual(
    expectedValue
  );
}

function isObjectMovingOnlyInYDirection() {
  describe('isObjectMovingOnlyInYDirection', () => {
    const currentDataPoint = createDataPoint(0, 0, 0);
    it('should check if object is moving only in y direction when it is moving up', () => {
      const nextDataPoint = createDataPoint(1, 0, 10);
      expectIsObjectMovingOnlyInYDirection(currentDataPoint, nextDataPoint, true);
    });
    it('should check if object is moving only in y direction when it is moving right', () => {
      const nextDataPoint = createDataPoint(1, 10, 0);
      expectIsObjectMovingOnlyInYDirection(currentDataPoint, nextDataPoint, false);
    });
    it('should check if object is moving only in y direction when it is moving up and right', () => {
      const nextDataPoint = createDataPoint(1, 10, 10);
      expectIsObjectMovingOnlyInYDirection(currentDataPoint, nextDataPoint, false);
    });
  });
}

function expectIsObjectMovingOnlyInYDirection(
  currentDataPoint: any,
  nextDataPoint: any,
  expectedValue: boolean
): void {
  expect(component.isObjectMovingOnlyInYDirection(currentDataPoint, nextDataPoint)).toEqual(
    expectedValue
  );
}

function shouldConvertDataXToPixelX() {
  describe('shouldConvertDataXToPixelX', () => {
    it('should convert data x to pixel x', () => {
      const pixelX = component.dataXToPixelX(10);
      expect(pixelX).toEqual(100);
    });
  });
}

function shouldConvertDataYToPixelY() {
  describe('shouldConvertDataYToPixelY', () => {
    it('should convert data y to pixel y', () => {
      const pixelY = component.dataYToPixelY(0);
      expect(pixelY).toEqual(80);
    });
  });
}

function initializeWidthValues() {
  describe('initializeWidthValues', () => {
    it('should initialize width values', () => {
      component.initializeWidthValues();
      expect(component.width).toEqual(component.componentContent.widthInPixels);
      expect(component.pixelsPerXUnit).toEqual(
        component.componentContent.widthInPixels / component.componentContent.widthInUnits
      );
    });
  });
}

function initializeHeightValues() {
  describe('initializeHeightValues', () => {
    it('should initialize height values', () => {
      component.initializeHeightValues();
      expect(component.height).toEqual(component.componentContent.heightInPixels);
      expect(component.pixelsPerYUnit).toEqual(
        component.componentContent.heightInPixels / component.componentContent.heightInUnits
      );
    });
  });
}

function initializeDataXOrigin() {
  describe('initializeDataXOrigin', () => {
    it('should initialize data x origin', () => {
      component.initializeDataXOrigin();
      expect(component.dataXOriginInPixels).toEqual(component.componentContent.dataXOriginInPixels);
    });
  });
}

function initializeDataYOrigin() {
  describe('initializeDataYOrigin', () => {
    it('should initialize data y origin', () => {
      component.initializeDataYOrigin();
      expect(component.dataYOriginInPixels).toEqual(component.componentContent.dataYOriginInPixels);
    });
  });
}

function initializeCoordinateSystem() {
  describe('initializeCoordinateSystem', () => {
    it('should initialize coordinate system', () => {
      component.initializeCoordinateSystem();
      expect(component.coordinateSystem).toEqual(component.componentContent.coordinateSystem);
    });
  });
}

function createSVGObjects() {
  describe('createSVGObjects', () => {
    it('should create svg objects', () => {
      component.createSVGObjects();
      expect(component.idToSVGObject[objectId1]).not.toBeNull();
      expect(component.idToWhetherAuthoredObjectIsAnimating[objectId1]).toEqual(false);
    });
  });
}

function initializeObjectPosition() {
  describe('initializeObjectPosition', () => {
    it('should initialize object position', () => {
      component.initializeObjectPosition(object1);
      expect(component.getSVGObject(objectId1).attr('x')).toEqual(0);
      expect(component.getSVGObject(objectId1).attr('y')).toEqual(80);
    });
  });
}

function hasDataPointAtTimeZero() {
  describe('hasDataPointAtTimeZero', () => {
    it('should check if there is a data point at time zero when there is', () => {
      const data = [{ t: 0 }, { t: 1 }];
      expect(component.hasDataPointAtTimeZero(data)).toEqual(true);
    });
    it('should check if there is a data point at time zero when there is not', () => {
      const data = [{ t: 1 }];
      expect(component.hasDataPointAtTimeZero(data)).toEqual(false);
    });
    it('should check if there is a data point at time zero when there are no data points', () => {
      const data = [];
      expect(component.hasDataPointAtTimeZero(data)).toEqual(false);
    });
  });
}

function setPositionFromDataPoint() {
  describe('setPositionFromDataPoint', () => {
    it('should set position from data point', () => {
      const svgObject = component.getSVGObject(objectId1);
      const x = 10;
      const y = 20;
      const dataPoint = { x: x, y: y };
      component.setPositionFromDataPoint(svgObject, dataPoint);
      expect(component.getSVGObject(objectId1).attr('x')).toEqual(100);
      expect(component.getSVGObject(objectId1).attr('y')).toEqual(280);
    });
  });
}

function initializeTimerText() {
  describe('initializeTimerText', () => {
    it('should initialize timer text', () => {
      component.initializeTimerText();
      expect(component.timerText).not.toBeNull();
      expect(component.timerText.text()).toEqual('0');
    });
  });
}

function getTimerTextX() {
  describe('getTimerTextX', () => {
    it('should get timer text x when the time is a single digit', () => {
      expect(component.getTimerTextX(0)).toEqual(570);
    });
    it('should get timer text x when the time has two digits', () => {
      expect(component.getTimerTextX(10)).toEqual(562);
    });
    it('should get timer text x when the time has three digits', () => {
      expect(component.getTimerTextX(100)).toEqual(554);
    });
  });
}

function isComponentStateFromDataSource() {
  describe('isComponentStateFromDataSource', () => {
    it('should check if component state is from data source when it is', () => {
      const componentState = createObjectWithNodeIdAndComponentId('node1', 'component1');
      const dataSource = createObjectWithNodeIdAndComponentId('node1', 'component1');
      expect(component.isComponentStateFromDataSource(componentState, dataSource)).toEqual(true);
    });
    it('should check if component state is from data source when it is not', () => {
      const componentState = createObjectWithNodeIdAndComponentId('node1', 'component1');
      const dataSource = createObjectWithNodeIdAndComponentId('node2', 'component2');
      expect(component.isComponentStateFromDataSource(componentState, dataSource)).toEqual(false);
    });
  });
}

function createObjectWithNodeIdAndComponentId(nodeId: string, componentId: string): any {
  return {
    componentId: componentId,
    nodeId: nodeId
  };
}

function getTrialFromComponentState() {
  describe('getTrialFromComponentState', () => {
    const trial1 = { id: 1 };
    const trial2 = { id: 2 };
    const componentState = {
      studentData: {
        trials: [trial1, trial2]
      }
    };
    it('should get trial from component state', () => {
      expect(component.getTrialFromComponentState(componentState, 0)).toEqual(trial1);
      expect(component.getTrialFromComponentState(componentState, 1)).toEqual(trial2);
    });
  });
}

function convertSeriesDataToAnimationData() {
  describe('convertSeriesDataToAnimationData', () => {
    const seriesData = [
      [0, 0],
      [1, 10],
      [2, 20]
    ];
    const tColumnIndex = 0;
    const xColumnIndex = 1;
    let yColumnIndex;
    it('should convert series data to animation data', () => {
      const animationData = component.convertSeriesDataToAnimationData(
        seriesData,
        tColumnIndex,
        xColumnIndex,
        yColumnIndex
      );
      expectAnimationDataValuesToEqual(animationData, seriesData);
    });
  });
}

function expectAnimationDataValuesToEqual(animationData: any, expectedValues: any) {
  for (let dataPointIndex = 0; dataPointIndex < animationData.length; dataPointIndex++) {
    const animationDataPoint = animationData[dataPointIndex];
    animationDataPoint.t = expectedValues[dataPointIndex][0];
    animationDataPoint.x = expectedValues[dataPointIndex][1];
  }
}

function isFieldIncreasing() {
  describe('isFieldIncreasing', () => {
    it('should check if field is increasing when it is increasing', () => {
      const currentDataPoint = createObjectWithXValue(0);
      const nextDataPoint = createObjectWithXValue(10);
      expect(component.isFieldIncreasing(currentDataPoint, nextDataPoint, 'x')).toEqual(true);
    });
    it('should check if field is increasing when it is not increasing', () => {
      const currentDataPoint = createObjectWithXValue(10);
      const nextDataPoint = createObjectWithXValue(0);
      expect(component.isFieldIncreasing(currentDataPoint, nextDataPoint, 'x')).toEqual(false);
    });
    it('should check if field is increasing when it is not moving', () => {
      const currentDataPoint = createObjectWithXValue(0);
      const nextDataPoint = createObjectWithXValue(0);
      expect(component.isFieldIncreasing(currentDataPoint, nextDataPoint, 'x')).toEqual(false);
    });
  });
}

function isFieldDecreasing() {
  describe('isFieldDecreasing', () => {
    it('should check if field is dereasing when it is decreasing', () => {
      const currentDataPoint = createObjectWithXValue(10);
      const nextDataPoint = createObjectWithXValue(0);
      expect(component.isFieldDecreasing(currentDataPoint, nextDataPoint, 'x')).toEqual(true);
    });
    it('should check if field is decreasing when it is not decreasing', () => {
      const currentDataPoint = createObjectWithXValue(0);
      const nextDataPoint = createObjectWithXValue(10);
      expect(component.isFieldDecreasing(currentDataPoint, nextDataPoint, 'x')).toEqual(false);
    });
    it('should check if field is decreasing when it is not moving', () => {
      const currentDataPoint = createObjectWithXValue(0);
      const nextDataPoint = createObjectWithXValue(0);
      expect(component.isFieldDecreasing(currentDataPoint, nextDataPoint, 'x')).toEqual(false);
    });
  });
}

function createObjectWithXValue(x: number): any {
  return { x: x };
}

function setStudentWork() {
  describe('setStudentWork', () => {
    it('should set student work', () => {
      const componentState = {
        studentData: {
          numTimesPlayClicked: 1
        }
      };
      component.setStudentWork(componentState);
      expect(component.numTimesPlayClicked).toEqual(1);
    });
  });
}

function confirmSubmit() {
  describe('confirmSubmit', () => {
    it('should confirm submit when there are no submits left', () => {
      const alertSpy = spyOn(window, 'alert');
      expect(component.confirmSubmit(0)).toEqual(false);
      expect(alertSpy).toHaveBeenCalled();
    });
    it('should confirm submit when there is one submit left', () => {
      const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
      expect(component.confirmSubmit(1)).toEqual(true);
      expect(confirmSpy).toHaveBeenCalled();
    });
    it('should confirm submit when there is more than one submit left', () => {
      const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
      expect(component.confirmSubmit(2)).toEqual(true);
      expect(confirmSpy).toHaveBeenCalled();
    });
  });
}

function createComponentStateObject() {
  describe('createComponentStateObject', () => {
    it('should create component state object', () => {
      const numTimesPlayClicked = 10;
      component.numTimesPlayClicked = numTimesPlayClicked;
      const componentState = component.createComponentStateObject();
      expect(componentState.nodeId).toEqual(nodeId);
      expect(componentState.componentId).toEqual(componentId);
      expect(componentState.studentData.numTimesPlayClicked).toEqual(numTimesPlayClicked);
    });
  });
}

function setSpeed() {
  describe('setSpeed', () => {
    it('should set speed', () => {
      expectMillisecondsPerDataTime(1);
      expectMillisecondsPerDataTime(2);
      expectMillisecondsPerDataTime(3);
      expectMillisecondsPerDataTime(4);
      expectMillisecondsPerDataTime(5);
    });
  });
}

function expectMillisecondsPerDataTime(speed: number) {
  component.setSpeed(speed);
  expect(component.millisecondsPerDataTime).toEqual(
    component.speedToMillisecondsPerDataTime[speed]
  );
}
