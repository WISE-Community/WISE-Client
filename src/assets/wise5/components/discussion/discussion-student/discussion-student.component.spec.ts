import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { of } from 'rxjs';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { Component } from '../../../common/Component';
import { ComponentContent } from '../../../common/ComponentContent';
import { ConfigService } from '../../../services/configService';
import { NotificationService } from '../../../services/notificationService';
import { ProjectService } from '../../../services/projectService';
import { DiscussionService } from '../discussionService';
import { DiscussionStudent } from './discussion-student.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: DiscussionStudent;
const componentId = 'component1';
let componentState1: any;
let componentState2: any;
let fixture: ComponentFixture<DiscussionStudent>;
const nodeId = 'node1';
let saveNotificationToServerSpy;

describe('DiscussionStudentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [DiscussionStudent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [BrowserModule,
        MatDialogModule,
        StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(DiscussionStudent);
    spyOn(TestBed.inject(ProjectService), 'isSpaceExists').and.returnValue(false);
    spyOn(TestBed.inject(ConfigService), 'getUserIdsStringByWorkgroupId').and.returnValue('1');
    saveNotificationToServerSpy = spyOn(
      TestBed.inject(NotificationService),
      'saveNotificationToServer'
    ).and.callFake(
      (notification: any): Promise<any> => {
        return Promise.resolve({});
      }
    );
    component = fixture.componentInstance;
    const componentContent = {
      id: componentId,
      prompt: 'Post your favorite ice cream flavor.'
    } as ComponentContent;
    component.component = new Component(componentContent, nodeId);
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    spyOn(component, 'registerNotebookItemChosenListener').and.callFake(() => {});
    spyOn(component, 'studentDataChanged').and.callFake(() => {});
    fixture.detectChanges();
    componentState1 = createComponentStateObject(1, 10, 'Hello');
    componentState2 = createComponentStateObject(2, 11, 'World', true, 1);
  });

  addClassResponse();
  addResponseToResponsesMap();
  clearComponentValues();
  createComponentState();
  disableComponentIfNecessary();
  getClassmateResponses();
  isConnectedComponentImportWorkMode();
  isConnectedComponentShowWorkMode();
  sendPostToStudentsInThread();
  sendPostToThreadCreator();
  sendPostToThreadRepliers();
  setClassResponses();
});

function createComponentStateObject(
  id: number,
  workgroupId: number,
  response: string,
  isSubmit: boolean = true,
  componentStateIdReplyingTo: number = null
): any {
  return {
    id: id,
    replies: [],
    studentData: {
      componentStateIdReplyingTo: componentStateIdReplyingTo,
      isSubmit: isSubmit,
      response: response
    },
    workgroupId: workgroupId
  };
}

function addResponseToResponsesMap() {
  describe('addResponseToResponsesMap', () => {
    it('should add response to responses map', () => {
      const responsesMap = {};
      component.addResponseToResponsesMap(responsesMap, componentState1);
      component.addResponseToResponsesMap(responsesMap, componentState2);
      expect(responsesMap[1]).toEqual(componentState1);
      expect(responsesMap[2]).toEqual(componentState2);
      expect(responsesMap[1].replies).toEqual([componentState2]);
    });
  });
}

function addClassResponse() {
  describe('addClassResponse', () => {
    it('should add class response', () => {
      const componentState = createComponentStateObject(1, 10, 'Hello');
      component.addClassResponse(componentState);
      expect(component.classResponses).toEqual([componentState]);
      expect(component.topLevelResponses.all).toEqual([componentState]);
      expect(component.topLevelResponses.col1).toEqual([]);
      expect(component.topLevelResponses.col2).toEqual([componentState]);
    });
  });
}

function setClassResponses() {
  describe('setClassResponses', () => {
    it('should set class responses', () => {
      const componentStates = [componentState1, componentState2];
      component.setClassResponses(componentStates);
      expect(component.classResponses).toEqual(componentStates);
      expect(component.responsesMap[1]).toEqual(componentState1);
      expect(component.responsesMap[2]).toEqual(componentState2);
      expect(component.topLevelResponses.all).toEqual([componentState1]);
      expect(component.topLevelResponses.col1).toEqual([]);
      expect(component.topLevelResponses.col2).toEqual([componentState1]);
      expect(component.retrievedClassmateResponses).toEqual(true);
    });
  });
}

function clearComponentValues() {
  describe('clearComponentValues', () => {
    it('should clear component values', () => {
      component.studentResponse = 'Hello';
      component.newResponse = 'World';
      component.attachments = ['image.png'];
      component.componentStateIdReplyingTo = 1;
      component.clearComponentValues();
      expect(component.studentResponse).toEqual('');
      expect(component.newResponse).toEqual('');
      expect(component.attachments).toEqual([]);
      expect(component.componentStateIdReplyingTo).toEqual(null);
    });
  });
}

function createComponentState() {
  describe('createComponentState', () => {
    it(
      'should create component state',
      waitForAsync(() => {
        const response = 'Hello';
        component.studentResponse = response;
        component.createComponentState('save').then((componentState: any) => {
          expect(componentState.componentId).toEqual(componentId);
          expect(componentState.nodeId).toEqual(nodeId);
          expect(componentState.studentData.response).toEqual(response);
        });
      })
    );
  });
}

function sendPostToStudentsInThread() {
  describe('sendPostToStudentsInThread', () => {
    it('should send post to students in thread', () => {
      component.setClassResponses([componentState1, componentState2]);
      const componentState3 = createComponentStateObject(3, 12, 'OK', true, 1);
      const sendPostToThreadCreatorSpy = spyOn(component, 'sendPostToThreadCreator');
      const sendPostToThreadRepliersSpy = spyOn(component, 'sendPostToThreadRepliers');
      component.sendPostToStudentsInThread(componentState3);
      expect(sendPostToThreadCreatorSpy).toHaveBeenCalledTimes(1);
      expect(sendPostToThreadRepliersSpy).toHaveBeenCalledTimes(1);
    });
  });
}

function sendPostToThreadCreator() {
  describe('sendPostToThreadCreator', () => {
    it('should send post to thread creator', () => {
      const workgroupsNotifiedSoFar = [];
      const componentStateIdReplyingTo = 1;
      componentState1.workgroupId = 10;
      component.addClassResponse(componentState1);
      component.sendPostToThreadCreator(
        componentStateIdReplyingTo,
        'DiscussionReply',
        nodeId,
        componentId,
        11,
        'Student 2 replied to a discussion you were in!',
        workgroupsNotifiedSoFar
      );
      expect(saveNotificationToServerSpy).toHaveBeenCalled();
      expect(workgroupsNotifiedSoFar).toEqual([10]);
    });
  });
}

function sendPostToThreadRepliers() {
  describe('sendPostToThreadRepliers', () => {
    it('should send post to thread repliers', () => {
      const workgroupsNotifiedSoFar = [];
      const componentState3 = createComponentStateObject(3, 12, 'OK', true, 1);
      component.setClassResponses([componentState1, componentState2, componentState3]);
      const componentStateIdReplyingTo = 1;
      component.sendPostToThreadRepliers(
        componentStateIdReplyingTo,
        'DiscussionReply',
        nodeId,
        componentId,
        13,
        'Student 3 replied to a discussion you were in!',
        workgroupsNotifiedSoFar
      );
      expect(saveNotificationToServerSpy).toHaveBeenCalledTimes(2);
      expect(workgroupsNotifiedSoFar).toEqual([11, 12]);
    });
  });
}

function disableComponentIfNecessary() {
  describe('disableComponentIfNecessary', () => {
    it('should disable component if necessary when it should be disabled', () => {
      component.componentContent.connectedComponents = [
        {
          type: 'showWork'
        }
      ];
      component.disableComponentIfNecessary();
      expect(component.isDisabled).toEqual(true);
    });
    it('should disable component if necessary when it should not be disabled', () => {
      component.componentContent.connectedComponents = [
        {
          type: 'importWork'
        }
      ];
      component.disableComponentIfNecessary();
      expect(component.isDisabled).toEqual(false);
    });
  });
}

function getClassmateResponses() {
  describe('getClassmateResponses', () => {
    it(
      'should get classmate responses',
      waitForAsync(() => {
        spyOn(TestBed.inject(DiscussionService), 'getClassmateResponses').and.callFake(() => {
          return of({
            studentWork: [componentState1, componentState2],
            annotations: []
          });
        });
        const setClassResponsesSpy = spyOn(component, 'setClassResponses').and.callThrough();
        component.getClassmateResponses();
        fixture.whenStable().then(() => {
          expect(setClassResponsesSpy).toHaveBeenCalledWith([componentState1, componentState2], []);
        });
      })
    );
  });
}

function isConnectedComponentShowWorkMode() {
  describe('isConnectedComponentShowWorkMode', () => {
    beforeEach(() => {
      component.componentContent.connectedComponents = [
        {
          nodeId: 'node2',
          componentId: 'component2',
          type: 'showWork'
        }
      ];
    });
    it('should check if there is a show work connected component when there is', () => {
      expect(component.isConnectedComponentShowWorkMode()).toEqual(true);
    });
    it('should check if there is a show work connected component when there is not', () => {
      component.componentContent.connectedComponents[0].type = 'importWork';
      expect(component.isConnectedComponentShowWorkMode()).toEqual(false);
    });
  });
}

function isConnectedComponentImportWorkMode() {
  describe('isConnectedComponentImportWorkMode', () => {
    beforeEach(() => {
      component.componentContent.connectedComponents = [
        {
          nodeId: 'node2',
          componentId: 'component2',
          type: 'importWork'
        }
      ];
    });
    it('should check if there is a import work connected component when there is', () => {
      expect(component.isConnectedComponentImportWorkMode()).toEqual(true);
    });
    it('should check if there is a import work connected component when there is not', () => {
      component.componentContent.connectedComponents[0].type = 'showWork';
      expect(component.isConnectedComponentImportWorkMode()).toEqual(false);
    });
  });
}
