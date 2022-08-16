import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PossibleScoreComponent } from '../../../../app/possible-score/possible-score.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { ComponentHeader } from '../../directives/component-header/component-header.component';
import { AnnotationService } from '../../services/annotationService';
import { DialogGuidanceFeedbackService } from '../../services/dialogGuidanceFeedbackService';
import { ProjectService } from '../../services/projectService';
import { CRaterIdea } from './CRaterIdea';
import { CRaterResponse } from './CRaterResponse';
import { CRaterScore } from './CRaterScore';
import { DialogGuidanceStudentComponent } from './dialog-guidance-student/dialog-guidance-student.component';
import { DialogResponsesComponent } from './dialog-responses/dialog-responses.component';
import { DialogGuidanceFeedbackRuleEvaluator } from './DialogGuidanceFeedbackRuleEvaluator';
import { DialogGuidanceService } from './dialogGuidanceService';
import { FeedbackRule } from './FeedbackRule';

let component: DialogGuidanceStudentComponent;
let evaluator: DialogGuidanceFeedbackRuleEvaluator;
const KI_SCORE_1 = new CRaterScore('ki', 1, 1, 1, 5);
const KI_SCORE_3 = new CRaterScore('ki', 3, 3, 1, 5);
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
      expression: 'isNonScorable',
      feedback: 'isNonScorable'
    },
    {
      expression: 'hasKIScore(3)',
      feedback: 'hasKIScore(3)'
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
      expression: '!idea10',
      feedback: '!idea10'
    },
    {
      expression: 'idea10 && !idea11',
      feedback: 'idea10 && !idea11'
    },
    {
      expression: '!idea11 || idea12',
      feedback: '!idea11 || idea12'
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
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [DialogGuidanceFeedbackService]
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
    component.componentContent.maxSubmitCount = 5;
    fixture.detectChanges();
    evaluator = new DialogGuidanceFeedbackRuleEvaluator(component);
  });
  matchRule_OneIdea();
  matchRule_MultipleIdeasUsingAnd();
  matchRule_MultipleIdeasUsingOr();
  matchRule_MultipleIdeasUsingAndOr();
  matchRule_MultipleIdeasUsingNotAndOr();
  matchRule_hasKIScore();
  matchNoRule_ReturnDefault();
  matchNoRule_NoDefaultFeedbackAuthored_ReturnApplicationDefault();
  secondToLastSubmit();
  finalSubmit();
  nonScorable();
});

function matchRule_OneIdea() {
  it('should find first rule matching one idea', () => {
    expectFeedback(['idea1'], [KI_SCORE_1], 'You hit idea1');
  });
}

function matchRule_MultipleIdeasUsingAnd() {
  it('should find rule matching two ideas using && operator', () => {
    expectFeedback(['idea1', 'idea2'], [KI_SCORE_1], 'You hit idea1 and idea2');
    expectFeedback(['idea2', 'idea3', 'idea4'], [KI_SCORE_1], 'You hit idea2, idea3 and idea4');
  });
}

function matchRule_MultipleIdeasUsingOr() {
  it('should find rule matching ideas using || operator', () => {
    expectFeedback(['idea5'], [KI_SCORE_1], 'You hit idea5 or idea6');
  });
}

function matchRule_MultipleIdeasUsingAndOr() {
  it('should find rule matching ideas using combination of && and || operators', () => {
    expectFeedback(['idea7', 'idea9'], [KI_SCORE_1], 'You hit idea7 or idea8 and idea9');
    expectFeedback(['idea8', 'idea9'], [KI_SCORE_1], 'You hit idea7 or idea8 and idea9');
    expectFeedback(['idea7', 'idea8'], [KI_SCORE_1], 'You hit idea7 and idea8 or idea9');
    expectFeedback(['idea9'], [KI_SCORE_1], 'You hit idea7 and idea8 or idea9');
  });
}

function matchRule_MultipleIdeasUsingNotAndOr() {
  it('should find rule matching ideas using combination of !, && and || operators', () => {
    expectFeedback([], [KI_SCORE_1], '!idea10');
    expectFeedback(['idea10'], [KI_SCORE_1], 'idea10 && !idea11');
    expectFeedback(['idea10', 'idea11', 'idea12'], [KI_SCORE_1], '!idea11 || idea12');
  });
}

function matchRule_hasKIScore() {
  it('should find rule matching hasKIScore() function', () => {
    expectFeedback([], [KI_SCORE_3], 'hasKIScore(3)');
  });
}

function matchNoRule_ReturnDefault() {
  it('should return default idea when no rule is matched', () => {
    expectFeedback(['idea10', 'idea11'], [KI_SCORE_1], 'default feedback');
  });
}

function matchNoRule_NoDefaultFeedbackAuthored_ReturnApplicationDefault() {
  it('should return application default rule when no rule is matched and no default is authored', () => {
    component.componentContent.feedbackRules = [];
    expectFeedback(['idea10', 'idea11'], [KI_SCORE_1], evaluator.defaultFeedback);
  });
}

function secondToLastSubmit() {
  it('should return second to last submit rule when there is one submit left', () => {
    component.submitCounter = 4;
    expectFeedback(['idea1'], [KI_SCORE_1], 'second to last submission');
  });
}

function finalSubmit() {
  it('should return final submit rule when no more submits left', () => {
    component.submitCounter = 5;
    expectFeedback(['idea1'], [KI_SCORE_1], 'final submission');
  });
}

function nonScorable() {
  it('should return non-scorable rule when the item is not scorable', () => {
    expectFeedback([], [new CRaterScore('nonscorable', 1, 1, 1, 5)], 'isNonScorable');
  });
}

function expectFeedback(ideas: string[], scores: CRaterScore[], expectedFeedback: string) {
  const rule = getFeedbackRule(ideas, scores);
  expect(rule.feedback).toContain(expectedFeedback);
}

function getFeedbackRule(ideas: string[], scores: CRaterScore[]): FeedbackRule {
  return evaluator.getFeedbackRule(createCRaterResponse(ideas, scores));
}

function createCRaterResponse(ideas: string[], scores: CRaterScore[]): CRaterResponse {
  const response = new CRaterResponse();
  response.ideas = ideas.map((idea) => {
    return new CRaterIdea(idea, true);
  });
  response.scores = scores;
  return response;
}
