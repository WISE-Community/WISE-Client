import { MyChoiceChosenTermEvaluator } from './MyChoiceChosenTermEvaluator';
import { HasKIScoreTermEvaluator } from './HasKIScoreTermEvaluator';
import { IdeaCountTermEvaluator } from './IdeaCountTermEvaluator';
import { IdeaTermEvaluator } from './IdeaTermEvaluator';
import { IsSubmitNumberEvaluator } from './IsSubmitNumberEvaluator';
import { TermEvaluatorFactory } from './TermEvaluatorFactory';
import { AccumulatedIdeaCountTermEvaluator } from './AccumulatedIdeaCountTermEvaluator';
import { IsLowestWorkgroupIdInPeerGroupTermEvaluator } from './IsLowestWorkgroupIdInPeerGroupTermEvaluator';
import { BooleanTermEvaluator } from './BooleanTermEvaluator';

describe('TermEvaluatorFactory', () => {
  const factory = new TermEvaluatorFactory(null, null);
  describe('getTermEvaluator(term)', () => {
    [
      { term: 'true', evaluator: BooleanTermEvaluator },
      { term: 'false', evaluator: BooleanTermEvaluator },
      { term: 'hasKIScore(3)', evaluator: HasKIScoreTermEvaluator },
      { term: 'ideaCountMoreThan(1)', evaluator: IdeaCountTermEvaluator },
      { term: 'ideaCountEquals(3)', evaluator: IdeaCountTermEvaluator },
      { term: 'ideaCountLessThan(2)', evaluator: IdeaCountTermEvaluator },
      { term: 'isSubmitNumber(2)', evaluator: IsSubmitNumberEvaluator },
      { term: 'isSubmitNumber(23)', evaluator: IsSubmitNumberEvaluator },
      { term: 'accumulatedIdeaCountMoreThan(1)', evaluator: AccumulatedIdeaCountTermEvaluator },
      { term: 'accumulatedIdeaCountEquals(3)', evaluator: AccumulatedIdeaCountTermEvaluator },
      { term: 'accumulatedIdeaCountLessThan(2)', evaluator: AccumulatedIdeaCountTermEvaluator },
      { term: 'myChoiceChosen("1")', evaluator: MyChoiceChosenTermEvaluator },
      {
        term: 'isLowestWorkgroupIdInPeerGroup',
        evaluator: IsLowestWorkgroupIdInPeerGroupTermEvaluator
      },
      { term: '2', evaluator: IdeaTermEvaluator }
    ].forEach(({ term, evaluator }) => {
      describe(`term is ${term}`, () => {
        it(`returns ${evaluator.name}`, () => {
          expect(factory.getTermEvaluator(term) instanceof evaluator).toBeTrue();
        });
      });
    });
  });
});
