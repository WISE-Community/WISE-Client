import { ConstraintService } from '../../../../services/constraintService';
import { AccumulatedIdeaCountTermEvaluator } from './AccumulatedIdeaCountTermEvaluator';
import { MyChoiceChosenTermEvaluator } from './MyChoiceChosenTermEvaluator';
import { HasKIScoreTermEvaluator } from './HasKIScoreTermEvaluator';
import { IdeaCountTermEvaluator } from './IdeaCountTermEvaluator';
import { IdeaCountWithResponseIndexTermEvaluator } from './IdeaCountWithResponseIndexTermEvaluator';
import { IdeaTermEvaluator } from './IdeaTermEvaluator';
import { IsSubmitNumberEvaluator } from './IsSubmitNumberEvaluator';
import { TermEvaluator } from './TermEvaluator';

export class TermEvaluatorFactory {
  constructor(private constraintService: ConstraintService) {}

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
    } else if (TermEvaluator.isMyChoiceChosenTerm(term)) {
      evaluator = new MyChoiceChosenTermEvaluator(term);
    } else {
      evaluator = new IdeaTermEvaluator(term);
    }
    evaluator.setConstraintService(this.constraintService);
    return evaluator;
  }
}
