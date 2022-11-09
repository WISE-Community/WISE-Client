import { CRaterResponse } from '../../cRater/CRaterResponse';
import { CRaterScore } from '../../cRater/CRaterScore';
import { HasKIScoreTermEvaluator } from './HasKIScoreTermEvaluator';

describe('HasKIScoreTermEvaluator', () => {
  describe('evaluate()', () => {
    it('should check for matching KI score for single and multiple score responses', () => {
      const evaluator_KI_2 = new HasKIScoreTermEvaluator('hasKIScore(2)');
      const evaluator_KI_5 = new HasKIScoreTermEvaluator('hasKIScore(5)');
      const singleScoreResponse_KI_2 = new CRaterResponse();
      singleScoreResponse_KI_2.score = 2;
      const multipleScoreResponse_KI_2 = new CRaterResponse();
      multipleScoreResponse_KI_2.scores = [
        new CRaterScore('ki', 2, 2, 1, 5),
        new CRaterScore('dci', 1, 1, 1, 5)
      ];
      expect(evaluator_KI_2.evaluate(singleScoreResponse_KI_2)).toBeTrue();
      expect(evaluator_KI_5.evaluate(singleScoreResponse_KI_2)).toBeFalse();
      expect(evaluator_KI_2.evaluate(multipleScoreResponse_KI_2)).toBeTrue();
      expect(evaluator_KI_5.evaluate(multipleScoreResponse_KI_2)).toBeFalse();
    });
  });
});
