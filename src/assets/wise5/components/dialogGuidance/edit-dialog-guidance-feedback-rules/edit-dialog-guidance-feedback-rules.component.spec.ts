import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EditDialogGuidanceFeedbackRulesComponent } from './edit-dialog-guidance-feedback-rules.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';

class MockTeacherProjectService {
  nodeChanged() {}
}

let component: EditDialogGuidanceFeedbackRulesComponent;
let nodeChangedSpy;
describe('EditDialogGuidanceFeedbackRulesComponent', () => {
  let fixture: ComponentFixture<EditDialogGuidanceFeedbackRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDialogGuidanceFeedbackRulesComponent],
      providers: [{ provide: TeacherProjectService, useClass: MockTeacherProjectService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDialogGuidanceFeedbackRulesComponent);
    component = fixture.componentInstance;
    component.feedbackRules = [
      { expression: 'idea1', feedback: 'you hit idea1' },
      { expression: 'idea2', feedback: 'you hit idea2' }
    ];
    nodeChangedSpy = spyOn(TestBed.inject(TeacherProjectService), 'nodeChanged');
    fixture.detectChanges();
  });

  addNewRule();
  deleteRule();
  moveUp();
  moveDown();
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
