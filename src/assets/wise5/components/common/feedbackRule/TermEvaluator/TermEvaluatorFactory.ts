import { ConstraintService } from '../../../../services/constraintService';
import { AccumulatedIdeaCountTermEvaluator } from './AccumulatedIdeaCountTermEvaluator';
import { MyChoiceChosenTermEvaluator } from './MyChoiceChosenTermEvaluator';
import { HasKIScoreTermEvaluator } from './HasKIScoreTermEvaluator';
import { IdeaCountTermEvaluator } from './IdeaCountTermEvaluator';
import { IdeaCountWithResponseIndexTermEvaluator } from './IdeaCountWithResponseIndexTermEvaluator';
import { IdeaTermEvaluator } from './IdeaTermEvaluator';
import { IsSubmitNumberEvaluator } from './IsSubmitNumberEvaluator';
import { TermEvaluator } from './TermEvaluator';
import { ConfigService } from '../../../../services/configService';
import { IsLowestWorkgroupIdInPeerGroupTermEvaluator } from './IsLowestWorkgroupIdInPeerGroupTermEvaluator';
import { BooleanTermEvaluator } from './BooleanTermEvaluator';

export class TermEvaluatorFactory {
  constructor(private configService: ConfigService, private constraintService: ConstraintService) {}

  getTermEvaluator(term: string): TermEvaluator {
    let evaluator: TermEvaluator;
    if (TermEvaluator.isBooleanTerm(term)) {
      evaluator = new BooleanTermEvaluator(term);
    } else if (TermEvaluator.isHasKIScoreTerm(term)) {
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
    } else if (TermEvaluator.isLowestWorkgroupIdInPeerGroupTerm(term)) {
      evaluator = new IsLowestWorkgroupIdInPeerGroupTermEvaluator(term);
    } else {
      evaluator = new IdeaTermEvaluator(term);
    }
    evaluator.setConfigService(this.configService);
    evaluator.setConstraintService(this.constraintService);
    return evaluator;
  }
}
