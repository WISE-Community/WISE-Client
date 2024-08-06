import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { copy } from '../../../common/object/object';
import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';
import { ProjectService } from '../../../services/projectService';
import { MultipleChoiceComponent } from '../MultipleChoiceComponent';
import { MultipleChoiceStudent } from './multiple-choice-student.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

const choiceId1 = 'choice1';
const choiceId2 = 'choice2';
const choiceId3 = 'choice3';
const choiceText1 = 'A';
const choiceText2 = 'B';
const choiceText3 = 'C<br/><img src="cookie.png"/>';
let component: MultipleChoiceStudent;
const componentId = 'component1';
const feedback1 = 'A Feedback';
const feedback2 = 'B Feedback';
const feedback3 = 'C Feedback';
let fixture: ComponentFixture<MultipleChoiceStudent>;
const multipleChoiceType = 'MultipleChoice';
const nodeId = 'node1';
let originalComponentContent: any;
const singleAnswerSingleCorrectAnswerComponent = createComponent('radio', [
  {
    id: choiceId1,
    text: choiceText1,
    feedback: feedback1,
    isCorrect: false
  },
  {
    id: choiceId2,
    text: choiceText2,
    feedback: feedback2,
    isCorrect: false
  },
  {
    id: choiceId3,
    text: choiceText3,
    feedback: feedback3,
    isCorrect: true
  }
]);

const singleAnswerMultipleCorrectAnswersComponent = createComponent('radio', [
  {
    id: choiceId1,
    text: choiceText1,
    feedback: feedback1,
    isCorrect: false
  },
  {
    id: choiceId2,
    text: choiceText2,
    feedback: feedback2,
    isCorrect: true
  },
  {
    id: choiceId3,
    text: choiceText3,
    feedback: feedback3,
    isCorrect: true
  }
]);

const multipleAnswerComponent = createComponent('checkbox', [
  {
    id: choiceId1,
    text: choiceText1,
    feedback: feedback1,
    isCorrect: false
  },
  {
    id: choiceId2,
    text: choiceText2,
    feedback: feedback2,
    isCorrect: true
  },
  {
    id: choiceId3,
    text: choiceText3,
    feedback: feedback3,
    isCorrect: true
  }
]);

function createComponent(choiceType: string, choices: any[]): any {
  return {
    id: componentId,
    type: multipleChoiceType,
    prompt: '',
    showSaveButton: true,
    showSubmitButton: true,
    choiceType: choiceType,
    choices: choices,
    showFeedback: true
  };
}

describe('MultipleChoiceStudentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [MultipleChoiceStudent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [BrowserAnimationsModule,
        BrowserModule,
        ComponentHeaderComponent,
        MatCheckboxModule,
        MatDialogModule,
        MatRadioModule,
        ReactiveFormsModule,
        StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(MultipleChoiceStudent);
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    component = fixture.componentInstance;
    originalComponentContent = {
      id: componentId,
      type: multipleChoiceType,
      prompt: 'Choose A',
      choices: [
        createComponentContentChoice(choiceId1, choiceText1, feedback1, true),
        createComponentContentChoice(choiceId2, choiceText2, feedback2, false),
        createComponentContentChoice(choiceId3, choiceText3, feedback3, false)
      ],
      showFeedback: true
    };
    const componentContent = copy(originalComponentContent);
    component.component = new MultipleChoiceComponent(componentContent, nodeId);
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    spyOn(component, 'studentDataChanged').and.callFake(() => {});
    fixture.detectChanges();
  });

  testMultipleAnswerComponent();
  testSingleAnswerSingleCorrectAnswerComponent();
  testSingleAnswerMultipleCorrectAnswersComponent();
  ngOnInit();
  createComponentState();
});

function createComponentContentChoice(
  id: string,
  text: string,
  feedback: string = '',
  isCorrect: boolean = false
): any {
  return {
    id: id,
    text: text,
    feedback: feedback,
    isCorrect: isCorrect
  };
}

function testMultipleAnswerComponent() {
  describe('multiple answer component', () => {
    beforeEach(() => {
      component.componentContent = copy(multipleAnswerComponent);
      component.component = new MultipleChoiceComponent(component.componentContent, nodeId);
      component.ngOnInit();
    });
    multipleAnswerComponentShouldShowCorrectWhenOnlyTheCorrectAnswersAreSubmitted();
    multipleAnswerComponentShouldShowIncorrectWhenTheIncorrectAnswerIsSubmitted();
    multipleAnswerComponentShouldShowIncorrectWhenNotJustTheCorrectAnswersAreSubmitted();
    multipleAnswerComponentShouldShowIncorrectWhenNotAllTheCorrectAnswersAreSubmitted();
    multipleAnswerComponentShouldShowTheFeedbackOnTheSubmittedChoices();
  });
}

function testSingleAnswerSingleCorrectAnswerComponent() {
  describe('single answer single correct answer component', () => {
    beforeEach(() => {
      component.componentContent = JSON.parse(
        JSON.stringify(singleAnswerSingleCorrectAnswerComponent)
      );
      component.component = new MultipleChoiceComponent(component.componentContent, nodeId);
      component.ngOnInit();
    });
    singleAnswerSingleCorrectAnswerComponentShouldShowTheFeedbackOnTheSubmittedChoice();
    singleAnswerSingleCorrectAnswerComponentShouldShowCorrect();
    singleAnswerSingleCorrectAnswerComponentShouldShowIncorrect();
  });
}

function testSingleAnswerMultipleCorrectAnswersComponent() {
  describe('single answer multiple correct answers component', () => {
    beforeEach(() => {
      component.componentContent = JSON.parse(
        JSON.stringify(singleAnswerMultipleCorrectAnswersComponent)
      );
      component.component = new MultipleChoiceComponent(component.componentContent, nodeId);

      component.ngOnInit();
    });
    singleAnswerMultipleCorrectAnswersComponentShouldShowCorrect();
  });
}

function selectSingleAnswerChoice(choiceId) {
  component.studentChoices = choiceId;
}

function selectMultipleAnswerChoice(choiceId) {
  component.addOrRemoveFromStudentChoices(choiceId);
}

function checkAnswer() {
  component.checkAnswer();
}

function singleAnswerSingleCorrectAnswerComponentShouldShowTheFeedbackOnTheSubmittedChoice() {
  it('should show the feedback on the submitted choice', () => {
    selectSingleAnswerChoice(choiceId1);
    checkAnswer();
    const choice1 = getChoiceById(choiceId1);
    const choice2 = getChoiceById(choiceId2);
    const choice3 = getChoiceById(choiceId3);
    expect(choice1.showFeedback).toBeTruthy();
    expect(choice1.feedbackToShow).toEqual(feedback1);
    expect(choice2.showFeedback).toBeFalsy();
    expect(choice2.feedbackToShow).toBeFalsy();
    expect(choice3.showFeedback).toBeFalsy();
    expect(choice3.feedbackToShow).toBeFalsy();
  });
}

function getChoiceById(id: string): any {
  return component.choices.find((choice) => choice.id == id);
}

function singleAnswerSingleCorrectAnswerComponentShouldShowIncorrect() {
  it(`should show incorrect when the incorrect answer is submitted`, () => {
    selectSingleAnswerChoice(choiceId1);
    checkAnswer();
    expect(component.isCorrect).toBeFalsy();
  });
}

function singleAnswerSingleCorrectAnswerComponentShouldShowCorrect() {
  it(`should show correct when the correct answer is submitted`, () => {
    selectSingleAnswerChoice(choiceId3);
    checkAnswer();
    expect(component.isCorrect).toBeTruthy();
  });
}

function singleAnswerMultipleCorrectAnswersComponentShouldShowCorrect() {
  it(`should show correct when one of the multiple correct answers is submitted`, () => {
    selectSingleAnswerChoice(choiceId2);
    checkAnswer();
    expect(component.isCorrect).toBeTruthy();
    selectSingleAnswerChoice(choiceId3);
    checkAnswer();
    expect(component.isCorrect).toBeTruthy();
  });
}

function multipleAnswerComponentShouldShowTheFeedbackOnTheSubmittedChoices() {
  it('should show the feedback on the submitted choices', () => {
    selectMultipleAnswerChoice(choiceId1);
    selectMultipleAnswerChoice(choiceId2);
    selectMultipleAnswerChoice(choiceId3);
    checkAnswer();
    const choice1 = getChoiceById(choiceId1);
    const choice2 = getChoiceById(choiceId2);
    const choice3 = getChoiceById(choiceId3);
    expect(choice1.showFeedback).toBeTruthy();
    expect(choice1.feedbackToShow).toEqual(feedback1);
    expect(choice2.showFeedback).toBeTruthy();
    expect(choice2.feedbackToShow).toEqual(feedback2);
    expect(choice3.showFeedback).toBeTruthy();
    expect(choice3.feedbackToShow).toEqual(feedback3);
  });
}

function multipleAnswerComponentShouldShowIncorrectWhenTheIncorrectAnswerIsSubmitted() {
  it(`should show incorrect when the incorrect answer is submitted`, () => {
    selectMultipleAnswerChoice(choiceId1);
    checkAnswer();
    expect(component.isCorrect).toBeFalsy();
  });
}

function multipleAnswerComponentShouldShowIncorrectWhenNotJustTheCorrectAnswersAreSubmitted() {
  it(`should show incorrect when not just the correct answers are submitted`, () => {
    selectMultipleAnswerChoice(choiceId1);
    selectMultipleAnswerChoice(choiceId2);
    selectMultipleAnswerChoice(choiceId3);
    checkAnswer();
    expect(component.isCorrect).toBeFalsy();
  });
}

function multipleAnswerComponentShouldShowIncorrectWhenNotAllTheCorrectAnswersAreSubmitted() {
  it(`should show incorrect when not all the correct answers are submitted`, () => {
    selectMultipleAnswerChoice(choiceId2);
    checkAnswer();
    expect(component.isCorrect).toBeFalsy();
  });
}

function multipleAnswerComponentShouldShowCorrectWhenOnlyTheCorrectAnswersAreSubmitted() {
  it(`should show correct when only the correct answers are submitted`, () => {
    selectMultipleAnswerChoice(choiceId2);
    selectMultipleAnswerChoice(choiceId3);
    checkAnswer();
    expect(component.isCorrect).toBeTruthy();
  });
}

function ngOnInit() {
  describe('ngOnInit()', () => {
    it('should set student work and repopulate feedback that was previously shown', () => {
      component.choices.forEach((choice) => {
        expect(choice.feedbackToShow).toBeUndefined();
      });
      component.componentState = {
        isSubmit: true,
        studentData: {
          studentChoices: [
            createComponentContentChoice(choiceId1, choiceText1),
            createComponentContentChoice(choiceId2, choiceText2)
          ]
        }
      };
      component.ngOnInit();
      expectChoiceToShowFeedback(component.choices[0], feedback1);
      expectChoiceToShowFeedback(component.choices[1], feedback2);
      expectChoiceToNotShowFeedback(component.choices[2]);
    });
  });
}

function expectChoiceToShowFeedback(choice: any, expectedFeedback: string): void {
  expect(choice.feedbackToShow).toEqual(expectedFeedback);
  expect(choice.showFeedback).toEqual(true);
}

function expectChoiceToNotShowFeedback(choice: any): void {
  expect(choice.feedbackToShow).toBeUndefined();
  expect(choice.showFeedback).toBeFalsy();
}

function createComponentState(): void {
  describe('createComponentState()', () => {
    describe('radio', () => {
      it('creates studentData with empty studentChoices', () => {
        component.componentContent.choiceType = 'radio';
        expectStudentChoicesToBeEmptyArray();
      });
    });
    describe('checkbox', () => {
      it('creates studentData with empty studentChoices', () => {
        component.componentContent.choiceType = 'checkbox';
        expectStudentChoicesToBeEmptyArray();
      });
    });
  });
}

function expectStudentChoicesToBeEmptyArray(): void {
  component.createComponentState('submit').then((componentState) => {
    expect(componentState.studentData.studentChoices).toEqual([]);
  });
}
