import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { PeerChatQuestionBankComponent } from './peer-chat-question-bank.component';
import { ProjectService } from '../../../services/projectService';
import { QuestionBank } from './QuestionBank';
import { ComponentContent } from '../../../common/ComponentContent';
import { QuestionBankRule } from './QuestionBankRule';
import { PeerGroupService } from '../../../services/peerGroupService';
import { PeerGroup } from '../PeerGroup';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { QuestionBankService } from './questionBank.service';

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
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [PeerChatQuestionBankComponent],
      providers: [QuestionBankService]
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
      expect(component.questions).toEqual(['q1', 'q2', 'q3', 'q4']);
    });
  });
}

function ngOnInit_displayedQuestionBankRulesNotSet_EvaluatePeerGroupDataAndSetQuestions() {
  describe('displayedQuestionBankRules is not set', () => {
    it('should evaluate PeerGroup data and set questions', () => {
      const getComponentSpy = spyOn(projectService, 'getComponent').and.returnValue({
        type: 'OpenResponse'
      } as ComponentContent);
      const retrievePeerGroupSpy = spyOn(peerGroupService, 'retrievePeerGroup').and.returnValue(
        of({ id: 1 } as PeerGroup)
      );
      const retrieveStudentDataSpy = spyOn(
        peerGroupService,
        'retrieveQuestionBankStudentData'
      ).and.returnValue(of([]));
      component.ngOnInit();
      expect(getComponentSpy).toHaveBeenCalledWith('node1', 'abc');
      expect(retrievePeerGroupSpy).toHaveBeenCalledWith('tag1');
      expect(retrieveStudentDataSpy).toHaveBeenCalledWith(1, 'node2', 'def');
      expect(component.displayedQuestionBankRules).toEqual([defaultQuestionBankRule]);
    });
  });
}
