import { fabric } from 'fabric';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { LabelStudent } from './label-student.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { Component } from '../../../common/Component';

let component: LabelStudent;
let fixture: ComponentFixture<LabelStudent>;

describe('LabelStudentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      declarations: [LabelStudent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(LabelStudent);
    component = fixture.componentInstance;
    const componentContent = {
      id: 'component1',
      type: 'Label',
      prompt: 'Create some labels.',
      width: 800,
      height: 600
    };
    component.component = new Component(componentContent, null);
    spyOn(component, 'giveFocusToLabelTextInput').and.callFake(() => {});
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    spyOn(component, 'studentDataChanged').and.callFake(() => {});
    fixture.detectChanges();
  });

  initializeComponent();
  setStudentWork();
  getLabelJSONObjectFromCircle();
  getLabelJSONObjectFromText();
  createStudentData();
  getTextCoordinate();
  mergeLabelComponentState();
  limitObjectXPosition();
  limitObjectYPosition();
  getUnoccupiedPointLocation();
  getNumShowWorkConnectedComponents();
  addNewLabel();
  deleteLabel();
});

function createComponentState(studentData: any = createStudentDataObject()): any {
  return {
    studentData: studentData
  };
}

function createStudentDataObject(
  labels: any[] = [],
  backgroundImage: string = null,
  version: number = 2
) {
  return {
    labels: labels,
    backgroundImage: backgroundImage,
    version: version
  };
}

function createLabelObject(text: string) {
  return {
    text: text
  };
}

function initializeComponent() {
  it('should initialize component', () => {
    const width = 800;
    const height = 600;
    const enableCircles = true;
    const showSaveButton = true;
    const showSubmitButton = true;
    const canCreateLabels = true;
    const componentContent = {
      width: width,
      height: height,
      enableCircles: enableCircles,
      showSaveButton: showSaveButton,
      showSubmitButton: showSubmitButton,
      canCreateLabels: canCreateLabels
    };
    component.initializeComponent(componentContent);
    expect(component.canvasWidth).toEqual(width);
    expect(component.canvasHeight).toEqual(height);
    expect(component.enableCircles).toEqual(enableCircles);
    expect(component.isSaveButtonVisible).toEqual(showSaveButton);
    expect(component.isSubmitButtonVisible).toEqual(showSubmitButton);
    expect(component.isAddNewLabelButtonVisible).toEqual(canCreateLabels);
  });
}

function setStudentWork() {
  it('should set student work', () => {
    const version = 2;
    const labels = [{ text: 'leaf' }, { text: 'stem' }, { text: 'roots' }];
    const backgroundImage = 'plant-cell.png';
    const componentState = createComponentState(
      createStudentDataObject(labels, backgroundImage, version)
    );
    spyOn(component.canvas, 'setBackgroundImage').and.callFake(() => {});
    component.setStudentWork(componentState);
    expect(component.studentDataVersion).toEqual(2);
    expect(component.labels.length).toEqual(3);
    expect(component.backgroundImage).toEqual(backgroundImage);
  });
}

function getLabelJSONObjectFromCircle() {
  it('should get label json object from circle', () => {
    const circleLeft = 100;
    const circleTop = 200;
    const circle = new fabric.Circle({ left: circleLeft, top: circleTop });
    const textLeft = 300;
    const textTop = 400;
    const textString = 'Leaf';
    const textBackgroundColor = 'green';
    circle.text = {
      left: textLeft,
      top: textTop,
      backgroundColor: textBackgroundColor
    };
    spyOn(component, 'getLabelFromCircle').and.returnValue({ textString: textString });
    const labelJson = component.getLabelJSONObjectFromCircle(circle);
    expect(labelJson.pointX).toEqual(circleLeft);
    expect(labelJson.pointY).toEqual(circleTop);
    expect(labelJson.textX).toEqual(textLeft);
    expect(labelJson.textY).toEqual(textTop);
    expect(labelJson.text).toEqual(textString);
    expect(labelJson.color).toEqual(textBackgroundColor);
  });
}

function getLabelJSONObjectFromText() {
  it('should get label json object from text', () => {
    const circleLeft = 100;
    const circleTop = 200;
    const circle = new fabric.Circle({ left: circleLeft, top: circleTop });
    const textLeft = 300;
    const textTop = 400;
    const textString = 'Leaf';
    const textBackgroundColor = 'green';
    const text = {
      left: textLeft,
      top: textTop,
      textString: textString,
      backgroundColor: textBackgroundColor
    };
    const canEdit = true;
    const canDelete = true;
    spyOn(component, 'getLabelFromText').and.returnValue({
      textString: textString,
      canEdit: canEdit,
      canDelete: canDelete,
      circle: circle,
      line: {},
      text: text
    });
    const labelJson = component.getLabelJSONObjectFromText(circle);
    expect(labelJson.pointX).toEqual(circleLeft);
    expect(labelJson.pointY).toEqual(circleTop);
    expect(labelJson.textX).toEqual(textLeft);
    expect(labelJson.textY).toEqual(textTop);
    expect(labelJson.text).toEqual(textString);
    expect(labelJson.color).toEqual(textBackgroundColor);
    expect(labelJson.canEdit).toEqual(canEdit);
    expect(labelJson.canDelete).toEqual(canDelete);
  });
}

function createStudentData() {
  it('should create student data', () => {
    const labels = [{ text: 'Leaf' }, { text: 'Stem' }];
    const backgroundImage = 'plant.png';
    const studentData = component.createStudentData(labels, backgroundImage);
    expect(studentData.version).toEqual(2);
    expect(studentData.labels).toEqual(labels);
    expect(studentData.backgroundImage).toEqual(backgroundImage);
  });
}

function getTextCoordinate() {
  it('should get text coordinate', () => {
    const left = 100;
    const top = 200;
    const circle = {
      text: {
        left: left,
        top: top
      }
    };
    const textCoordinate = component.getTextCoordinate(circle);
    expect(textCoordinate.textX).toEqual(left);
    expect(textCoordinate.textY).toEqual(top);
  });
}

function mergeLabelComponentState() {
  it('should merge label component state labels', () => {
    const label1 = createLabelObject('Label 1');
    const label2 = createLabelObject('Label 2');
    const componentStateFrom = createComponentState(createStudentDataObject([label2], null, 2));
    const componentStateTo = createComponentState(createStudentDataObject([label1], null, 2));
    component.mergeLabelComponentState(componentStateFrom, componentStateTo);
    expect(componentStateTo.studentData.labels.length).toEqual(2);
    expect(componentStateTo.studentData.labels[0]).toEqual(label1);
    expect(componentStateTo.studentData.labels[1]).toEqual(label2);
  });
  it('should merge label component state background', () => {
    const computerImage = 'computer.png';
    const componentStateFrom = createComponentState(createStudentDataObject([], computerImage, 2));
    const componentStateTo = createComponentState(createStudentDataObject([], 'house.png', 2));
    component.mergeLabelComponentState(componentStateFrom, componentStateTo);
    expect(componentStateTo.studentData.backgroundImage).toEqual(computerImage);
  });
}

function limitObjectXPosition() {
  it('should limit object x position when it is less than 0', () => {
    const circle = new fabric.Circle({ left: -1 });
    component.limitObjectXPosition(circle);
    expect(circle.get('left')).toEqual(0);
  });
  it('should limit object x position when it is greater than the canvas width', () => {
    const circle = new fabric.Circle({ left: 1000 });
    component.canvasWidth = 800;
    component.limitObjectXPosition(circle);
    expect(circle.get('left')).toEqual(800);
  });
}

function limitObjectYPosition() {
  it('should limit object y position when it is less than 0', () => {
    const circle = new fabric.Circle({ top: -1 });
    component.limitObjectYPosition(circle);
    expect(circle.get('top')).toEqual(0);
  });
  it('should limit object y position when it is greater than the canvas height', () => {
    const circle = new fabric.Circle({ top: 1000 });
    component.canvasHeight = 600;
    component.limitObjectYPosition(circle);
    expect(circle.get('top')).toEqual(600);
  });
}

function getUnoccupiedPointLocation() {
  it('should get unoccupied point location when there are no occupied points', () => {
    spyOn(component, 'getOccupiedPointLocations').and.returnValue([]);
    const unoccupiedPointLocation = component.getUnoccupiedPointLocation();
    expect(unoccupiedPointLocation.pointX).toEqual(80);
    expect(unoccupiedPointLocation.pointY).toEqual(80);
  });
  it('should get unoccupied point location when there are occupied points', () => {
    spyOn(component, 'getOccupiedPointLocations').and.returnValue([
      { pointX: 80, pointY: 80 },
      { pointX: 280, pointY: 80 }
    ]);
    const unoccupiedPointLocation = component.getUnoccupiedPointLocation();
    expect(unoccupiedPointLocation.pointX).toEqual(480);
    expect(unoccupiedPointLocation.pointY).toEqual(80);
  });
}

function getNumShowWorkConnectedComponents() {
  it(`should get the number of show work connected components when there are no connected
      components`, () => {
    const connectedComponents = [];
    expect(component.getNumShowWorkConnectedComponents(connectedComponents)).toEqual(0);
  });
  it(`should get the number of show work connected components when there is one show work connected
      components`, () => {
    const connectedComponents = [{ type: 'showWork' }];
    expect(component.getNumShowWorkConnectedComponents(connectedComponents)).toEqual(1);
  });
  it(`should get the number of show work connected components when there is one show work connected
      components and one import work connected component`, () => {
    const connectedComponents = [{ type: 'showWork' }, { type: 'importWork' }];
    expect(component.getNumShowWorkConnectedComponents(connectedComponents)).toEqual(1);
  });
}

function addNewLabel() {
  it('should add a new label', () => {
    component.addNewLabel();
    expect(component.labels.length).toEqual(1);
  });
}

function deleteLabel() {
  it('should delete a label', () => {
    component.addNewLabel();
    expect(component.labels.length).toEqual(1);
    component.deleteLabel(component.labels[0]);
    expect(component.labels.length).toEqual(0);
  });
}
