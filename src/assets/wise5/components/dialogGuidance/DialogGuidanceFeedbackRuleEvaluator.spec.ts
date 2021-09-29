import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { PossibleScoreComponent } from '../../../../app/possible-score/possible-score.component';
import { ComponentHeader } from '../../directives/component-header/component-header.component';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { CRaterService } from '../../services/cRaterService';
import { NodeService } from '../../services/nodeService';
import { NotebookService } from '../../services/notebookService';
import { ProjectService } from '../../services/projectService';
import { SessionService } from '../../services/sessionService';
import { StudentAssetService } from '../../services/studentAssetService';
import { StudentDataService } from '../../services/studentDataService';
import { TagService } from '../../services/tagService';
import { UtilService } from '../../services/utilService';
import { MockNodeService } from '../animation/animation-authoring/animation-authoring.component.spec';
import { MockService } from '../animation/animation-student/animation-student.component.spec';
import { ComponentService } from '../componentService';
import { CRaterIdea } from './CRaterIdea';
import { CRaterResponse } from './CRaterResponse';
import { DialogGuidanceStudentComponent } from './dialog-guidance-student/dialog-guidance-student.component';
import { DialogResponsesComponent } from './dialog-responses/dialog-responses.component';
import { DialogGuidanceFeedbackRuleEvaluator } from './DialogGuidanceFeedbackRuleEvaluator';
import { DialogGuidanceService } from './dialogGuidanceService';
import { FeedbackRule } from './FeedbackRule';

let component: DialogGuidanceStudentComponent;
let evaluator: DialogGuidanceFeedbackRuleEvaluator;
describe('DialogGuidanceFeedbackRuleEvaluator', () => {
  let fixture: ComponentFixture<DialogGuidanceStudentComponent>;
  const defaultFeedbackRules = [
    {
      expression: 'isFinalSubmit',
      feedback: 'This is a generic response that is shown on a final submission'
    },
    {
      expression: 'isSecondToLastSubmit',
      feedback: 'This is a generic response that is shown on the second to last submission'
    },
    {
      expression: 'idea1 && idea2',
      feedback: 'You hit idea1 and idea2'
    },
    {
      expression: 'idea2 && idea3 && idea4',
      feedback: 'You hit idea2, idea3 and idea4'
    },
    {
      expression: 'idea5 || idea6',
      feedback: 'You hit idea5 or idea6'
    },
    {
      expression: 'idea7 || idea8 && idea9',
      feedback: 'You hit idea7 or idea8 and idea9'
    },
    {
      expression: 'idea7 && idea8 || idea9',
      feedback: 'You hit idea7 and idea8 or idea9'
    },
    {
      expression: 'idea1',
      feedback: 'You hit idea1'
    },
    {
      expression: 'idea2',
      feedback: 'You hit idea2'
    },
    {
      expression: 'isDefault',
      feedback: 'This is a default feedback'
    }
  ];

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
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        UpgradeModule
      ],
      providers: [
        AnnotationService,
        ComponentService,
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
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    component.componentContent = TestBed.inject(DialogGuidanceService).createComponent();
    component.componentContent.feedbackRules = defaultFeedbackRules;
    fixture.detectChanges();
    evaluator = new DialogGuidanceFeedbackRuleEvaluator(component);
  });
  matchRule_OneIdea();
  matchRule_MultipleIdeasUsingAnd();
  matchRule_MultipleIdeasUsingOr();
  matchRule_MultipleIdeasUsingOrAndAnd();
  matchNoRule_ReturnDefault();
  secondToLastSubmit();
  finalSubmit();
});

function matchRule_OneIdea() {
  it('should find first rule matching one idea', () => {
    expectFeedbackForMatchedIdeas(['idea1'], 'You hit idea1');
  });
}

function matchRule_MultipleIdeasUsingAnd() {
  it('should find rule matching two ideas using && (and) operator', () => {
    expectFeedbackForMatchedIdeas(['idea1', 'idea2'], 'You hit idea1 and idea2');
    expectFeedbackForMatchedIdeas(['idea2', 'idea3', 'idea4'], 'You hit idea2, idea3 and idea4');
  });
}

function matchRule_MultipleIdeasUsingOr() {
  it('should find rule matching ideas using || (or) operator', () => {
    expectFeedbackForMatchedIdeas(['idea5'], 'You hit idea5 or idea6');
  });
}

function matchRule_MultipleIdeasUsingOrAndAnd() {
  it('should find rule matching ideas using combination of && (and) and || (or) operators', () => {
    expectFeedbackForMatchedIdeas(['idea7', 'idea9'], 'You hit idea7 or idea8 and idea9');
    expectFeedbackForMatchedIdeas(['idea8', 'idea9'], 'You hit idea7 or idea8 and idea9');
    expectFeedbackForMatchedIdeas(['idea7', 'idea8'], 'You hit idea7 and idea8 or idea9');
    expectFeedbackForMatchedIdeas(['idea9'], 'You hit idea7 and idea8 or idea9');
  });
}

function matchNoRule_ReturnDefault() {
  it('should return default idea when no rule is matched', () => {
    expectFeedbackForMatchedIdeas([], 'default feedback');
  });
}

function secondToLastSubmit() {
  it('should return second to last submit rule when there is one submit left', () => {
    component.componentContent.maxSubmitCount = 5;
    component.submitCounter = 4;
    expectFeedbackForMatchedIdeas(['idea1'], 'second to last submission');
  });
}

function finalSubmit() {
  it('should return final submit rule when no more submits left', () => {
    component.componentContent.maxSubmitCount = 5;
    component.submitCounter = 5;
    expectFeedbackForMatchedIdeas(['idea1'], 'final submission');
  });
}

function expectFeedbackForMatchedIdeas(ideas: string[], expectedFeedback: string) {
  const rule = getFeedbackRuleForIdeas(ideas);
  expect(rule.feedback).toContain(expectedFeedback);
}

function getFeedbackRuleForIdeas(ideasString: string[]): FeedbackRule {
  const response = createCRaterResponse(ideasString);
  return evaluator.getFeedbackRule(response);
}

function createCRaterResponse(ideasString: string[]) {
  const response = new CRaterResponse();
  response.ideas = ideasString.map((idea) => {
    const cRaterIdea = new CRaterIdea();
    cRaterIdea.name = idea;
    cRaterIdea.detected = true;
    return cRaterIdea;
  });
  return response;
}
