import { CRaterIdea } from '../../cRater/CRaterIdea';
import { CRaterResponse } from '../../cRater/CRaterResponse';
import { IdeaTermEvaluator } from './IdeaTermEvaluator';

describe('IdeaTermEvaluator', () => {
  describe('evaluate()', () => {
    const response_with_no_ideas = new CRaterResponse();
    const response_with_2_ideas = new CRaterResponse();
    response_with_2_ideas.ideas = [new CRaterIdea('1', true), new CRaterIdea('2', true)];
    it("should always return true if term is 'true'", () => {
      const evaluator_true = new IdeaTermEvaluator('true');
      expect(evaluator_true.evaluate(response_with_no_ideas)).toBeTrue();
      expect(evaluator_true.evaluate(response_with_2_ideas)).toBeTrue();
    });
    it('should return true iff idea term is found in the response', () => {
      const evaluator_idea1 = new IdeaTermEvaluator('1');
      expect(evaluator_idea1.evaluate(response_with_no_ideas)).toBeFalse();
      expect(evaluator_idea1.evaluate(response_with_2_ideas)).toBeTrue();
    });
  });
});
