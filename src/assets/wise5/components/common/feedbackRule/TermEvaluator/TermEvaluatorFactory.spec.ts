import { HasKIScoreTermEvaluator } from './HasKIScoreTermEvaluator';
import { IdeaCountTermEvaluator } from './IdeaCountTermEvaluator';
import { IdeaTermEvaluator } from './IdeaTermEvaluator';
import { TermEvaluatorFactory } from './TermEvaluatorFactory';

describe('TermEvaluatorFactory', () => {
  const factory = new TermEvaluatorFactory();
  describe('getTermEvaluator()', () => {
    it('should return correct evaluator', () => {
      [
        { term: 'hasKIScore(3)', instanceType: HasKIScoreTermEvaluator },
        { term: 'ideaCountMoreThan(1)', instanceType: IdeaCountTermEvaluator },
        { term: 'ideaCountEquals(3)', instanceType: IdeaCountTermEvaluator },
        { term: 'ideaCountLessThan(2)', instanceType: IdeaCountTermEvaluator },
        { term: '2', instanceType: IdeaTermEvaluator }
      ].forEach(({ term, instanceType }) => {
        expect(factory.getTermEvaluator(term) instanceof instanceType).toBeTrue();
      });
    });
  });
});
