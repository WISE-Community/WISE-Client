import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { Component } from '../../../common/Component';
import { ClickToSnipImageService } from '../../../services/clickToSnipImageService';
import { ProjectService } from '../../../services/projectService';
import { MatchStudent } from './match-student.component';

let component: MatchStudent;
let fixture: ComponentFixture<MatchStudent>;
let bucket1: any;
let bucket2: any;
let bucket3: any;
let bucketId1 = 'bucket1';
let bucketId2 = 'bucket2';
let bucketId3 = 'bucket3';
let bucketValue1 = 'Bucket A';
let bucketValue2 = 'Bucket B';
let bucketValue3 = 'Bucket C';
let choice1: any;
let choice2: any;
let choice3: any;
let choiceId1 = 'choice1';
let choiceId2 = 'choice2';
let choiceId3 = 'choice3';
let choiceValue1 = 'Choice A';
let choiceValue2 = 'Choice B';
let choiceValue3 = 'Choice C';
let componentId = 'component1';
let componentState: any;
let componentStateChoice1: any;
let componentStateChoice2: any;
let componentStateChoice3: any;
let componentStateBucket0: any;
let componentStateBucket1: any;
let componentStateBucket2: any;
let componentStateBucket3: any;
let componentStateBuckets: any[];
let nodeId = 'node1';
let notebookItem: any;
let notebookItemId: string;
let notebookItemImageName: string;
let notebookItemText: string;
let starterBucketLabel = 'Starter Choices';

describe('MatchStudentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      declarations: [MatchStudent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(MatchStudent);
    component = fixture.componentInstance;
    choice1 = createChoice(choiceId1, choiceValue1);
    choice2 = createChoice(choiceId2, choiceValue2);
    choice3 = createChoice(choiceId3, choiceValue3);
    const componentContentBucket1 = createBucket(bucketId1, bucketValue1, []);
    const componentContentBucket2 = createBucket(bucketId2, bucketValue2, []);
    const componentContentBucket3 = createBucket(bucketId3, bucketValue3, []);
    const componentContent = {
      id: componentId,
      type: 'Match',
      prompt: 'Put the choices in the buckets.',
      choices: [choice1, choice2, choice3],
      buckets: [componentContentBucket1, componentContentBucket2, componentContentBucket3],
      choicesLabel: starterBucketLabel,
      feedback: [
        createFeedbackForBucket('0', [
          createFeedback(choiceId1),
          createFeedback(choiceId2),
          createFeedback(choiceId3)
        ]),
        createFeedbackForBucket(bucketId1, [
          createFeedback(choiceId1),
          createFeedback(choiceId2),
          createFeedback(choiceId3)
        ]),
        createFeedbackForBucket(bucketId2, [
          createFeedback(choiceId1),
          createFeedback(choiceId2),
          createFeedback(choiceId3)
        ]),
        createFeedbackForBucket(bucketId3, [
          createFeedback(choiceId1),
          createFeedback(choiceId2),
          createFeedback(choiceId3)
        ])
      ]
    };
    component.component = new Component(componentContent, nodeId);
    spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue(
      JSON.parse(JSON.stringify(componentContent))
    );
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    spyOn(component, 'studentDataChanged').and.callFake(() => {});
    spyOn(component, 'registerAutoScroll').and.callFake(() => {});
    componentStateChoice1 = createChoice(choiceId1, choiceValue1);
    componentStateChoice2 = createChoice(choiceId2, choiceValue2);
    componentStateChoice3 = createChoice(choiceId3, choiceValue3);
    componentStateBucket0 = createBucket('0', 'Starter Bucket', []);
    componentStateBucket1 = createBucket(bucketId1, bucketValue1, []);
    componentStateBucket2 = createBucket(bucketId2, bucketValue2, []);
    componentStateBucket3 = createBucket(bucketId3, bucketValue3, []);
    componentStateBuckets = [
      componentStateBucket0,
      componentStateBucket1,
      componentStateBucket2,
      componentStateBucket3
    ];
    notebookItemId = 'note1';
    notebookItemText = 'My Note';
    notebookItemImageName = 'my-image.png';
    notebookItem = createNotebookItem(notebookItemId, notebookItemText, notebookItemImageName);
    fixture.detectChanges();
    bucket1 = component.buckets[1];
    bucket2 = component.buckets[2];
    bucket3 = component.buckets[3];
  });

  createSourceBucket();
  addNotebookItemToSourceBucket();
  createChoiceFromNotebookItem();
  getSourceBucket();
  clearSourceBucketChoices();
  addChoiceToBucket();
  getBucketIds();
  getChoiceIds();
  getChoicesThatChangedSinceLastSubmit();
  setStudentWork();
  getCorrectness();
  checkAnswer();
  checkAnswerAndDisplayFeedback();
  initializeBuckets();
  initializeChoices();
  createComponentStateObject();
  clearFeedback();
  isAuthorHasSpecifiedACorrectBucket();
  isAuthorHasSpecifiedACorrectPosition();
  getFeedbackObject();
  mergeBucket();
  mergeChoices();
  getValueById();
  getCleanedValue();
});

function createBucket(id: string, value: string, choices: any[]): any {
  return {
    id: id,
    type: 'bucket',
    value: value,
    items: choices
  };
}

function manuallyAddChoiceToBucket(choice: any, bucket: any): void {
  bucket.items.push(choice);
}

function createChoice(id: string, value: string): any {
  return {
    id: id,
    type: 'choice',
    value: value
  };
}

function createFeedbackForBucket(bucketId: string, choices: any[]): any {
  return {
    bucketId: bucketId,
    choices: choices
  };
}

function createFeedback(
  choiceId: string,
  feedback: string = '',
  isCorrect: boolean = false,
  position: number = null,
  incorrectPositionFeedback: string = null
): any {
  return {
    choiceId: choiceId,
    feedback: feedback,
    isCorrect: isCorrect,
    position: position,
    incorrectPositionFeedback: incorrectPositionFeedback
  };
}

function createComponentState(buckets: any, isSubmit: boolean): any {
  return {
    studentData: {
      buckets: buckets
    },
    isSubmit: isSubmit
  };
}

function createNotebookItem(localNotebookItemId: string, text: string, imageName: string): any {
  return {
    localNotebookItemId: localNotebookItemId,
    content: {
      text: text,
      attachments: [{ iconURL: imageName }]
    }
  };
}

function createSourceBucket() {
  describe('createSourceBucket', () => {
    it('should create source bucket', () => {
      const bucket = component.createSourceBucket();
      expect(bucket.id).toEqual('0');
      expect(bucket.type).toEqual('bucket');
      expect(bucket.value).toEqual(starterBucketLabel);
      expect(bucket.items).toEqual([]);
    });
  });
}

function addNotebookItemToSourceBucket() {
  describe('addNotebookItemToSourceBucket', () => {
    it('should add notebook item to source bucket', () => {
      expect(component.choices.length).toEqual(3);
      expect(component.buckets[0].items.length).toEqual(3);
      component.addNotebookItemToSourceBucket(notebookItem);
      expect(component.choices.length).toEqual(4);
      expect(component.buckets[0].items.length).toEqual(4);
      const sourceBucketItems = component.buckets[0].items;
      expect(sourceBucketItems[sourceBucketItems.length - 1].id).toEqual(notebookItemId);
    });
  });
}

function createChoiceFromNotebookItem() {
  describe('createChoiceFromNotebookItem', () => {
    it('should create choice from notebook item', () => {
      const choice = component.createChoiceFromNotebookItem(notebookItem);
      expect(choice.id).toEqual(notebookItemId);
      expect(choice.type).toEqual('choice');
      expect(choice.value).toEqual(
        `${notebookItemText}<div><img src="${notebookItemImageName}" alt="image from note"/></div>`
      );
    });
  });
}

function getSourceBucket() {
  describe('getSourceBucket', () => {
    it('should get the source bucket', () => {
      const sourceBucket = component.getSourceBucket();
      expect(sourceBucket.id).toEqual('0');
      expect(sourceBucket.value).toEqual(component.getSourceBucketLabel());
    });
  });
}

function clearSourceBucketChoices() {
  describe('clearSourceBucketChoices', () => {
    it('should clear source bucket choices', () => {
      const sourceBucket = component.getSourceBucket();
      expect(sourceBucket.items.length).toEqual(3);
      component.clearSourceBucketChoices();
      expect(sourceBucket.items.length).toEqual(0);
    });
  });
}

function addChoiceToBucket() {
  describe('addChoiceToBucket', () => {
    it('should add choice to bucket', () => {
      component.clearSourceBucketChoices();
      component.addChoiceToBucket(componentStateChoice1, bucket1);
      expect(bucket1.items.length).toEqual(1);
      expect(bucket1.items[0]).toEqual(choice1);
    });

    it('should add choice to bucket when the authored choice text has changed', () => {
      component.clearSourceBucketChoices();
      const newChoice1Value = `New ${choice1.value}`;
      choice1.value = newChoice1Value;
      component.addChoiceToBucket(componentStateChoice1, bucket1);
      expect(bucket1.items.length).toEqual(1);
      expect(bucket1.items[0].value).toEqual(newChoice1Value);
    });
  });
}

function getBucketIds() {
  describe('getBucketIds', () => {
    it('should get bucket ids', () => {
      const bucketIds = component.getBucketIds();
      expect(bucketIds.length).toEqual(4);
      expect(bucketIds[0]).toEqual('0');
      expect(bucketIds[1]).toEqual(bucket1.id);
      expect(bucketIds[2]).toEqual(bucket2.id);
      expect(bucketIds[3]).toEqual(bucket3.id);
    });
  });
}

function getChoiceIds() {
  describe('getChoiceIds', () => {
    it('should get choice ids', () => {
      const choiceIds = component.getChoiceIds();
      expect(choiceIds.length).toEqual(3);
      expect(choiceIds[0]).toEqual(choice1.id);
      expect(choiceIds[1]).toEqual(choice2.id);
      expect(choiceIds[2]).toEqual(choice3.id);
    });
  });
}

function getChoicesThatChangedSinceLastSubmit() {
  describe('getChoicesThatChangedSinceLastSubmit', () => {
    beforeEach(() => {
      component.clearSourceBucketChoices();
      componentState = createComponentState(componentStateBuckets, true);
    });

    it('should get choices that changed since last submit', () => {
      manuallyAddChoiceToBucket(componentStateChoice1, componentStateBucket1);
      manuallyAddChoiceToBucket(componentStateChoice2, componentStateBucket0);
      manuallyAddChoiceToBucket(componentStateChoice3, componentStateBucket0);
      manuallyAddChoiceToBucket(choice1, bucket1);
      manuallyAddChoiceToBucket(choice2, bucket2);
      manuallyAddChoiceToBucket(choice3, bucket3);
      const choicesChanged = component.getChoicesThatChangedSinceLastSubmit(componentState);
      expect(choicesChanged.length).toEqual(2);
      expect(choicesChanged[0]).toEqual(choice2.id);
      expect(choicesChanged[1]).toEqual(choice3.id);
    });

    it('should get choices that changed since last submit when there is a correct order', () => {
      manuallyAddChoiceToBucket(componentStateChoice3, componentStateBucket1);
      manuallyAddChoiceToBucket(componentStateChoice2, componentStateBucket1);
      manuallyAddChoiceToBucket(componentStateChoice1, componentStateBucket1);
      manuallyAddChoiceToBucket(choice1, bucket1);
      manuallyAddChoiceToBucket(choice2, bucket1);
      manuallyAddChoiceToBucket(choice3, bucket1);
      spyOn(component, 'isAuthorHasSpecifiedACorrectPosition').and.returnValue(true);
      const choicesChanged = component.getChoicesThatChangedSinceLastSubmit(componentState);
      expect(choicesChanged.length).toEqual(2);
      expect(choicesChanged[0]).toEqual(choice1.id);
      expect(choicesChanged[1]).toEqual(choice3.id);
    });

    it('should get choices that changed since last submit when no choices have changed', () => {
      manuallyAddChoiceToBucket(componentStateChoice1, componentStateBucket1);
      manuallyAddChoiceToBucket(componentStateChoice2, componentStateBucket2);
      manuallyAddChoiceToBucket(componentStateChoice3, componentStateBucket3);
      manuallyAddChoiceToBucket(choice1, bucket1);
      manuallyAddChoiceToBucket(choice2, bucket2);
      manuallyAddChoiceToBucket(choice3, bucket3);
      const choicesChanged = component.getChoicesThatChangedSinceLastSubmit(componentState);
      expect(choicesChanged.length).toEqual(0);
    });
  });
}

function setStudentWork() {
  describe('setStudentWork', () => {
    beforeEach(() => {
      componentState = createComponentState(componentStateBuckets, false);
    });

    it('should set student work', () => {
      manuallyAddChoiceToBucket(componentStateChoice1, componentState.studentData.buckets[1]);
      component.setStudentWork(componentState);
      expectBucketContents(component, [
        { items: [choice2, choice3] },
        { items: [choice1] },
        { items: [] },
        { items: [] }
      ]);
    });

    it('should set student work when the student created a new choice', () => {
      const studentCreatedChoice1 = createChoice('studentCreatedChoice1', 'Student Created Choice');
      manuallyAddChoiceToBucket(studentCreatedChoice1, componentState.studentData.buckets[1]);
      component.setStudentWork(componentState);
      expectBucketContents(component, [
        { items: [choice1, choice2, choice3] },
        { items: [studentCreatedChoice1] },
        { items: [] },
        { items: [] }
      ]);
    });
  });
}

function expectBucketContents(component: any, expectedBucketContents: any[]) {
  for (let bucketIndex = 0; bucketIndex < expectedBucketContents.length; bucketIndex++) {
    const expectedBucket = expectedBucketContents[bucketIndex];
    for (let choiceIndex = 0; choiceIndex < expectedBucket.items.length; choiceIndex++) {
      expect(component.buckets[bucketIndex].items[choiceIndex]).toEqual(
        expectedBucketContents[bucketIndex].items[choiceIndex]
      );
    }
  }
}

function checkAnswer() {
  describe('checkAnswer', () => {
    it('should check answer where there is a correct answer', () => {
      spyOn(component, 'checkAnswerAndDisplayFeedback').and.returnValue(true);
      component.hasCorrectAnswer = true;
      component.checkAnswer();
      expect(component.isCorrect).toEqual(true);
    });

    it('should check answer where there is no correct answer', () => {
      spyOn(component, 'checkAnswerAndDisplayFeedback').and.returnValue(true);
      component.hasCorrectAnswer = false;
      component.checkAnswer();
      expect(component.isCorrect).toEqual(null);
    });
  });
}

function checkAnswerAndDisplayFeedback() {
  describe('checkAnswerAndDisplayFeedback', () => {
    it('should check answer and display feedback when a choice is correct', () => {
      const feedbackText = 'This is correct';
      const isCorrect = true;
      const feedbackObject = createFeedback(choiceId1, feedbackText, isCorrect);
      spyOn(component, 'getFeedbackObject').and.returnValue(feedbackObject);
      component.checkAnswerAndDisplayFeedback(bucketId1, choice1, 1, true);
      expect(choice1.feedback).toEqual(feedbackText);
      expect(choice1.isCorrect).toEqual(isCorrect);
    });

    it('should check answer and display feedback when a choice is in the incorrect position', () => {
      const feedbackText = 'This is correct';
      const incorrectPositionFeedbackText = 'This is in the incorrect position';
      const isCorrect = true;
      const position = 1;
      const feedbackObject = createFeedback(
        choiceId1,
        feedbackText,
        isCorrect,
        position,
        incorrectPositionFeedbackText
      );
      spyOn(component, 'getFeedbackObject').and.returnValue(feedbackObject);
      component.componentContent.ordered = true;
      component.checkAnswerAndDisplayFeedback(bucketId1, choice1, 2, true);
      expect(choice1.feedback).toEqual(incorrectPositionFeedbackText);
      expect(choice1.isCorrect).toEqual(false);
      expect(choice1.isIncorrectPosition).toEqual(true);
    });
  });
}

function getCorrectness() {
  describe('getCorrectness', () => {
    it('should get correctness from feedback object when it is true', () => {
      const isCorrect = true;
      const feedbackObject = createFeedback(choiceId1, '', isCorrect);
      expect(component.getCorrectness(feedbackObject, true, 0)).toEqual(isCorrect);
    });

    it('should get correctness from feedback object when it is false', () => {
      const isCorrect = false;
      const feedbackObject = createFeedback(choiceId1, '', isCorrect);
      expect(component.getCorrectness(feedbackObject, true, 0)).toEqual(isCorrect);
    });

    it(`should get correctness from feedback object when position matters and it is in the correct
        position`, () => {
      const isCorrect = true;
      const feedbackObject = createFeedback(choiceId1, '', isCorrect, 1);
      expect(component.getCorrectness(feedbackObject, true, 1)).toEqual(isCorrect);
    });

    it(`should get correctness from feedback object when position matters and it is not in the
        correct position`, () => {
      const isCorrect = false;
      const feedbackObject = createFeedback(choiceId1, '', isCorrect, 1);
      expect(component.getCorrectness(feedbackObject, true, 2)).toEqual(isCorrect);
    });

    it('should get correctness from feedback object there is not correct answer', () => {
      const feedbackObject = createFeedback(choiceId1, '', false, 1);
      expect(component.getCorrectness(feedbackObject, false, 1)).toEqual(null);
    });
  });
}

function initializeBuckets() {
  describe('initializeBuckets', () => {
    it('should initialize buckets', () => {
      component.sourceBucket = null;
      component.buckets = null;
      component.initializeBuckets();
      expect(component.sourceBucket.value).toEqual(starterBucketLabel);
      expect(component.sourceBucket.items.length).toEqual(3);
      expect(component.buckets.length).toEqual(4);
      expect(component.buckets[1].value).toEqual(bucketValue1);
      expect(component.buckets[2].value).toEqual(bucketValue2);
      expect(component.buckets[3].value).toEqual(bucketValue3);
    });
  });
}

function initializeChoices() {
  describe('initializeChoices', () => {
    it('should initialize choices', () => {
      component.choices = null;
      component.initializeChoices();
      expect(component.choices.length).toEqual(3);
      expect(component.choices[0].value).toEqual(choiceValue1);
      expect(component.choices[1].value).toEqual(choiceValue2);
      expect(component.choices[2].value).toEqual(choiceValue3);
    });
  });
}

function createComponentStateObject() {
  describe('createComponentStateObject', () => {
    it('should create a component state object', () => {
      const componentState = component.createComponentStateObject('save');
      expect(componentState.componentType).toEqual('Match');
      expect(componentState.nodeId).toEqual(nodeId);
      expect(componentState.componentId).toEqual(componentId);
      expect(componentState.isSubmit).toEqual(false);
      expect(componentState.studentData.submitCounter).toEqual(0);
      expect(componentState.studentData.buckets.length).toEqual(4);
      expect(componentState.studentData.buckets[0].value).toEqual(starterBucketLabel);
      expect(componentState.studentData.buckets[1].value).toEqual(bucketValue1);
      expect(componentState.studentData.buckets[2].value).toEqual(bucketValue2);
      expect(componentState.studentData.buckets[3].value).toEqual(bucketValue3);
      expect(componentState.studentData.buckets[0].items.length).toEqual(3);
      expect(componentState.studentData.buckets[0].items[0].value).toEqual(choiceValue1);
      expect(componentState.studentData.buckets[0].items[1].value).toEqual(choiceValue2);
      expect(componentState.studentData.buckets[0].items[2].value).toEqual(choiceValue3);
    });
  });
}

function clearFeedback() {
  describe('clearFeedback', () => {
    it('should clear feedback', () => {
      for (const choice of component.choices) {
        choice.feedback = 'This is feedback';
      }
      component.clearFeedback();
      for (const choice of component.choices) {
        expect(choice.feedback).toEqual(null);
      }
    });
  });
}

function isAuthorHasSpecifiedACorrectBucket() {
  describe('isAuthorHasSpecifiedACorrectBucket', () => {
    it(`should check if author has specified the choice has a correct bucket when it does
        not`, () => {
      expect(component.isAuthorHasSpecifiedACorrectBucket(choiceId1)).toEqual(false);
    });

    it('should check if author has specified the choice has a correct bucket when it does', () => {
      component.componentContent.feedback[1].choices[0].isCorrect = true;
      expect(component.isAuthorHasSpecifiedACorrectBucket(choiceId1)).toEqual(true);
    });
  });
}

function isAuthorHasSpecifiedACorrectPosition() {
  describe('isAuthorHasSpecifiedACorrectPosition', () => {
    it(`should check if author has specified the choice has a correct position when it does
        not`, () => {
      expect(component.isAuthorHasSpecifiedACorrectPosition(choiceId1)).toEqual(false);
    });

    it(`should check if author has specified the choice has a correct position when it
        does`, () => {
      component.componentContent.feedback[1].choices[0].position = 1;
      expect(component.isAuthorHasSpecifiedACorrectPosition(choiceId1)).toEqual(true);
    });
  });
}

function getFeedbackObject() {
  describe('getFeedbackObject', () => {
    it('should get feedback object', () => {
      const feedbackObject = component.getFeedbackObject(bucketId1, choiceId1);
      expect(feedbackObject.choiceId).toEqual(choiceId1);
    });
  });
}

function mergeBucket() {
  describe('mergeBucket', () => {
    it('should merge bucket when the bucket is not in the existing buckets array', () => {
      const buckets = [bucket1, bucket2];
      const mergedBuckets = component.mergeBucket(buckets, bucket3);
      expect(mergedBuckets.length).toEqual(3);
      expect(mergedBuckets[0].id).toEqual(bucketId1);
      expect(mergedBuckets[1].id).toEqual(bucketId2);
      expect(mergedBuckets[2].id).toEqual(bucketId3);
    });

    it('should merge bucket when the bucket is in the existing buckets array', () => {
      manuallyAddChoiceToBucket(choice1, bucket1);
      manuallyAddChoiceToBucket(choice2, bucket1);
      const buckets = [bucket1, bucket2];
      const anotherBucket1 = createBucket(bucketId1, bucketValue1, []);
      manuallyAddChoiceToBucket(choice2, anotherBucket1);
      manuallyAddChoiceToBucket(choice3, anotherBucket1);
      const mergedBuckets = component.mergeBucket(buckets, anotherBucket1);
      expect(mergedBuckets.length).toEqual(2);
      expect(mergedBuckets[0].id).toEqual(bucketId1);
      expect(mergedBuckets[1].id).toEqual(bucketId2);
      expect(mergedBuckets[0].items.length).toEqual(3);
      expect(mergedBuckets[0].items[0].id).toEqual(choiceId1);
      expect(mergedBuckets[0].items[1].id).toEqual(choiceId2);
      expect(mergedBuckets[0].items[2].id).toEqual(choiceId3);
    });
  });
}

function mergeChoices() {
  describe('mergeChoices', () => {
    it('should merge choices', () => {
      const choices1 = [choice1, choice2];
      const choices2 = [choice2, choice3];
      const mergedChoices = component.mergeChoices(choices1, choices2);
      expect(mergedChoices.length).toEqual(3);
      expect(mergedChoices[0].id).toEqual(choiceId1);
      expect(mergedChoices[1].id).toEqual(choiceId2);
      expect(mergedChoices[2].id).toEqual(choiceId3);
    });
  });
}

function getValueById() {
  describe('getValueById', () => {
    it('should get value by id', () => {
      expect(component.getValueById(component.componentContent, choiceId1)).toEqual(choiceValue1);
      expect(component.getValueById(component.componentContent, bucketId1)).toEqual(bucketValue1);
    });
  });
}

function getCleanedValue() {
  describe('getCleanedValue', () => {
    it('should get cleaned value', () => {
      const choiceValue = '<img src="choice1.png"/>';
      const bucketValue = '<img src="bucket1.png"/>';
      const componentContent = component.componentContent;
      componentContent.choices[0].value = choiceValue;
      componentContent.buckets[0].value = bucketValue;
      const originalComponentContent = JSON.parse(JSON.stringify(componentContent));
      component.componentContent = TestBed.inject(
        ClickToSnipImageService
      ).injectClickToSnipImageListener(component.componentContent);
      expect(component.componentContent.choices[0].value).toContain('onclick');
      expect(component.componentContent.buckets[0].value).toContain('onclick');
      expect(
        component.getCleanedValue(originalComponentContent, component.componentContent.choices[0])
      ).toEqual(choiceValue);
      expect(
        component.getCleanedValue(originalComponentContent, component.componentContent.buckets[0])
      ).toEqual(bucketValue);
    });
  });
}
