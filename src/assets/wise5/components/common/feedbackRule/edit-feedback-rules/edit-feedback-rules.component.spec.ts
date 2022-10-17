import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EditFeedbackRulesComponent } from './edit-feedback-rules.component';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { UtilService } from '../../../../services/utilService';
import { FeedbackRule } from '../FeedbackRule';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackRuleHelpComponent } from '../feedback-rule-help/feedback-rule-help.component';

class MockTeacherProjectService {
  nodeChanged() {}
}

class MockMatDialog {
  open() {}
}

let component: EditFeedbackRulesComponent;
const feedbackString1: string = 'you hit idea1';
const feedbackString2: string = 'you hit idea2';
let dialogOpenSpy: jasmine.Spy;
let nodeChangedSpy: jasmine.Spy;

describe('EditFeedbackRulesComponent', () => {
  let fixture: ComponentFixture<EditFeedbackRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [EditFeedbackRulesComponent],
      providers: [
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: TeacherProjectService, useClass: MockTeacherProjectService },
        UtilService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(EditFeedbackRulesComponent);
    component = fixture.componentInstance;
    component.version = 2;
    component.feedbackRules = [
      new FeedbackRule({ id: '1111111111', expression: 'idea1', feedback: [feedbackString1] }),
      new FeedbackRule({ id: '2222222222', expression: 'idea2', feedback: [feedbackString2] })
    ];
    dialogOpenSpy = spyOn(TestBed.inject(MatDialog), 'open');
    nodeChangedSpy = spyOn(TestBed.inject(TeacherProjectService), 'nodeChanged');
    fixture.detectChanges();
  });

  addNewRule();
  deleteRule();
  moveUp();
  moveDown();
  addNewFeedbackToRule();
  deleteFeedbackInRule();
  showHelp();
});

function addNewRule() {
  describe('addNewRule()', () => {
    it('should add rule at the beginning', () => {
      component.addNewRule(0);
      expectFeedbackExpressions(['', 'idea1', 'idea2']);
      expect(nodeChangedSpy).toHaveBeenCalled();
    });

    it('should add rule in the middle', () => {
      component.addNewRule(1);
      expectFeedbackExpressions(['idea1', '', 'idea2']);
      expect(nodeChangedSpy).toHaveBeenCalled();
    });

    it('should add rule at the end', () => {
      component.addNewRule(2);
      expectFeedbackExpressions(['idea1', 'idea2', '']);
      expect(nodeChangedSpy).toHaveBeenCalled();
    });

    it('should create new rule with feedback version 1', () => {
      component.version = 1;
      component.feedbackRules = [];
      component.addNewRule(0);
      expect(component.feedbackRules.length).toEqual(1);
      const feedbackRule = component.feedbackRules[0];
      expect(feedbackRule.expression).toEqual('');
      expect(feedbackRule.feedback).toEqual('');
      expect(nodeChangedSpy).toHaveBeenCalled();
    });

    it('should create new rule with feedback version 2', () => {
      component.version = 2;
      component.feedbackRules = [];
      component.addNewRule(0);
      expect(component.feedbackRules.length).toEqual(1);
      const feedbackRule = component.feedbackRules[0];
      expect(typeof feedbackRule.id).toEqual('string');
      expect(feedbackRule.expression).toEqual('');
      expect(feedbackRule.feedback).toEqual(['']);
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
      const feedbackRule = new FeedbackRule({
        expression: '',
        feedback: ['Hello', 'World'],
        id: '1234567890'
      });
      component.deleteFeedbackInRule(feedbackRule, 1);
      expect(feedbackRule.feedback).toEqual(['Hello']);
    });
  });
}

function showHelp() {
  describe('showHelp()', () => {
    it('should show FeedbackRuleHelpComponent in a dialog', () => {
      component.showHelp();
      expect(dialogOpenSpy).toHaveBeenCalledOnceWith(FeedbackRuleHelpComponent);
    });
  });
}
