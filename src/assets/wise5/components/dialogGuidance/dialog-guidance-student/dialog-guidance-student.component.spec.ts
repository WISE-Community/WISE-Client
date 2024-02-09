import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PossibleScoreComponent } from '../../../../../app/possible-score/possible-score.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { ComponentHeader } from '../../../directives/component-header/component-header.component';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { DialogGuidanceFeedbackService } from '../../../services/dialogGuidanceFeedbackService';
import { ProjectService } from '../../../services/projectService';
import { StudentDataService } from '../../../services/studentDataService';
import { StudentStatusService } from '../../../services/studentStatusService';
import { ComputerDialogResponseMultipleScores } from '../ComputerDialogResponseMultipleScores';
import { ComputerDialogResponseSingleScore } from '../ComputerDialogResponseSingleScore';
import { CRaterResponse } from '../../common/cRater/CRaterResponse';
import { CRaterScore } from '../../common/cRater/CRaterScore';
import { DialogResponsesComponent } from '../dialog-responses/dialog-responses.component';
import { DialogGuidanceService } from '../dialogGuidanceService';
import { DialogGuidanceStudentComponent } from './dialog-guidance-student.component';
import { DialogGuidanceComponent } from '../DialogGuidanceComponent';
import { RawCRaterResponse } from '../../common/cRater/RawCRaterResponse';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChatInputComponent } from '../../../common/chat-input/chat-input.component';

let component: DialogGuidanceStudentComponent;
let fixture: ComponentFixture<DialogGuidanceStudentComponent>;
const robotAvatar = new ComputerAvatar('robot', 'Robot', 'robot.png');

function initializeComponent(isComputerAvatarEnabled: boolean): void {
  fixture = TestBed.createComponent(DialogGuidanceStudentComponent);
  component = fixture.componentInstance;
  component.component = createDialogGuidanceComponent(isComputerAvatarEnabled);
  spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
  spyOn(component, 'isNotebookEnabled').and.returnValue(false);
  fixture.detectChanges();
}

function createDialogGuidanceComponent(isComputerAvatarEnabled: boolean): DialogGuidanceComponent {
  const componentContent = TestBed.inject(DialogGuidanceService).createComponent();
  componentContent.isComputerAvatarEnabled = isComputerAvatarEnabled;
  return new DialogGuidanceComponent(componentContent, null);
}

describe('DialogGuidanceStudentComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ComponentHeader,
        DialogGuidanceStudentComponent,
        DialogResponsesComponent,
        PossibleScoreComponent
      ],
      imports: [
        BrowserAnimationsModule,
        ChatInputComponent,
        FormsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [DialogGuidanceFeedbackService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    initializeComponent(true);
  });

  it('should create computer dialog response with single score', () => {
    const response = new CRaterResponse();
    const score = 5;
    response.score = score;
    const computerDialogResponse = component.createComputerDialogResponse(response);
    expect((computerDialogResponse as ComputerDialogResponseSingleScore).score).toEqual(score);
  });

  it('should create computer dialog response with multiple scores', () => {
    const response = new CRaterResponse();
    const scores = [new CRaterScore('ki', 5, 5.0, 1, 5), new CRaterScore('science', 4, 4.1, 1, 5)];
    response.scores = scores;
    const computerDialogResponse = component.createComputerDialogResponse(response);
    expect((computerDialogResponse as ComputerDialogResponseMultipleScores).scores).toEqual(scores);
  });

  it('should handle crater success response', () => {
    const broadcastComponentSubmitTriggeredSpy = spyOn(
      TestBed.inject(StudentDataService),
      'broadcastComponentSubmitTriggered'
    );
    component.setIsSubmitDirty(true);
    const response = createDummyScoringResponse();
    expect(component.responses.length).toEqual(0);
    component.cRaterSuccessResponse(response);
    expect(broadcastComponentSubmitTriggeredSpy).toHaveBeenCalled();
    expect(component.responses.length).toEqual(1);
  });

  it('should disable submit button after using all submits', () => {
    component.componentContent.maxSubmitCount = 2;
    expect(component.studentCanRespond).toEqual(true);
    simulateSubmit(component);
    expect(component.studentCanRespond).toEqual(true);
    simulateSubmit(component);
    expect(component.studentCanRespond).toEqual(false);
  });

  it('should handle crater error response', () => {
    const broadcastComponentSaveTriggeredSpy = spyOn(
      TestBed.inject(StudentDataService),
      'broadcastComponentSaveTriggered'
    );
    component.cRaterErrorResponse();
    expect(broadcastComponentSaveTriggeredSpy).toHaveBeenCalled();
    expect(component.submitCounter).toEqual(0);
  });

  it('should initialize computer avatar to default computer avatar', () => {
    initializeComponent(false);
    expectComputerAvatarSelectorNotToBeShown(component);
    expect(component.computerAvatar).not.toBeNull();
  });

  it(`should initialize computer avatar when the student has not previously chosen a computer
      avatar and there are multiple computer avatars to choose`, () => {
    clearComputerAvatar(component);
    initializeComponentStateWithNoComputerAvatarId(component);
    component.componentContent.computerAvatarSettings = {
      ids: ['monkey', 'robot']
    };
    component.initializeComputerAvatar();
    expectComputerAvatarSelectorToBeShown(component);
  });

  it(`should initialize computer avatar when the student has not previously chosen a computer
      avatar and there is one computer avatar and no computer avatar prompt`, () => {
    clearComputerAvatar(component);
    initializeComponentStateWithNoComputerAvatarId(component);
    component.componentContent.computerAvatarSettings = {
      ids: ['monkey']
    };
    component.initializeComputerAvatar();
    expectComputerAvatarSelectorNotToBeShown(component);
  });

  it(`should initialize computer avatar when the student has not previously chosen a computer
      avatar and there is one computer avatar and there is a computer avatar prompt`, () => {
    clearComputerAvatar(component);
    initializeComponentStateWithNoComputerAvatarId(component);
    component.componentContent.computerAvatarSettings = {
      ids: ['monkey'],
      prompt: 'This is your thought buddy you will be chatting with.'
    };
    component.initializeComputerAvatar();
    expectComputerAvatarSelectorToBeShown(component);
  });

  it(`should initialize computer avatar when the student has previously chosen a computer
      avatar`, () => {
    clearComputerAvatar(component);
    component.componentContent.computerAvatarSettings = {
      ids: ['monkey']
    };
    component.componentState = {
      studentData: {
        computerAvatarId: 'robot'
      }
    };
    component.initializeComputerAvatar();
    expectComputerAvatarSelectorNotToBeShown(component);
  });

  it('should select computer avatar', () => {
    component.selectComputerAvatar(robotAvatar);
    expect(component.computerAvatar).toEqual(robotAvatar);
    expectComputerAvatarSelectorNotToBeShown(component);
  });

  it('should set computer avatar to global computer avatar', () => {
    clearComputerAvatar(component);
    component.componentContent.computerAvatarSettings.useGlobalComputerAvatar = true;
    spyOn(TestBed.inject(StudentStatusService), 'getComputerAvatarId').and.returnValue('robot1');
    spyOn(TestBed.inject(StudentStatusService), 'setComputerAvatarId').and.callFake(() => {});
    const computerAvatarService = TestBed.inject(ComputerAvatarService);
    const defaultComputerAvatar = computerAvatarService.getDefaultAvatar();
    spyOn(computerAvatarService, 'getAvatar').and.returnValue(defaultComputerAvatar);
    component.initializeComputerAvatar();
    expect(component.computerAvatar).toEqual(defaultComputerAvatar);
  });

  it('should select computer avatar when there is a computer avatar initial response', () => {
    const text = 'Hi there, who lives in a pineapple under sea?';
    component.componentContent.computerAvatarSettings.initialResponse = text;
    expect(component.responses.length).toEqual(0);
    component.selectComputerAvatar(robotAvatar);
    expect(component.responses.length).toEqual(1);
    expect(component.responses[0].text).toEqual(text);
  });
});

function simulateSubmit(component: DialogGuidanceStudentComponent): void {
  const response = createDummyScoringResponse();
  component.setIsSubmitDirty(true);
  component.cRaterSuccessResponse(response);
}

function clearComputerAvatar(component: any): void {
  component.computerAvatar = null;
}

function initializeComponentStateWithNoComputerAvatarId(component: any) {
  component.componentState = { studentData: {} };
}

function expectComputerAvatarSelectorToBeShown(component: any) {
  expectComputerAvatarSelectorVisible(component, true);
}

function expectComputerAvatarSelectorNotToBeShown(component: any) {
  expectComputerAvatarSelectorVisible(component, false);
}

function expectComputerAvatarSelectorVisible(
  component: any,
  expectedIsShowComputerAvatarSelector: boolean
) {
  expect(component.computerAvatarSelectorVisible).toEqual(expectedIsShowComputerAvatarSelector);
}

function createDummyScoringResponse(): RawCRaterResponse {
  return {
    feedback: {
      ideas: [{ 2: false }, { 3: false }]
    },
    trait_scores: {
      ki: { score: 1 }
    }
  } as RawCRaterResponse;
}
