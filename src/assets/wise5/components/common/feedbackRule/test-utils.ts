import { CRaterIdea } from '../cRater/CRaterIdea';
import { CRaterResponse } from '../cRater/CRaterResponse';
import { CRaterScore } from '../cRater/CRaterScore';
import { FeedbackRule } from './FeedbackRule';

export const KI_SCORE_0 = new CRaterScore('ki', 0, 0, 1, 5);
export const KI_SCORE_1 = new CRaterScore('ki', 1, 1, 1, 5);
export const KI_SCORE_3 = new CRaterScore('ki', 3, 3, 1, 5);
export const KI_SCORE_5 = new CRaterScore('ki', 5, 5, 1, 5);
export const KI_SCORE_6 = new CRaterScore('ki', 6, 6, 1, 5);

export const DEFAULT_FEEDBACK_RULES = [
  new FeedbackRule({
    id: 'finalSubmit',
    expression: 'isFinalSubmit',
    feedback: 'This is a generic response that is shown on a final submission'
  }),
  new FeedbackRule({
    id: 'secondToLastSubmit',
    expression: 'isSecondToLastSubmit',
    feedback: 'This is a generic response that is shown on the second to last submission'
  }),
  new FeedbackRule({
    id: 'thirdSubmit',
    expression: 'isSubmitNumber(3)',
    feedback: 'Is third submit'
  }),
  new FeedbackRule({
    id: 'isNonScorable',
    expression: 'isNonScorable',
    feedback: 'isNonScorable'
  }),
  new FeedbackRule({
    id: 'idea1 && idea2',
    expression: 'idea1 && idea2',
    feedback: 'You hit idea1 and idea2'
  }),
  new FeedbackRule({
    id: 'idea2 && idea3 && idea4',
    expression: 'idea2 && idea3 && idea4',
    feedback: 'You hit idea2, idea3 and idea4'
  }),
  new FeedbackRule({
    id: 'zlh8oip6hp',
    expression: 'idea5 || idea6',
    feedback: 'You hit idea5 or idea6'
  }),
  new FeedbackRule({
    id: 'idea7 || idea8 && idea9',
    expression: 'idea7 || idea8 && idea9',
    feedback: 'You hit idea7 or idea8 and idea9'
  }),
  new FeedbackRule({
    id: 'idea7 && idea8 || idea9',
    expression: 'idea7 && idea8 || idea9',
    feedback: 'You hit idea7 and idea8 or idea9'
  }),
  new FeedbackRule({
    id: 'idea1',
    expression: 'idea1',
    feedback: 'You hit idea1'
  }),
  new FeedbackRule({
    id: '!idea10',
    expression: '!idea10',
    feedback: '!idea10'
  }),
  new FeedbackRule({
    id: 'idea10 && !idea11',
    expression: 'idea10 && !idea11',
    feedback: 'idea10 && !idea11'
  }),
  new FeedbackRule({
    id: '!idea11 || idea12',
    expression: '!idea11 || idea12',
    feedback: '!idea11 || idea12'
  }),
  new FeedbackRule({
    id: 'default',
    expression: 'isDefault',
    feedback: 'This is a default feedback'
  })
];

export const HAS_KI_SCORE_FEEDBACK_RULES = [
  new FeedbackRule({
    id: 'hasKIScore(1)',
    expression: 'hasKIScore(1)',
    feedback: 'hasKIScore(1)'
  }),
  new FeedbackRule({
    id: 'hasKIScore(3)',
    expression: 'hasKIScore(3)',
    feedback: 'hasKIScore(3)'
  }),
  new FeedbackRule({
    id: 'hasKIScore(5)',
    expression: 'hasKIScore(5)',
    feedback: 'hasKIScore(5)'
  }),
  new FeedbackRule({
    id: 'default',
    expression: 'isDefault',
    feedback: 'isDefault'
  })
];

export function createCRaterResponse(
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
