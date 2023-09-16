import { MyChoiceChosenTermEvaluator } from './MyChoiceChosenTermEvaluator';
import { HasKIScoreTermEvaluator } from './HasKIScoreTermEvaluator';
import { IdeaCountTermEvaluator } from './IdeaCountTermEvaluator';
import { IdeaTermEvaluator } from './IdeaTermEvaluator';
import { IsSubmitNumberEvaluator } from './IsSubmitNumberEvaluator';
import { TermEvaluatorFactory } from './TermEvaluatorFactory';

describe('TermEvaluatorFactory', () => {
  const factory = new TermEvaluatorFactory(null, null);
  describe('getTermEvaluator()', () => {
    it('should return correct evaluator', () => {
      [
        {
          term: 'myChoiceChosen("choice1")',
          instanceType: MyChoiceChosenTermEvaluator
        },
        { term: 'hasKIScore(3)', instanceType: HasKIScoreTermEvaluator },
        { term: 'ideaCountMoreThan(1)', instanceType: IdeaCountTermEvaluator },
        { term: 'ideaCountEquals(3)', instanceType: IdeaCountTermEvaluator },
        { term: 'ideaCountLessThan(2)', instanceType: IdeaCountTermEvaluator },
        { term: 'isSubmitNumber(2)', instanceType: IsSubmitNumberEvaluator },
        { term: 'isSubmitNumber(23)', instanceType: IsSubmitNumberEvaluator },
        { term: '2', instanceType: IdeaTermEvaluator }
      ].forEach(({ term, instanceType }) => {
        expect(factory.getTermEvaluator(term) instanceof instanceType).toBeTrue();
      });
    });
  });
});
