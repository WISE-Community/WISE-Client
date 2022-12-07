import { HasKIScoreTermEvaluator } from './HasKIScoreTermEvaluator';
import { IdeaCountTermEvaluator } from './IdeaCountTermEvaluator';
import { IdeaTermEvaluator } from './IdeaTermEvaluator';
import { IsSubmitNumberEvaluator } from './IsSubmitNumberEvaluator';
import { TermEvaluator } from './TermEvaluator';

export class TermEvaluatorFactory {
  getTermEvaluator(term: string): TermEvaluator {
    let evaluator: TermEvaluator;
    if (this.isHasKIScoreTerm(term)) {
      evaluator = new HasKIScoreTermEvaluator(term);
    } else if (this.isIdeaCountTerm(term)) {
      evaluator = new IdeaCountTermEvaluator(term);
    } else if (this.isSubmitNumberTerm(term)) {
      evaluator = new IsSubmitNumberEvaluator(term);
    } else {
      evaluator = new IdeaTermEvaluator(term);
    }
    return evaluator;
  }

  private isHasKIScoreTerm(term: string): boolean {
    return /hasKIScore\([1-5]\)/.test(term);
  }

  private isIdeaCountTerm(term: string): boolean {
    return /ideaCount(MoreThan|Equals|LessThan)\([\d+]\)/.test(term);
  }

  private isSubmitNumberTerm(term: string): boolean {
    return /isSubmitNumber\(\d+\)/.test(term);
  }
}
