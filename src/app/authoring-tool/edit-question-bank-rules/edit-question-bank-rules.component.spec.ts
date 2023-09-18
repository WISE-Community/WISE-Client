import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionBankRule } from '../../../assets/wise5/components/peerChat/peer-chat-question-bank/QuestionBankRule';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { EditQuestionBankRulesComponent } from './edit-question-bank-rules.component';
import { Question } from '../../../assets/wise5/components/peerChat/peer-chat-question-bank/Question';

let component: EditQuestionBankRulesComponent;
let fixture: ComponentFixture<EditQuestionBankRulesComponent>;
let projectService: TeacherProjectService;
let nodeChangedSpy: jasmine.Spy;

describe('EditQuestionBankRulesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditQuestionBankRulesComponent],
      imports: [
        DragDropModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [TeacherProjectService]
    }).compileComponents();
    projectService = TestBed.inject(TeacherProjectService);
    nodeChangedSpy = spyOn(projectService, 'nodeChanged');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQuestionBankRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  addNewFeedbackToRule();
  deleteFeedbackInRule();
});

function addNewFeedbackToRule() {
  describe('addNewFeedbackToRule()', () => {
    addNewFeedbackToRuleVersion1();
    addNewFeedbackToRuleVersion2();
  });
}

function addNewFeedbackToRuleVersion1() {
  describe('using question bank content version 1', () => {
    it('adds new question to rule', () => {
      component.version = undefined;
      const rule = new QuestionBankRule({ questions: [] });
      component.addNewFeedbackToRule(rule);
      expect(nodeChangedSpy).toHaveBeenCalled();
      expect(rule.questions.length).toEqual(1);
      expect(rule.questions[0]).toEqual('');
    });
  });
}

function addNewFeedbackToRuleVersion2() {
  describe('using question bank content version 2', () => {
    it('adds new question to rule', () => {
      component.version = 2;
      const rule = new QuestionBankRule({ questions: [] });
      component.addNewFeedbackToRule(rule);
      expect(nodeChangedSpy).toHaveBeenCalled();
      expect(rule.questions.length).toEqual(1);
      const question = rule.questions[0] as Question;
      expect(question.hasOwnProperty('id')).toEqual(true);
      expect(question.text).toEqual('');
    });
  });
}

function deleteFeedbackInRule() {
  describe('deleteFeedbackInRule()', () => {
    it('deletes specified feedback', () => {
      const rule = new QuestionBankRule({ questions: ['Q1', 'Q2'] });
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteFeedbackInRule(rule, 0);
      expect(nodeChangedSpy).toHaveBeenCalled();
      expect(rule.questions.length).toEqual(1);
      expect(rule.questions[0]).toEqual('Q2');
    });
  });
}
