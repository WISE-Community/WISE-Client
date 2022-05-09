import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EditDialogGuidanceFeedbackRulesComponent } from './edit-dialog-guidance-feedback-rules.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { UpgradeModule } from '@angular/upgrade/static';

class MockTeacherProjectService {
  nodeChanged() {}
}

let component: EditDialogGuidanceFeedbackRulesComponent;
const feedbackString1: string = 'you hit idea1';
const feedbackString2: string = 'you hit idea2';
let nodeChangedSpy: jasmine.Spy;

describe('EditDialogGuidanceFeedbackRulesComponent', () => {
  let fixture: ComponentFixture<EditDialogGuidanceFeedbackRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeModule],
      declarations: [EditDialogGuidanceFeedbackRulesComponent],
      providers: [
        { provide: TeacherProjectService, useClass: MockTeacherProjectService },
        UtilService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(EditDialogGuidanceFeedbackRulesComponent);
    component = fixture.componentInstance;
    component.version = 2;
    component.feedbackRules = [
      { expression: 'idea1', feedback: [feedbackString1] },
      { expression: 'idea2', feedback: [feedbackString2] }
    ];
    nodeChangedSpy = spyOn(TestBed.inject(TeacherProjectService), 'nodeChanged');
    fixture.detectChanges();
  });

  addNewRule();
  deleteRule();
  moveUp();
  moveDown();
  createNewFeedbackRule();
  addNewFeedbackToRule();
  deleteFeedbackInRule();
});

function addNewRule() {
  describe('addNewRule()', () => {
    it('should add rule at the beginning', () => {
      component.addNewRule('beginning');
      expectFeedbackExpressions(['', 'idea1', 'idea2']);
      expect(nodeChangedSpy).toHaveBeenCalled();
    });

    it('should add rule at the end', () => {
      component.addNewRule('end');
      expectFeedbackExpressions(['idea1', 'idea2', '']);
      expect(nodeChangedSpy).toHaveBeenCalled();
    });
  });
}

function deleteRule() {
  describe('deleteRule()', () => {
    it('should delete rule at specified index', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteRule(0);
      expectFeedbackExpressions(['idea2']);
      expect(nodeChangedSpy).toHaveBeenCalled();
    });
  });
}

function moveUp() {
  describe('moveUp()', () => {
    it('should move rule one position up in order (towards the beginning of the rules array)', () => {
      component.moveUp(1);
      expectFeedbackExpressions(['idea2', 'idea1']);
      expect(nodeChangedSpy).toHaveBeenCalled();
    });
  });
}

function moveDown() {
  describe('moveDown()', () => {
    it('should move rule one position down in order (towards the end of the rules array)', () => {
      component.moveDown(0);
      expectFeedbackExpressions(['idea2', 'idea1']);
      expect(nodeChangedSpy).toHaveBeenCalled();
    });
  });
}

function expectFeedbackExpressions(expectedExpressionsInOrder: string[]): void {
  expect(component.feedbackRules.length).toEqual(expectedExpressionsInOrder.length);
  for (let i = 0; i < expectedExpressionsInOrder.length; i++) {
    expect(component.feedbackRules[i].expression).toEqual(expectedExpressionsInOrder[i]);
  }
}

function createNewFeedbackRule() {
  describe('createNewFeedbackRule', () => {
    it('should create new feedback rule version 1', () => {
      component.version = 1;
      component.feedbackRules = [];
      const feedbackRule = component.createNewFeedbackRule();
      expect(typeof feedbackRule.feedback).toEqual('string');
    });
    it('should create new feedback rule version 2', () => {
      component.feedbackRules = [];
      const feedbackRule = component.createNewFeedbackRule();
      expect(Array.isArray(feedbackRule.feedback)).toBeTruthy();
    });
  });
}

function addNewFeedbackToRule() {
  describe('addNewFeedbackToRule', () => {
    it('should add new feedback to rule', () => {
      component.addNewFeedbackToRule(component.feedbackRules[0]);
      expect(component.feedbackRules[0].feedback).toEqual([feedbackString1, '']);
    });
  });
}

function deleteFeedbackInRule() {
  describe('deleteFeedbackInRule', () => {
    it('should delete feedback in rule', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const feedbackRule = {
        expression: '',
        feedback: ['Hello', 'World'],
        id: '1234567890'
      };
      component.deleteFeedbackInRule(feedbackRule, 1);
      expect(feedbackRule.feedback).toEqual(['Hello']);
    });
  });
}
