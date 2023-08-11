import { AccumulatedIdeaCountTermEvaluator } from './AccumulatedIdeaCountTermEvaluator';
import { HasKIScoreTermEvaluator } from './HasKIScoreTermEvaluator';
import { IdeaCountTermEvaluator } from './IdeaCountTermEvaluator';
import { IdeaCountWithResponseIndexTermEvaluator } from './IdeaCountWithResponseIndexTermEvaluator';
import { IdeaTermEvaluator } from './IdeaTermEvaluator';
import { IsSubmitNumberEvaluator } from './IsSubmitNumberEvaluator';
import { TermEvaluator } from './TermEvaluator';

export class TermEvaluatorFactory {
  getTermEvaluator(term: string): TermEvaluator {
    let evaluator: TermEvaluator;
    if (TermEvaluator.isHasKIScoreTerm(term)) {
      evaluator = new HasKIScoreTermEvaluator(term);
    } else if (TermEvaluator.isIdeaCountTerm(term)) {
      evaluator = new IdeaCountTermEvaluator(term);
    } else if (TermEvaluator.isIdeaCountWithResponseIndexTerm(term)) {
      evaluator = new IdeaCountWithResponseIndexTermEvaluator(term);
    } else if (TermEvaluator.isSubmitNumberTerm(term)) {
      evaluator = new IsSubmitNumberEvaluator(term);
    } else if (TermEvaluator.isAccumulatedIdeaCountTerm(term)) {
      evaluator = new AccumulatedIdeaCountTermEvaluator(term);
    } else {
      evaluator = new IdeaTermEvaluator(term);
    }
    return evaluator;
  }
}
