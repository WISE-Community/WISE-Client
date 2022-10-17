import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PossibleScoreComponent } from '../../../../../app/possible-score/possible-score.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ComponentHeader } from '../../../directives/component-header/component-header.component';
import { DialogGuidanceFeedbackService } from '../../../services/dialogGuidanceFeedbackService';
import { CRaterIdea } from '../cRater/CRaterIdea';
import { CRaterResponse } from '../cRater/CRaterResponse';
import { CRaterScore } from '../cRater/CRaterScore';
import { DialogGuidanceStudentComponent } from '../../dialogGuidance/dialog-guidance-student/dialog-guidance-student.component';
import { DialogResponsesComponent } from '../../dialogGuidance/dialog-responses/dialog-responses.component';
import { FeedbackRuleEvaluator } from './FeedbackRuleEvaluator';
import { FeedbackRule } from './FeedbackRule';
import { FeedbackRuleComponent } from '../../feedbackRule/FeedbackRuleComponent';

const defaultFeedbackRules = [
  new FeedbackRule({
    id: '14ha07sykh',
    expression: 'isFinalSubmit',
    feedback: 'This is a generic response that is shown on a final submission'
  }),
  new FeedbackRule({
    id: '57vmi2nn9r',
    expression: 'isSecondToLastSubmit',
    feedback: 'This is a generic response that is shown on the second to last submission'
  }),
  new FeedbackRule({
    id: 'w73he0hwwt',
    expression: 'isNonScorable',
    feedback: 'isNonScorable'
  }),
  new FeedbackRule({
    id: 'ig6xhcv0if',
    expression: 'idea1 && idea2',
    feedback: 'You hit idea1 and idea2'
  }),
  new FeedbackRule({
    id: 'a9dck3r00h',
    expression: 'idea2 && idea3 && idea4',
    feedback: 'You hit idea2, idea3 and idea4'
  }),
  new FeedbackRule({
    id: 'zlh8oip6hp',
    expression: 'idea5 || idea6',
    feedback: 'You hit idea5 or idea6'
  }),
  new FeedbackRule({
    id: '08cffyudvd',
    expression: 'idea7 || idea8 && idea9',
    feedback: 'You hit idea7 or idea8 and idea9'
  }),
  new FeedbackRule({
    id: 'wron2aclbi',
    expression: 'idea7 && idea8 || idea9',
    feedback: 'You hit idea7 and idea8 or idea9'
  }),
  new FeedbackRule({
    id: 'enj6k184y7',
    expression: 'idea1',
    feedback: 'You hit idea1'
  }),
  new FeedbackRule({
    id: 'th3xlzbab2',
    expression: '!idea10',
    feedback: '!idea10'
  }),
  new FeedbackRule({
    id: 'd3plb1ki1t',
    expression: 'idea10 && !idea11',
    feedback: 'idea10 && !idea11'
  }),
  new FeedbackRule({
    id: '322szvaki6',
    expression: '!idea11 || idea12',
    feedback: '!idea11 || idea12'
  }),
  new FeedbackRule({
    id: 'vm4o1ms080',
    expression: 'isDefault',
    feedback: 'This is a default feedback'
  })
];
let evaluator: FeedbackRuleEvaluator;
const KI_SCORE_0 = new CRaterScore('ki', 0, 0, 1, 5);
const KI_SCORE_1 = new CRaterScore('ki', 1, 1, 1, 5);
const KI_SCORE_3 = new CRaterScore('ki', 3, 3, 1, 5);
const KI_SCORE_5 = new CRaterScore('ki', 5, 5, 1, 5);
const KI_SCORE_6 = new CRaterScore('ki', 6, 6, 1, 5);

describe('FeedbackRuleEvaluator', () => {
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
    evaluator = new FeedbackRuleEvaluator(new FeedbackRuleComponent(defaultFeedbackRules, 5, true));
  });
  matchRule_OneIdea();
  matchRule_MultipleIdeasUsingAnd();
  matchRule_MultipleIdeasUsingOr();
  matchRule_MultipleIdeasUsingAndOr();
  matchRule_MultipleIdeasUsingNotAndOr();
  matchRule_hasKIScore();
  matchRule_ideaCount();
  matchNoRule_ReturnDefault();
  matchNoRule_NoDefaultFeedbackAuthored_ReturnApplicationDefault();
  secondToLastSubmit();
  finalSubmit();
  nonScorable();
});

function matchRule_OneIdea() {
  it('should find first rule matching one idea', () => {
    expectFeedback(['idea1'], [KI_SCORE_1], 1, 'You hit idea1');
  });
}

function matchRule_MultipleIdeasUsingAnd() {
  it('should find rule matching two ideas using && operator', () => {
    expectFeedback(['idea1', 'idea2'], [KI_SCORE_1], 1, 'You hit idea1 and idea2');
    expectFeedback(['idea2', 'idea3', 'idea4'], [KI_SCORE_1], 1, 'You hit idea2, idea3 and idea4');
  });
}

function matchRule_MultipleIdeasUsingOr() {
  it('should find rule matching ideas using || operator', () => {
    expectFeedback(['idea5'], [KI_SCORE_1], 1, 'You hit idea5 or idea6');
  });
}

function matchRule_MultipleIdeasUsingAndOr() {
  it('should find rule matching ideas using combination of && and || operators', () => {
    expectFeedback(['idea7', 'idea9'], [KI_SCORE_1], 1, 'You hit idea7 or idea8 and idea9');
    expectFeedback(['idea8', 'idea9'], [KI_SCORE_1], 1, 'You hit idea7 or idea8 and idea9');
    expectFeedback(['idea7', 'idea8'], [KI_SCORE_1], 1, 'You hit idea7 and idea8 or idea9');
    expectFeedback(['idea9'], [KI_SCORE_1], 1, 'You hit idea7 and idea8 or idea9');
  });
}

function matchRule_MultipleIdeasUsingNotAndOr() {
  it('should find rule matching ideas using combination of !, && and || operators', () => {
    expectFeedback([], [KI_SCORE_1], 1, '!idea10');
    expectFeedback(['idea10'], [KI_SCORE_1], 1, 'idea10 && !idea11');
    expectFeedback(['idea10', 'idea11', 'idea12'], [KI_SCORE_1], 1, '!idea11 || idea12');
  });
}

function matchRule_hasKIScore() {
  describe('hasKIScore()', () => {
    beforeEach(() => {
      const feedbackRules = [
        new FeedbackRule({
          id: 'y4khoby3th',
          expression: 'hasKIScore(1)',
          feedback: 'hasKIScore(1)'
        }),
        new FeedbackRule({
          id: '58vuvj4o2m',
          expression: 'hasKIScore(3)',
          feedback: 'hasKIScore(3)'
        }),
        new FeedbackRule({
          id: '82xd4w3x34',
          expression: 'hasKIScore(5)',
          feedback: 'hasKIScore(5)'
        }),
        new FeedbackRule({
          id: 'mf6gt64j3i',
          expression: 'isDefault',
          feedback: 'isDefault'
        })
      ];
      evaluator = new FeedbackRuleEvaluator(new FeedbackRuleComponent(feedbackRules, 5, true));
    });
    matchRule_hasKIScoreScoreInRange_ShouldMatchRule();
    matchRule_hasKIScoreScoreNotInRange_ShouldNotMatchRule();
  });
}

function matchRule_hasKIScoreScoreInRange_ShouldMatchRule() {
  it('should match rule if KI score is in range [1-5]', () => {
    expectFeedback([], [KI_SCORE_1], 1, 'hasKIScore(1)');
    expectFeedback([], [KI_SCORE_3], 1, 'hasKIScore(3)');
    expectFeedback([], [KI_SCORE_5], 1, 'hasKIScore(5)');
  });
}

function matchRule_hasKIScoreScoreNotInRange_ShouldNotMatchRule() {
  it('should not match rule if KI score is out of range [1-5]', () => {
    expectFeedback([], [KI_SCORE_0], 1, 'isDefault');
    expectFeedback([], [KI_SCORE_6], 1, 'isDefault');
  });
}

function matchRule_ideaCount() {
  describe('ideaCount[MoreThan|Equals|LessThan]()', () => {
    beforeEach(() => {
      const feedbackRules = [
        new FeedbackRule({
          id: '1s4vbaqzvl',
          expression: 'ideaCountMoreThan(3)',
          feedback: 'ideaCountMoreThan(3)'
        }),
        new FeedbackRule({
          id: 'rea5xcyrzh',
          expression: 'ideaCountEquals(3)',
          feedback: 'ideaCountEquals(3)'
        }),
        new FeedbackRule({
          id: '6nethltk89',
          expression: 'ideaCountLessThan(3)',
          feedback: 'ideaCountLessThan(3)'
        })
      ];
      evaluator = new FeedbackRuleEvaluator(new FeedbackRuleComponent(feedbackRules, 5, true));
    });
    matchRule_ideaCount_MatchRulesBasedOnNumIdeasFound();
  });
}

function matchRule_ideaCount_MatchRulesBasedOnNumIdeasFound() {
  it('should match rules based on number of ideas found', () => {
    expectFeedback(['idea1', 'idea2', 'idea3', 'idea4'], [KI_SCORE_1], 1, 'ideaCountMoreThan(3)');
    expectFeedback(['idea1', 'idea2', 'idea3'], [KI_SCORE_1], 1, 'ideaCountEquals(3)');
    expectFeedback(['idea1', 'idea2'], [KI_SCORE_1], 1, 'ideaCountLessThan(3)');
  });
}

function matchNoRule_ReturnDefault() {
  it('should return default idea when no rule is matched', () => {
    expectFeedback(['idea10', 'idea11'], [KI_SCORE_1], 1, 'default feedback');
  });
}

function matchNoRule_NoDefaultFeedbackAuthored_ReturnApplicationDefault() {
  it(`should return application default rule when no rule is matched and no default is
      authored`, () => {
    evaluator = new FeedbackRuleEvaluator(new FeedbackRuleComponent([], 5, true));
    expectFeedback(['idea10', 'idea11'], [KI_SCORE_1], 1, evaluator.defaultFeedback);
  });
}

function secondToLastSubmit() {
  it('should return second to last submit rule when there is one submit left', () => {
    expectFeedback(['idea1'], [KI_SCORE_1], 4, 'second to last submission');
  });
}

function finalSubmit() {
  it('should return final submit rule when no more submits left', () => {
    expectFeedback(['idea1'], [KI_SCORE_1], 5, 'final submission');
  });
}

function nonScorable() {
  it('should return non-scorable rule when the item is not scorable', () => {
    expectFeedback([], [new CRaterScore('nonscorable', 1, 1, 1, 5)], 1, 'isNonScorable');
  });
}

function expectFeedback(
  ideas: string[],
  scores: CRaterScore[],
  submitCounter: number,
  expectedFeedback: string
) {
  const rule = getFeedbackRule(ideas, scores, submitCounter);
  expect(rule.feedback).toContain(expectedFeedback);
}

function getFeedbackRule(
  ideas: string[],
  scores: CRaterScore[],
  submitCounter: number
): FeedbackRule {
  return evaluator.getFeedbackRule(createCRaterResponse(ideas, scores, submitCounter));
}

function createCRaterResponse(
  ideas: string[],
  scores: CRaterScore[],
  submitCounter: number
): CRaterResponse {
  const response = new CRaterResponse();
  response.ideas = ideas.map((idea) => {
    return new CRaterIdea(idea, true);
  });
  response.scores = scores;
  response.submitCounter = submitCounter;
  return response;
}
