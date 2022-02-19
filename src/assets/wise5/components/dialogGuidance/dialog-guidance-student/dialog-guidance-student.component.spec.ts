import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { PossibleScoreComponent } from '../../../../../app/possible-score/possible-score.component';
import { ComputerAvatar } from '../../../common/ComputerAvatar';
import { ComponentHeader } from '../../../directives/component-header/component-header.component';
import { AnnotationService } from '../../../services/annotationService';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { ConfigService } from '../../../services/configService';
import { CRaterService } from '../../../services/cRaterService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { UtilService } from '../../../services/utilService';
import { MockNodeService } from '../../animation/animation-authoring/animation-authoring.component.spec';
import { MockService } from '../../animation/animation-student/animation-student.component.spec';
import { ComponentService } from '../../componentService';
import { ComputerDialogResponseMultipleScores } from '../ComputerDialogResponseMultipleScores';
import { ComputerDialogResponseSingleScore } from '../ComputerDialogResponseSingleScore';
import { CRaterResponse } from '../CRaterResponse';
import { CRaterScore } from '../CRaterScore';
import { DialogResponsesComponent } from '../dialog-responses/dialog-responses.component';
import { DialogGuidanceService } from '../dialogGuidanceService';
import { DialogGuidanceStudentComponent } from './dialog-guidance-student.component';

let component: DialogGuidanceStudentComponent;
let fixture: ComponentFixture<DialogGuidanceStudentComponent>;
const robotAvatar = new ComputerAvatar('robot', 'Robot', 'robot.png');

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
        FormsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        UpgradeModule
      ],
      providers: [
        AnnotationService,
        ComponentService,
        ComputerAvatarService,
        CRaterService,
        ConfigService,
        DialogGuidanceService,
        { provide: NodeService, useClass: MockNodeService },
        { provide: NotebookService, useClass: MockService },
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        UtilService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGuidanceStudentComponent);
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({
      score: 0,
      comment: ''
    });
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    component = fixture.componentInstance;
    component.componentContent = TestBed.inject(DialogGuidanceService).createComponent();
    component.componentContent.feedbackRules = [
      {
        expression: 'isDefault',
        feedback: 'Default Feedback'
      }
    ];
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    fixture.detectChanges();
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
    const scores = [new CRaterScore('ki', 5, 5.0), new CRaterScore('science', 4, 4.1)];
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
    const response = new CRaterResponse();
    component.cRaterSuccessResponse(response);
    expect(broadcastComponentSubmitTriggeredSpy).toHaveBeenCalled();
    expect(component.submitCounter).toEqual(1);
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

  it('should initialize computer avatar', () => {
    const prompt = 'Choose a thought buddy.';
    const label = 'Thought Buddy';
    const computerAvatarIds = {
      girl: true,
      robot: true
    };
    component.componentContent.computerAvatarPrompt = prompt;
    component.componentContent.computerAvatarLabel = label;
    component.componentContent.computerAvatarIds = computerAvatarIds;
    component.initializeComputerAvatar();
    expect(component.computerAvatarPrompt).toEqual(prompt);
    expect(component.computerAvatarLabel).toEqual(label);
    expect(component.computerAvatarIds).toEqual(computerAvatarIds);
  });

  it(`should initialize computer avatar when the student has not previously chosen a computer
      avatar`, () => {
    component.componentState = { studentData: {} };
    component.initializeComputerAvatar();
    expect(component.isShowComputerAvatarSelector).toEqual(true);
  });

  it(`should initialize computer avatar when the student has previously chosen a computer
      avatar`, () => {
    component.componentState = {
      studentData: {
        computerAvatarId: 'robot'
      }
    };
    component.initializeComputerAvatar();
    expect(component.isShowComputerAvatarSelector).toEqual(false);
  });

  it('should select computer avatar', () => {
    component.selectComputerAvatar(robotAvatar);
    expect(component.computerAvatar).toEqual(robotAvatar);
    expect(component.isShowComputerAvatarSelector).toEqual(false);
  });

  it('should select computer avatar when there is a computer avatar initial response', () => {
    const text = 'Hi there, who lives in a pineapple under sea?';
    component.componentContent.computerAvatarInitialResponse = text;
    expect(component.responses.length).toEqual(0);
    component.selectComputerAvatar(robotAvatar);
    expect(component.responses.length).toEqual(1);
    expect(component.responses[0].text).toEqual(text);
  });
});

function simulateSubmit(component: DialogGuidanceStudentComponent): void {
  const response = new CRaterResponse();
  component.setIsSubmitDirty(true);
  component.cRaterSuccessResponse(response);
}
