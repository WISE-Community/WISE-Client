import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { PossibleScoreComponent } from '../../../../../app/possible-score/possible-score.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { Component } from '../../../common/Component';
import { ComponentHeader } from '../../../directives/component-header/component-header.component';
import { ComponentSaveSubmitButtons } from '../../../directives/component-save-submit-buttons/component-save-submit-buttons.component';
import { AudioRecorderService } from '../../../services/audioRecorderService';
import { CRaterService } from '../../../services/cRaterService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { StudentDataService } from '../../../services/studentDataService';
import { OpenResponseContent } from '../OpenResponseContent';
import { OpenResponseService } from '../openResponseService';
import { OpenResponseStudent } from './open-response-student.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialogWithoutCloseComponent } from '../../../directives/dialog-without-close/dialog-without-close.component';

let component: OpenResponseStudent;
const componentId = 'component1';
let fixture: ComponentFixture<OpenResponseStudent>;
const nodeId = 'node1';
const response = 'Hello World';

describe('OpenResponseStudent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        PossibleScoreComponent,
        ReactiveFormsModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [
        ComponentHeader,
        ComponentSaveSubmitButtons,
        DialogWithoutCloseComponent,
        OpenResponseStudent
      ],
      providers: [AudioRecorderService],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    spyOn(TestBed.inject(ProjectService), 'getSpeechToTextSettings').and.returnValue({});
    fixture = TestBed.createComponent(OpenResponseStudent);
    spyOn(TestBed.inject(ProjectService), 'isSpaceExists').and.returnValue(false);
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    component = fixture.componentInstance;
    const componentContent = {
      cRater: {},
      enableCRater: true,
      id: componentId,
      prompt: 'How do plants obtain energy?',
      showSaveButton: true,
      showSubmitButton: true
    } as OpenResponseContent;
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
  });

  checkHasFeedbackWhenCRaterIsNotEnabled();
  checkHasFeedbackWhenCRaterIsEnabledAndNotShowFeedbackOrScore();
  checkHasFeedbackWhenCRaterIsEnabledAndShowFeedback();
  checkHasFeedbackWhenCRaterIsEnabledAndShowScore();
  createComponentState();
  createComponentStateAdditionalProcessing();
  createMergedComponentState();
  hasFeedback();
  setStudentWork();
  snipButtonClicked();
  submitWithFeedback();
  submitWithoutFeedback();
});

function setStudentWork() {
  describe('setStudentWork', () => {
    it('should set student work', () => {
      const componentState = {
        studentData: {
          response: response
        }
      };
      component.setStudentWork(componentState);
      expect(component.studentResponse).toEqual(response);
    });
  });
}

function submitWithFeedback() {
  describe('submitWithFeedback', () => {
    it('should submit with feedback when there are no submits left', () => {
      expectPopupToBeCalledWith(
        'alert',
        'submitWithFeedback',
        0,
        'You do not have any more chances to receive feedback on your answer.'
      );
    });
    it('should submit with feedback when there is one submit left', () => {
      expectPopupToBeCalledWith(
        'confirm',
        'submitWithFeedback',
        1,
        'You have 1 chance to receive feedback on your answer so this should be your best work.' +
          '\n\nAre you ready to receive feedback on this answer?'
      );
    });
    it('should submit with feedback when there are two submits left', () => {
      expectPopupToBeCalledWith(
        'confirm',
        'submitWithFeedback',
        2,
        'You have 2 chances to receive feedback on your answer so this should be your best work.' +
          '\n\nAre you ready to receive feedback on this answer?'
      );
    });
  });
}

function submitWithoutFeedback() {
  describe('submitWithoutFeedback', () => {
    it('should submit without feedback when there are no submits left', () => {
      expectPopupToBeCalledWith(
        'alert',
        'submitWithoutFeedback',
        0,
        'You do not have any more chances to receive feedback on your answer.'
      );
    });
    it('should submit without feedback when there is one submit left', () => {
      expectPopupToBeCalledWith(
        'confirm',
        'submitWithoutFeedback',
        1,
        'You have 1 chance to receive feedback on your answer so this should be your best work.' +
          '\n\nAre you ready to receive feedback on this answer?'
      );
    });
    it('should submit without feedback when there are two submits left', () => {
      expectPopupToBeCalledWith(
        'confirm',
        'submitWithoutFeedback',
        2,
        'You have 2 chances to submit your answer so this should be your best work.' +
          '\n\nAre you ready to submit this answer?'
      );
    });
  });
}

function expectPopupToBeCalledWith(
  popupType: string,
  functionName: string,
  submitsLeft: number,
  message: string
): void {
  let popupSpy;
  if (popupType === 'alert') {
    popupSpy = spyOn(window, 'alert');
  } else if (popupType === 'confirm') {
    popupSpy = spyOn(window, 'confirm');
  }
  component[functionName](submitsLeft);
  expect(popupSpy).toHaveBeenCalledWith(message);
}

function createComponentState() {
  describe('createComponentState', () => {
    it(
      'should create component state',
      waitForAsync(() => {
        spyOn(TestBed.inject(OpenResponseService), 'isCompletedV2').and.returnValue(true);
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

function createComponentStateAdditionalProcessing() {
  describe('createComponentStateAdditionalProcessing', () => {
    it('should perform create component state additional processing', (done) => {
      spyOn(TestBed.inject(OpenResponseService), 'isCompletedV2').and.returnValue(true);
      spyOn(TestBed.inject(CRaterService), 'isCRaterScoreOnEvent').and.returnValue(true);
      spyOn(TestBed.inject(CRaterService), 'makeCRaterScoringRequest').and.returnValue(
        of({
          responses: {
            feedback: {
              ideas: {}
            },
            scores: {
              raw_trim_round: 1
            }
          }
        })
      );
      component.isSubmit = true;
      component.createComponentState('submit').then((componentState: any) => {
        expect(componentState.componentId).toEqual(componentId);
        expect(componentState.nodeId).toEqual(nodeId);
        expect(componentState.annotations.length).toEqual(1);
        expect(componentState.annotations[0].data.value).toEqual(1);
        done();
      });
    });
  });
}

function snipButtonClicked() {
  describe('snipButtonClicked', () => {
    it('should handle snip button clicked', () => {
      component.isDirty = false;
      const componentState = createComponentStateObject(response);
      spyOn(
        TestBed.inject(StudentDataService),
        'getLatestComponentStateByNodeIdAndComponentId'
      ).and.returnValue(componentState);
      const addNoteSpy = spyOn(TestBed.inject(NotebookService), 'addNote');
      component.snipButtonClicked({});
      expect(addNoteSpy).toHaveBeenCalled();
    });
  });
}

function createComponentStateObject(response: string): any {
  return {
    studentData: {
      response: response
    }
  };
}

function createMergedComponentState() {
  describe('createMergedComponentState', () => {
    it('should create merged component state', () => {
      const componentStates = [
        createComponentStateObject('Hello'),
        createComponentStateObject('World')
      ];
      const mergedComponentState = component.createMergedComponentState(componentStates);
      expect(mergedComponentState.studentData.response).toEqual('Hello\nWorld');
    });
  });
}

function hasFeedback() {
  describe('hasFeedback', () => {
    it('should check has feedback when crater is not enabled', () => {
      expectHasFeedbackToBe(false, false);
    });
    it('should check has feedback when crater is enabled and not show feedback or score', () => {
      component.componentContent.cRater = {
        showFeedback: false,
        showScore: false
      };
      expectHasFeedbackToBe(true, false);
    });
    it('should check has feedback when crater is enabled and show feedback', () => {
      component.componentContent.cRater = {
        showFeedback: true,
        showScore: false
      };
      expectHasFeedbackToBe(true, true);
    });
    it('should check has feedback when crater is enabled and show score', () => {
      component.componentContent.cRater = {
        showFeedback: false,
        showScore: true
      };
      expectHasFeedbackToBe(true, true);
    });
  });
}

function expectHasFeedbackToBe(isCRaterEnabled: boolean, value: boolean) {
  spyOn(TestBed.inject(CRaterService), 'isCRaterEnabled').and.returnValue(isCRaterEnabled);
  expect(component.hasFeedback()).toEqual(value);
}

function checkHasFeedbackWhenCRaterIsNotEnabled() {
  it('should check has feedback when crater is not enabled', () => {
    spyOn(TestBed.inject(CRaterService), 'isCRaterEnabled').and.returnValue(false);
    expect(component.hasFeedback()).toEqual(false);
  });
}

function checkHasFeedbackWhenCRaterIsEnabledAndNotShowFeedbackOrScore() {
  it('should check has feedback when crater is enabled and not show feedback or score', () => {
    component.componentContent.cRater = {
      showFeedback: false,
      showScore: false
    };
    spyOn(TestBed.inject(CRaterService), 'isCRaterEnabled').and.returnValue(true);
    expect(component.hasFeedback()).toEqual(false);
  });
}

function checkHasFeedbackWhenCRaterIsEnabledAndShowFeedback() {
  it('should check has feedback when crater is enabled and show feedback', () => {
    component.componentContent.cRater = {
      showFeedback: true,
      showScore: false
    };
    spyOn(TestBed.inject(CRaterService), 'isCRaterEnabled').and.returnValue(true);
    expect(component.hasFeedback()).toEqual(true);
  });
}

function checkHasFeedbackWhenCRaterIsEnabledAndShowScore() {
  it('should check has feedback when crater is enabled and show score', () => {
    component.componentContent.cRater = {
      showFeedback: false,
      showScore: true
    };
    spyOn(TestBed.inject(CRaterService), 'isCRaterEnabled').and.returnValue(true);
    expect(component.hasFeedback()).toEqual(true);
  });
}
