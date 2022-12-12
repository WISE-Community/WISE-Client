import { CRaterIdea } from '../../cRater/CRaterIdea';
import { CRaterResponse } from '../../cRater/CRaterResponse';
import { IdeaCountTermEvaluator } from './IdeaCountTermEvaluator';

const evaluator_more_than_2 = new IdeaCountTermEvaluator('ideaCountMoreThan(2)');
const evaluator_equals_2 = new IdeaCountTermEvaluator('ideaCountEquals(2)');
const evaluator_less_than_2 = new IdeaCountTermEvaluator('ideaCountLessThan(2)');
describe('IdeaCountTermEvaluator', () => {
  describe('evaluate()', () => {
    it('should check whether number of detected ideas meets criteria', () => {
      const idea1 = new CRaterIdea('1', true);
      const idea2 = new CRaterIdea('2', true);
      const idea3 = new CRaterIdea('3', true);
      const response_with_1_idea = new CRaterResponse();
      response_with_1_idea.ideas = [idea1];
      const response_with_2_ideas = new CRaterResponse();
      response_with_2_ideas.ideas = [idea1, idea2];
      const response_with_3_ideas = new CRaterResponse();
      response_with_3_ideas.ideas = [idea1, idea2, idea3];
      expectEvaluations(response_with_1_idea, false, false, true);
      expectEvaluations(response_with_2_ideas, false, true, false);
      expectEvaluations(response_with_3_ideas, true, false, false);
    });
  });
});

function expectEvaluations(
  response: CRaterResponse,
  expectedResultMoreThan2: boolean,
  expectedResultEquals2: boolean,
  expectedResultLessThan2: boolean
) {
  expect(evaluator_more_than_2.evaluate(response)).toBe(expectedResultMoreThan2);
  expect(evaluator_equals_2.evaluate(response)).toBe(expectedResultEquals2);
  expect(evaluator_less_than_2.evaluate(response)).toBe(expectedResultLessThan2);
}
