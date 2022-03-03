import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { PossibleScoreComponent } from '../../../../../app/possible-score/possible-score.component';
import { ComponentHeader } from '../../../directives/component-header/component-header.component';
import { ComponentSaveSubmitButtons } from '../../../directives/component-save-submit-buttons/component-save-submit-buttons.component';
import { AnnotationService } from '../../../services/annotationService';
import { AudioRecorderService } from '../../../services/audioRecorderService';
import { ConfigService } from '../../../services/configService';
import { CRaterService } from '../../../services/cRaterService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { NotificationService } from '../../../services/notificationService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { UtilService } from '../../../services/utilService';
import { ComponentService } from '../../componentService';
import { OpenResponseService } from '../openResponseService';
import { OpenResponseStudent } from './open-response-student.component';

class MockNotebookService {
  addNote() {}
}
class MockNodeService {
  createNewComponentState() {
    return {};
  }
}

let component: OpenResponseStudent;
const componentId = 'component1';
let fixture: ComponentFixture<OpenResponseStudent>;
const nodeId = 'node1';
const response = 'Hello World';

describe('OpenResponseStudent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        ReactiveFormsModule,
        UpgradeModule
      ],
      declarations: [
        ComponentHeader,
        ComponentSaveSubmitButtons,
        OpenResponseStudent,
        PossibleScoreComponent
      ],
      providers: [
        AnnotationService,
        AudioRecorderService,
        ComponentService,
        ConfigService,
        CRaterService,
        { provide: NodeService, useClass: MockNodeService },
        { provide: NotebookService, useClass: MockNotebookService },
        NotificationService,
        OpenResponseService,
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        UtilService
      ],
      schemas: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenResponseStudent);
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({
      score: 0,
      comment: ''
    });
    spyOn(TestBed.inject(ProjectService), 'isSpaceExists').and.returnValue(false);
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    component = fixture.componentInstance;
    component.nodeId = nodeId;
    component.componentContent = {
      cRater: {},
      enableCRater: true,
      id: componentId,
      prompt: 'How do plants obtain energy?',
      showSaveButton: true,
      showSubmitButton: true
    };
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
  hasAudioResponses();
  hasFeedback();
  mergeObjects();
  removeAudioAttachment();
  removeAudioAttachments();
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
        spyOn(TestBed.inject(OpenResponseService), 'isCompleted').and.returnValue(true);
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
    it(
      'should perform create component state additional processing',
      waitForAsync(() => {
        spyOn(TestBed.inject(OpenResponseService), 'isCompleted').and.returnValue(true);
        spyOn(component, 'isCRaterScoreOnSubmit').and.returnValue(true);
        spyOn(TestBed.inject(CRaterService), 'makeCRaterScoringRequest').and.returnValue(
          of({ score: 1 })
        );
        component.isSubmit = true;
        component.createComponentState('submit').then((componentState: any) => {
          expect(componentState.componentId).toEqual(componentId);
          expect(componentState.nodeId).toEqual(nodeId);
          expect(componentState.annotations.length).toEqual(1);
          expect(componentState.annotations[0].data.value).toEqual(1);
        });
      })
    );
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

function hasAudioResponses() {
  describe('hasAudioResponses', () => {
    it('should check if there are audio responses when there are none', () => {
      component.attachments = [];
      expect(component.hasAudioResponses()).toEqual(false);
    });
    it('should check if there are audio responses when there are some', () => {
      component.attachments = [{ type: 'audio' }];
      expect(component.hasAudioResponses()).toEqual(true);
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

function removeAudioAttachment() {
  describe('removeAudioAttachment', () => {
    it('should remove audio attachment', () => {
      const audioAttachment = { type: 'audio' };
      component.attachments = [audioAttachment, { type: 'image' }];
      spyOn(window, 'confirm').and.returnValue(true);
      component.removeAudioAttachment(audioAttachment);
      expect(component.attachments.length).toEqual(1);
    });
  });
}

function removeAudioAttachments() {
  describe('removeAudioAttachments', () => {
    it('should remove audio attachments', () => {
      component.attachments = [
        { type: 'image' },
        { type: 'audio' },
        { type: 'image' },
        { type: 'audio' }
      ];
      component.removeAudioAttachments();
      expect(component.attachments.length).toEqual(2);
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

function mergeObjects() {
  describe('mergeObjects', () => {
    it('should merge objects', () => {
      const destination: any = { id: 1, width: 800, height: 600 };
      const source: any = { id: 2, color: 'blue' };
      component.mergeObjects(destination, source);
      expect(destination.id).toEqual(2);
      expect(destination.width).toEqual(800);
      expect(destination.height).toEqual(600);
      expect(destination.color).toEqual('blue');
    });
  });
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
