import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerChatQuestionBankComponent } from './peer-chat-question-bank.component';
import { ProjectService } from '../../../services/projectService';
import { QuestionBank } from './QuestionBank';
import { QuestionBankRule } from './QuestionBankRule';
import { PeerGroupService } from '../../../services/peerGroupService';
import { PeerGroup } from '../PeerGroup';
import { of } from 'rxjs';
import { QuestionBankService } from './questionBank.service';
import { MockProvider, MockProviders } from 'ng-mocks';
import { ConfigService } from '../../../services/configService';
import { ConstraintService } from '../../../services/constraintService';
import { Question } from './Question';
import { Component } from '../../../common/Component';

let component: PeerChatQuestionBankComponent;
let fixture: ComponentFixture<PeerChatQuestionBankComponent>;
let peerGroupService: PeerGroupService;
let projectService: ProjectService;
const defaultQuestionBankRule = {
  id: 'default',
  expression: 'isDefault',
  questions: ['default question']
} as QuestionBankRule;
describe('PeerChatQuestionBankComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PeerChatQuestionBankComponent],
      providers: [
        MockProviders(ConfigService, ConstraintService, PeerGroupService, ProjectService),
        MockProvider(QuestionBankService, {
          questionUsed$: of({ id: 'q1' } as Question)
        })
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(PeerChatQuestionBankComponent);
    peerGroupService = TestBed.inject(PeerGroupService);
    projectService = TestBed.inject(ProjectService);
    component = fixture.componentInstance;
    component.content = {
      componentId: 'def',
      nodeId: 'node2',
      questionBank: new QuestionBank({
        maxQuestionsToShow: null,
        peerGroupingTag: 'tag1',
        referenceComponent: { nodeId: 'node1', componentId: 'abc' },
        rules: [defaultQuestionBankRule]
      })
    };
  });
  ngOnInit();
});

function ngOnInit() {
  describe('ngOnInit()', () => {
    ngOnInit_displayedQuestionBankRulesSet_SetQuestions();
    ngOnInit_displayedQuestionBankRulesNotSet_EvaluatePeerGroupDataAndSetQuestions();
  });
}

function ngOnInit_displayedQuestionBankRulesSet_SetQuestions() {
  describe('displayedQuestionBankRules is set', () => {
    it('should set questions', () => {
      component.displayedQuestionBankRules = [
        { questions: ['q1', 'q2', 'q3'] },
        { questions: ['q4'] }
      ] as QuestionBankRule[];
      component.ngOnInit();
      expect(component['questions']).toEqual(['q1', 'q2', 'q3', 'q4']);
    });
  });
}

function ngOnInit_displayedQuestionBankRulesNotSet_EvaluatePeerGroupDataAndSetQuestions() {
  describe('displayedQuestionBankRules is not set', () => {
    it('should evaluate PeerGroup data and set questions', () => {
      const getComponentSpy = spyOn(projectService, 'getReferenceComponent').and.returnValue({
        content: {
          type: 'OpenResponse'
        }
      } as Component);
      const retrievePeerGroupSpy = spyOn(peerGroupService, 'retrievePeerGroup').and.returnValue(
        of({ id: 1 } as PeerGroup)
      );
      const retrieveStudentDataSpy = spyOn(
        peerGroupService,
        'retrieveQuestionBankStudentData'
      ).and.returnValue(of([]));
      component.ngOnInit();
      expect(getComponentSpy).toHaveBeenCalled();
      expect(retrievePeerGroupSpy).toHaveBeenCalledWith('tag1');
      expect(retrieveStudentDataSpy).toHaveBeenCalledWith(1, 'node2', 'def');
      expect(component.displayedQuestionBankRules).toEqual([defaultQuestionBankRule]);
    });
  });
}
