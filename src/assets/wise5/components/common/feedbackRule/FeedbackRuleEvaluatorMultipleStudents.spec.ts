import { CRaterResponse } from '../cRater/CRaterResponse';
import { FeedbackRuleEvaluatorMultipleStudents } from './FeedbackRuleEvaluatorMultipleStudents';
import {
  DEFAULT_FEEDBACK_RULES,
  HAS_KI_SCORE_FEEDBACK_RULES,
  KI_SCORE_1,
  KI_SCORE_3,
  KI_SCORE_5,
  KI_SCORE_6,
  createCRaterResponse
} from './test-utils';
import { FeedbackRuleComponent } from '../../feedbackRule/FeedbackRuleComponent';

let evaluator: FeedbackRuleEvaluatorMultipleStudents;
describe('FeedbackRuleEvaluatorMultipleStudents', () => {
  beforeEach(() => {
    evaluator = new FeedbackRuleEvaluatorMultipleStudents(
      new FeedbackRuleComponent(DEFAULT_FEEDBACK_RULES, 5, true),
      null
    );
  });
  matchRules_OneIdea();
  matchRules_HasKIScore();
  matchNoRule_ReturnDefault();
  matchNoRule_NoDefaultFeedbackAuthored_ReturnApplicationDefault();
  thirdSubmit();
});

function matchRules_OneIdea() {
  it('should find all rules matching one idea', () => {
    expectRules(
      [createCRaterResponse(['idea1'], [KI_SCORE_1], 1)],
      ['idea1', '!idea10', '!idea11 || idea12']
    );
  });
}

function matchRules_HasKIScore() {
  describe('hasKIScoreScore', () => {
    beforeEach(() => {
      evaluator = new FeedbackRuleEvaluatorMultipleStudents(
        new FeedbackRuleComponent(HAS_KI_SCORE_FEEDBACK_RULES, 5, true),
        null
      );
    });
    matchRules_hasKIScoreScoreInRange_ShouldMatchRule();
    matchRules_hasKIScoreScoreNotInRange_ShouldReturnDefaultRule();
  });
}

function matchRules_hasKIScoreScoreInRange_ShouldMatchRule() {
  it('should match all rules if KI score is in range [1-5]', () => {
    expectRules([createCRaterResponse([], [KI_SCORE_1], 1)], ['hasKIScore(1)']);
    expectRules([createCRaterResponse([], [KI_SCORE_3], 1)], ['hasKIScore(3)']);
    expectRules([createCRaterResponse([], [KI_SCORE_5], 1)], ['hasKIScore(5)']);
  });
}

function matchRules_hasKIScoreScoreNotInRange_ShouldReturnDefaultRule() {
  it('should not match rule if KI score is out of range [1-5]', () => {
    expectRules([createCRaterResponse([], [KI_SCORE_6], 1)], ['default']);
  });
}

function matchNoRule_ReturnDefault() {
  it('should return default idea when no rule is matched', () => {
    expectRules([createCRaterResponse(['idea10', 'idea11'], [KI_SCORE_1], 1)], ['default']);
  });
}

function matchNoRule_NoDefaultFeedbackAuthored_ReturnApplicationDefault() {
  it(`should return application default rule when no rule is matched and no default is
      authored`, () => {
    evaluator = new FeedbackRuleEvaluatorMultipleStudents(
      new FeedbackRuleComponent([], 5, true),
      null
    );
    expectRules([createCRaterResponse(['idea10', 'idea11'], [KI_SCORE_1], 1)], ['default']);
  });
}

function thirdSubmit() {
  it('should return third submit rule when this is the third submit', () => {
    expectRules(
      [createCRaterResponse([], [KI_SCORE_1], 3)],
      ['thirdSubmit', '!idea10', '!idea11 || idea12']
    );
  });
}

function expectRules(response: CRaterResponse[], expectedRuleIds: string[]): void {
  const matchedRules = evaluator.getFeedbackRules(response);
  expect(matchedRules.map((rule) => rule.id)).toEqual(expectedRuleIds);
}
