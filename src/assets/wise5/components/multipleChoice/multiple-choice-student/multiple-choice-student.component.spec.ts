import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { PossibleScoreComponent } from '../../../../../app/possible-score/possible-score.component';
import { ComponentHeader } from '../../../directives/component-header/component-header.component';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { UtilService } from '../../../services/utilService';
import { ComponentService } from '../../componentService';
import { MultipleChoiceService } from '../multipleChoiceService';
import { MultipleChoiceStudent } from './multiple-choice-student.component';

class MockService {}
class MockNodeService {
  createNewComponentState() {
    return {};
  }
}

const choiceId1 = 'choice1';
const choiceId2 = 'choice2';
const choiceId3 = 'choice3';
const choiceText1 = 'A';
const choiceText2 = 'B';
const choiceText3 = 'C<br/><img src="cookie.png"/>';
let component: MultipleChoiceStudent;
const componentId = 'component1';
const feedback1 = 'Good job';
const feedback2 = 'This is not A, this is B';
const feedback3 = 'This is not A, this is C';
let fixture: ComponentFixture<MultipleChoiceStudent>;
const nodeId = 'node1';
let originalComponentContent;
const singleAnswerSingleCorrectAnswerComponent = {
  id: 'z87vj05pjh',
  type: 'MultipleChoice',
  prompt: '',
  showSaveButton: true,
  showSubmitButton: true,
  choiceType: 'radio',
  choices: [
    {
      id: 'y82sng5vqp',
      text: 'A',
      feedback: 'A Feedback',
      isCorrect: false
    },
    {
      id: '37krqrcvxs',
      text: 'B',
      feedback: 'B Feedback',
      isCorrect: false
    },
    {
      id: 'gbttermlrq',
      text: 'C',
      feedback: 'C Feedback',
      isCorrect: true
    }
  ],
  showFeedback: true,
  showAddToNotebookButton: true
};

const singleAnswerMultipleCorrectAnswersComponent = {
  id: 'z87vj05pjh',
  type: 'MultipleChoice',
  prompt: '',
  showSaveButton: true,
  showSubmitButton: true,
  choiceType: 'radio',
  choices: [
    {
      id: 'y82sng5vqp',
      text: 'A',
      feedback: 'A Feedback',
      isCorrect: false
    },
    {
      id: '37krqrcvxs',
      text: 'B',
      feedback: 'B Feedback',
      isCorrect: true
    },
    {
      id: 'gbttermlrq',
      text: 'C',
      feedback: 'C Feedback',
      isCorrect: true
    }
  ],
  showFeedback: true,
  showAddToNotebookButton: true
};

const multipleAnswerComponent = {
  id: 'z87vj05pjh',
  type: 'MultipleChoice',
  prompt: '',
  showSaveButton: true,
  showSubmitButton: true,
  choiceType: 'checkbox',
  choices: [
    {
      id: 'y82sng5vqp',
      text: 'A',
      feedback: 'A Feedback',
      isCorrect: false
    },
    {
      id: '37krqrcvxs',
      text: 'B',
      feedback: 'B Feedback',
      isCorrect: true
    },
    {
      id: 'gbttermlrq',
      text: 'C',
      feedback: 'C Feedback',
      isCorrect: true
    }
  ],
  showFeedback: true,
  showAddToNotebookButton: true
};

describe('MultipleChoiceStudent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatDialogModule,
        MatRadioModule,
        ReactiveFormsModule,
        UpgradeModule
      ],
      declarations: [ComponentHeader, MultipleChoiceStudent, PossibleScoreComponent],
      providers: [
        AnnotationService,
        MultipleChoiceService,
        ComponentService,
        ConfigService,
        { provide: NodeService, useClass: MockNodeService },
        { provide: NotebookService, useClass: MockService },
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
    fixture = TestBed.createComponent(MultipleChoiceStudent);
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({
      score: 0,
      comment: ''
    });
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    component = fixture.componentInstance;
    component.nodeId = nodeId;
    originalComponentContent = {
      id: componentId,
      type: 'MultipleChoice',
      prompt: 'Choose A',
      choices: [
        createComponentContentChoice(choiceId1, choiceText1, feedback1, true),
        createComponentContentChoice(choiceId2, choiceText2, feedback2, false),
        createComponentContentChoice(choiceId3, choiceText3, feedback3, false)
      ]
    };
    component.componentContent = JSON.parse(JSON.stringify(originalComponentContent));
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    spyOn(component, 'studentDataChanged').and.callFake(() => {});
    fixture.detectChanges();
  });

  getChoiceById();
  multipleAnswerComponentShouldShowCorrectWhenOnlyTheCorrectAnswersAreSubmitted();
  multipleAnswerComponentShouldShowIncorrectWhenTheIncorrectAnswerIsSubmitted();
  multipleAnswerComponentShouldShowIncorrectWhenNotJustTheCorrectAnswersAreSubmitted();
  multipleAnswerComponentShouldShowIncorrectWhenNotAllTheCorrectAnswersAreSubmitted();
  multipleAnswerComponentShouldShowTheFeedbackOnTheSubmittedChoices();
  singleAnswerComponentShouldShowTheFeedbackOnTheSubmittedChoice();
  singleAnswerMultipleCorrectAnswersComponentShouldShowCorrect();
  singleAnswerSingleCorrectAnswerComponentShouldShowCorrect();
  singleAnswerSingleCorrectAnswerComponentShouldShowIncorrect();
});

function createComponentContentChoice(
  id: string,
  text: string,
  feedback: string,
  isCorrect: boolean
): any {
  return {
    id: id,
    text: text,
    feedback: feedback,
    isCorrect: isCorrect
  };
}

function getChoiceById() {
  describe('getChoiceById', () => {
    it('should get choice by id', () => {
      component.componentContent = TestBed.inject(ProjectService).injectClickToSnipImage(
        component.componentContent
      );
      expect(component.componentContent.choices[2].text).toContain('onclick');
      expect(component.getChoiceById(originalComponentContent, choiceId1).text).toEqual(
        choiceText1
      );
      expect(component.getChoiceById(originalComponentContent, choiceId2).text).toEqual(
        choiceText2
      );
      expect(component.getChoiceById(originalComponentContent, choiceId3).text).toEqual(
        choiceText3
      );
    });
  });
}

function loadSingleAnswerSingleCorrectAnswerComponent() {
  component.componentContent = JSON.parse(JSON.stringify(singleAnswerSingleCorrectAnswerComponent));
  component.ngOnInit();
}

function loadSingleAnswerMultipleCorrectAnswersComponent() {
  component.componentContent = JSON.parse(
    JSON.stringify(singleAnswerMultipleCorrectAnswersComponent)
  );
  component.ngOnInit();
}

function loadMultipleAnswerComponent() {
  component.componentContent = JSON.parse(JSON.stringify(multipleAnswerComponent));
  component.ngOnInit();
}

function selectSingleAnswerChoice(choiceId) {
  component.radioChoiceSelected(choiceId);
  component.studentChoices = choiceId;
}

function selectMultipleAnswerChoice(choiceId) {
  component.addOrRemoveFromStudentChoices(choiceId);
}

function checkAnswer() {
  component.checkAnswer();
}

function singleAnswerComponentShouldShowTheFeedbackOnTheSubmittedChoice() {
  it('single answer component should show the feedback on the submitted choice', () => {
    loadSingleAnswerSingleCorrectAnswerComponent();
    selectSingleAnswerChoice('y82sng5vqp');
    checkAnswer();
    const choice1 = component.getChoiceById(component, 'y82sng5vqp');
    const choice2 = component.getChoiceById(component, '37krqrcvxs');
    const choice3 = component.getChoiceById(component, 'gbttermlrq');
    expect(choice1.showFeedback).toBeTruthy();
    expect(choice1.feedbackToShow).toEqual('A Feedback');
    expect(choice2.showFeedback).toBeFalsy();
    expect(choice2.feedbackToShow).toBeFalsy();
    expect(choice3.showFeedback).toBeFalsy();
    expect(choice3.feedbackToShow).toBeFalsy();
  });
}

function singleAnswerSingleCorrectAnswerComponentShouldShowIncorrect() {
  it(`single answer single correct answer component should show incorrect when the incorrect answer
      is submitted`, () => {
    loadSingleAnswerSingleCorrectAnswerComponent();
    selectSingleAnswerChoice('y82sng5vqp');
    checkAnswer();
    expect(component.isCorrect).toBeFalsy();
  });
}

function singleAnswerSingleCorrectAnswerComponentShouldShowCorrect() {
  it(`single answer single correct answer component should show correct when the correct answer is
      submitted`, () => {
    loadSingleAnswerSingleCorrectAnswerComponent();
    selectSingleAnswerChoice('gbttermlrq');
    checkAnswer();
    expect(component.isCorrect).toBeTruthy();
  });
}

function singleAnswerMultipleCorrectAnswersComponentShouldShowCorrect() {
  it(`single answer multiple correct answers component should show correct when one of the multiple
      correct answers is submitted`, () => {
    loadSingleAnswerMultipleCorrectAnswersComponent();
    selectSingleAnswerChoice('37krqrcvxs');
    checkAnswer();
    expect(component.isCorrect).toBeTruthy();
    selectSingleAnswerChoice('gbttermlrq');
    checkAnswer();
    expect(component.isCorrect).toBeTruthy();
  });
}

function multipleAnswerComponentShouldShowTheFeedbackOnTheSubmittedChoices() {
  it('multiple answer component should show the feedback on the submitted choices', () => {
    loadMultipleAnswerComponent();
    selectMultipleAnswerChoice('y82sng5vqp');
    selectMultipleAnswerChoice('37krqrcvxs');
    selectMultipleAnswerChoice('gbttermlrq');
    checkAnswer();
    const choice1 = component.getChoiceById(component, 'y82sng5vqp');
    const choice2 = component.getChoiceById(component, '37krqrcvxs');
    const choice3 = component.getChoiceById(component, 'gbttermlrq');
    expect(choice1.showFeedback).toBeTruthy();
    expect(choice1.feedbackToShow).toEqual('A Feedback');
    expect(choice2.showFeedback).toBeTruthy();
    expect(choice2.feedbackToShow).toEqual('B Feedback');
    expect(choice3.showFeedback).toBeTruthy();
    expect(choice3.feedbackToShow).toEqual('C Feedback');
  });
}

function multipleAnswerComponentShouldShowIncorrectWhenTheIncorrectAnswerIsSubmitted() {
  it(`multiple answer component should show incorrect when the incorrect answer is
      submitted`, () => {
    loadMultipleAnswerComponent();
    selectMultipleAnswerChoice('y82sng5vqp');
    checkAnswer();
    expect(component.isCorrect).toBeFalsy();
  });
}

function multipleAnswerComponentShouldShowIncorrectWhenNotJustTheCorrectAnswersAreSubmitted() {
  it(`multiple answer component should show incorrect when not just the correct answers are
      submitted`, () => {
    loadMultipleAnswerComponent();
    selectMultipleAnswerChoice('y82sng5vqp');
    selectMultipleAnswerChoice('37krqrcvxs');
    selectMultipleAnswerChoice('gbttermlrq');
    checkAnswer();
    expect(component.isCorrect).toBeFalsy();
  });
}

function multipleAnswerComponentShouldShowIncorrectWhenNotAllTheCorrectAnswersAreSubmitted() {
  it(`multiple answer component should show incorrect when not all the correct answers are 
      submitted`, () => {
    loadMultipleAnswerComponent();
    selectMultipleAnswerChoice('37krqrcvxs');
    checkAnswer();
    expect(component.isCorrect).toBeFalsy();
  });
}

function multipleAnswerComponentShouldShowCorrectWhenOnlyTheCorrectAnswersAreSubmitted() {
  it(`multiple answer component should show correct when only the correct answers are
      submitted`, () => {
    loadMultipleAnswerComponent();
    selectMultipleAnswerChoice('37krqrcvxs');
    selectMultipleAnswerChoice('gbttermlrq');
    checkAnswer();
    expect(component.isCorrect).toBeTruthy();
  });
}
