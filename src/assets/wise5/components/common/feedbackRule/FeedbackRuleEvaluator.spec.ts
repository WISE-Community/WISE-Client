import { CRaterScore } from '../cRater/CRaterScore';
import { FeedbackRuleEvaluator } from './FeedbackRuleEvaluator';
import { FeedbackRule } from './FeedbackRule';
import { FeedbackRuleComponent } from '../../feedbackRule/FeedbackRuleComponent';
import {
  DEFAULT_FEEDBACK_RULES,
  HAS_KI_SCORE_FEEDBACK_RULES,
  KI_SCORE_0,
  KI_SCORE_1,
  KI_SCORE_3,
  KI_SCORE_5,
  KI_SCORE_6,
  createCRaterResponse
} from './test-utils';
import { CRaterResponse } from '../cRater/CRaterResponse';

let evaluator: FeedbackRuleEvaluator<CRaterResponse[]>;
describe('FeedbackRuleEvaluator', () => {
  beforeEach(() => {
    evaluator = new FeedbackRuleEvaluator(
      new FeedbackRuleComponent(DEFAULT_FEEDBACK_RULES, 5, true),
      null,
      null
    );
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
  thirdSubmit();
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
      evaluator = new FeedbackRuleEvaluator(
        new FeedbackRuleComponent(HAS_KI_SCORE_FEEDBACK_RULES, 5, true),
        null,
        null
      );
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
      evaluator = new FeedbackRuleEvaluator(
        new FeedbackRuleComponent(feedbackRules, 5, true),
        null,
        null
      );
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
    evaluator = new FeedbackRuleEvaluator(new FeedbackRuleComponent([], 5, true), null, null);
    expectFeedback(['idea10', 'idea11'], [KI_SCORE_1], 1, evaluator.defaultFeedback);
  });
}

function thirdSubmit() {
  it('should return third submit rule when this is the third submit', () => {
    expectFeedback([], [KI_SCORE_1], 3, 'Is third submit');
  });
}

function secondToLastSubmit() {
  it('should return second to last submit rule when there is one submit left', () => {
    expectFeedback([], [KI_SCORE_1], 4, 'second to last submission');
  });
}

function finalSubmit() {
  it('should return final submit rule when no more submits left', () => {
    expectFeedback([], [KI_SCORE_1], 5, 'final submission');
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
  const rule = evaluator.getFeedbackRule([createCRaterResponse(ideas, scores, submitCounter)]);
  expect(rule.feedback).toContain(expectedFeedback);
}
