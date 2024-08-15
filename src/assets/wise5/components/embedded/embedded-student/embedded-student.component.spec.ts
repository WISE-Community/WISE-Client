import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { Component } from '../../../common/Component';
import { ProjectService } from '../../../services/projectService';
import { StudentDataService } from '../../../services/studentDataService';
import { EmbeddedService } from '../embeddedService';
import { EmbeddedStudent } from './embedded-student.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: EmbeddedStudent;
const componentId = 'component1';
let fixture: ComponentFixture<EmbeddedStudent>;
const nodeId = 'node1';
const otherComponents = [
  {
    nodeId: 'node2',
    componentId: 'component2'
  },
  {
    nodeId: 'node3',
    componentId: 'component3'
  }
];
const patrickAge = 37;
const patrickName = 'Patrick';
const spongebobAge = 34;
const spongebobName = 'Spongebob';

describe('EmbeddedStudentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [EmbeddedStudent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(EmbeddedStudent);
    spyOn(TestBed.inject(ProjectService), 'isSpaceExists').and.returnValue(false);
    component = fixture.componentInstance;
    const componentContent = TestBed.inject(EmbeddedService).createComponent();
    componentContent.id = componentId;
    componentContent.prompt = 'Play with the simulation.';
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

  createComponentStateObject();
  getAllStudentWorkFromOtherComponents();
  getLatestStudentWorkFromOtherComponents();
  handleConnectedComponents();
  handleStudentWorkMessage();
  initializeMessageEventListener();
  isPerformOverwrite();
  mergeASpecificFieldInAComponentState();
  mergeComponentState();
  sendLatestWorkToApplication();
  sendMessageToApplication();
  setWidthAndHeight();
});

function setWidthAndHeight() {
  describe('setWidthAndHeight', () => {
    it('should set the width and height', () => {
      const width = 1000;
      const height = 800;
      component.setWidthAndHeight(1000, 800);
      expect(component.width).toEqual(`${width}px`);
      expect(component.height).toEqual(`${height}px`);
    });
    it('should set the width and height to default values', () => {
      component.setWidthAndHeight(null, null);
      expect(component.width).toEqual('100%');
      expect(component.height).toEqual('600px');
    });
  });
}

function initializeMessageEventListener() {
  describe('initializeMessageEventListener', () => {
    it('should handle event message types', () => {
      const eventTypes = [
        'applicationInitialized',
        'componentDirty',
        'componentSubmitDirty',
        'event',
        'getLatestStudentWork',
        'getLatestAnnotations',
        'getParameters',
        'getProjectPath',
        'getStudentWork',
        'studentDataChanged',
        'studentWork'
      ];
      eventTypes.forEach((eventType) => {
        const functionName: any = getHandlerFunctionName(eventType);
        expectMessageTypeFunctionHandlerToHaveBeenCalled(eventType, functionName);
      });
    });
  });
}

function getHandlerFunctionName(messageType: string): string {
  const messageTypeCapitalized = messageType.charAt(0).toUpperCase() + messageType.slice(1);
  return `handle${messageTypeCapitalized}Message`;
}

function expectMessageTypeFunctionHandlerToHaveBeenCalled(
  messageType: string,
  functionName: keyof EmbeddedStudent
): void {
  const functionSpy = spyOn(component, functionName);
  component.messageEventListener(createMessageEvent(messageType));
  expect(functionSpy).toHaveBeenCalled();
}

function createMessageEvent(messageType: string): any {
  return {
    data: {
      messageType: messageType
    }
  };
}

function createComponentStateObject() {
  describe('createComponentStateObject', () => {
    it('should create a component state object', () => {
      const studentData = {
        value: 10
      };
      component.studentData = studentData;
      const componentState = component.createComponentStateObject();
      expect(componentState.componentType).toEqual('Embedded');
      expect(componentState.nodeId).toEqual(nodeId);
      expect(componentState.componentId).toEqual(componentId);
      expect(componentState.studentData).toEqual(studentData);
    });
  });
}

function handleStudentWorkMessage() {
  describe('handleStudentWorkMessage', () => {
    it('should handle student work message', () => {
      const broadcastComponentSaveTriggeredSpy = spyOn(
        TestBed.inject(StudentDataService),
        'broadcastComponentSaveTriggered'
      );
      const spongebobStudentData = createStudentDataWithNameAndAge(spongebobName, spongebobAge);
      const messageEventData = {
        studentData: spongebobStudentData
      };
      component.handleStudentWorkMessage(messageEventData);
      expect(component.studentData).toEqual(spongebobStudentData);
      expect(broadcastComponentSaveTriggeredSpy).toHaveBeenCalled();
    });
  });
}

function sendLatestWorkToApplication() {
  describe('sendLatestWorkToApplication', () => {
    it('should send latest work to application', () => {
      const componentState = createComponentStateWithNameAndAge(spongebobName, spongebobAge);
      component.componentState = componentState;
      const sendMessageToApplicationSpy = spyOn(
        TestBed.inject(EmbeddedService),
        'sendMessageToApplication'
      );
      component.sendLatestWorkToApplication();
      const message = {
        messageType: 'componentState',
        componentState: componentState
      };
      expect(sendMessageToApplicationSpy).toHaveBeenCalledWith(
        component.embeddedApplicationIFrameId,
        message
      );
    });
  });
}

function getLatestStudentWorkFromOtherComponents() {
  describe('getLatestStudentWorkFromOtherComponents', () => {
    it('should get latest student work from other components', () => {
      spyOn(
        TestBed.inject(StudentDataService),
        'getLatestComponentStateByNodeIdAndComponentId'
      ).and.callFake(fakeGetLatestComponentStateByNodeIdAndComponentId);
      const componentStates = component.getLatestStudentWorkFromOtherComponents(otherComponents);
      expectComponentStateIdsToMatch(componentStates, [2, 3]);
    });
  });
}

function fakeGetLatestComponentStateByNodeIdAndComponentId(
  nodeId: string,
  componentId: string
): any {
  if (nodeId === 'node2' && componentId === 'component2') {
    return { id: 2 };
  } else if (nodeId === 'node3' && componentId === 'component3') {
    return { id: 3 };
  }
}

function getAllStudentWorkFromOtherComponents() {
  describe('getAllStudentWorkFromOtherComponents', () => {
    it('should get all student work from other components', () => {
      spyOn(
        TestBed.inject(StudentDataService),
        'getComponentStatesByNodeIdAndComponentId'
      ).and.callFake(fakeGetComponentStatesByNodeIdAndComponentId);
      const componentStates = component.getAllStudentWorkFromOtherComponents(otherComponents);
      expectComponentStateIdsToMatch(componentStates, [2, 20, 3, 30]);
    });
  });
}

function fakeGetComponentStatesByNodeIdAndComponentId(nodeId: string, componentId: string): any {
  const componentStates = [];
  if (nodeId === 'node2' && componentId === 'component2') {
    componentStates.push({ id: 2 });
    componentStates.push({ id: 20 });
  } else if (nodeId === 'node3' && componentId === 'component3') {
    componentStates.push({ id: 3 });
    componentStates.push({ id: 30 });
  }
  return componentStates;
}

function expectComponentStateIdsToMatch(componentStates: any[], ids: number[]): void {
  expect(componentStates.length).toEqual(ids.length);
  componentStates.forEach((componentState, index) => {
    expect(componentState.id).toEqual(ids[index]);
  });
}

function handleConnectedComponents() {
  describe('handleConnectedComponents', () => {
    it('should handle connected components', () => {
      component.componentContent.connectedComponents = [
        {
          componentId: 'component2',
          nodeId: 'node2',
          type: 'importWork'
        }
      ];
      const studentData = createStudentDataWithNameAndAge(spongebobName, spongebobAge);
      spyOn(component, 'handleImportWorkConnectedComponent').and.returnValue(
        createComponentStateWithStudentData(studentData)
      );
      component.handleConnectedComponents();
      expect(component.studentData).toEqual(studentData);
      expect(component.studentDataChanged).toHaveBeenCalled();
    });
  });
}

function mergeComponentState() {
  let fromComponentState: any;
  let toComponentState: any;
  describe('mergeComponentState', () => {
    beforeEach(() => {
      fromComponentState = createComponentStateWithNameAndAge(patrickName, patrickAge);
      toComponentState = createComponentStateWithNameAndAge(spongebobName, spongebobAge);
    });
    it('should merge component state with no merge fields', () => {
      component.mergeComponentState(toComponentState, fromComponentState, null, true);
      expect(toComponentState.studentData.name).toEqual(patrickName);
      expect(toComponentState.studentData.age).toEqual(patrickAge);
    });
    it('should merge component state with merge fields', () => {
      const mergeFields = [
        {
          name: 'age',
          action: 'write',
          when: 'always'
        }
      ];
      component.mergeComponentState(toComponentState, fromComponentState, mergeFields, true);
      expect(toComponentState.studentData.name).toEqual(spongebobName);
      expect(toComponentState.studentData.age).toEqual(patrickAge);
    });
  });
}

function createComponentStateWithNameAndAge(name: string, age: number): any {
  return {
    componentType: 'Embedded',
    studentData: createStudentDataWithNameAndAge(name, age)
  };
}

function createComponentStateWithStudentData(studentData: any): any {
  return {
    componentType: 'Embedded',
    studentData: studentData
  };
}

function createStudentDataWithNameAndAge(name: string, age: number): any {
  return {
    age: age,
    name: name
  };
}

function sendMessageToApplication() {
  describe('sendMessageToApplication', () => {
    it('should send message to application', () => {
      const sendMessageToApplicationSpy = spyOn(
        TestBed.inject(EmbeddedService),
        'sendMessageToApplication'
      );
      const message = {
        componentState: createComponentStateWithNameAndAge(spongebobName, spongebobAge),
        messageType: 'componentState'
      };
      component.sendMessageToApplication(message);
      expect(sendMessageToApplicationSpy).toHaveBeenCalledWith(
        component.embeddedApplicationIFrameId,
        message
      );
    });
  });
}

function isPerformOverwrite() {
  describe('isPerformOverwrite', () => {
    let mergeField;
    const firstTime = true;
    beforeEach(() => {
      mergeField = {
        action: 'write',
        when: 'always'
      };
    });
    it('should perform overwrite when action is write and when is always', () => {
      expect(component.isPerformOverwrite(mergeField, firstTime)).toEqual(true);
    });
    it('should perform overwrite when action is write and when is first time', () => {
      mergeField.when = 'firstTime';
      expect(component.isPerformOverwrite(mergeField, firstTime)).toEqual(true);
    });
    it('should not perform overwrite when action is read and when is always', () => {
      mergeField.action = 'read';
      expect(component.isPerformOverwrite(mergeField, firstTime)).toEqual(false);
    });
  });
}

function mergeASpecificFieldInAComponentState() {
  it('should merge a specific field in a component state', () => {
    const toComponentState = {
      componentType: 'Embedded',
      studentData: {
        modelScore: 1,
        modelText: 'Try Again'
      }
    };
    const fromComponentState = {
      componentType: 'Embedded',
      studentData: {
        modelScore: 2,
        modelText: 'Good Job'
      }
    };
    const mergeFields = [
      {
        name: 'modelText',
        when: 'always',
        action: 'write'
      }
    ];
    const firstTime = true;
    const mergedComponentState = component.mergeComponentState(
      toComponentState,
      fromComponentState,
      mergeFields,
      firstTime
    );
    expect(mergedComponentState.studentData.modelScore).toEqual(1);
    expect(mergedComponentState.studentData.modelText).toEqual('Good Job');
  });
}
