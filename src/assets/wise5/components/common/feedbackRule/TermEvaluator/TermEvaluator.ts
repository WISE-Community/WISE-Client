import { ConstraintService } from '../../../../services/constraintService';
import { CRaterResponse } from '../../cRater/CRaterResponse';

export abstract class TermEvaluator {
  protected constraintService: ConstraintService;

  constructor(protected term: string) {}
  abstract evaluate(response: CRaterResponse | CRaterResponse[]): boolean;

  static isAccumulatedIdeaCountTerm(term: string): boolean {
    return /accumulatedIdeaCount(MoreThan|Equals|LessThan)\([\d+]\)/.test(term);
  }

  static isChoseChoiceTerm(term: string): boolean {
    return /choseChoice\("\w+",\s*"\w+",\s*"\w+"\)/.test(term);
  }

  static isHasKIScoreTerm(term: string): boolean {
    return /hasKIScore\([1-5]\)/.test(term);
  }

  static isIdeaCountTerm(term: string): boolean {
    return /ideaCount(MoreThan|Equals|LessThan)\([\d+]\)/.test(term);
  }

  static isIdeaCountWithResponseIndexTerm(term: string): boolean {
    return /ideaCount(MoreThan|Equals|LessThan)\(\d+,\s*\d+\)/.test(term);
  }

  static isSubmitNumberTerm(term: string): boolean {
    return /isSubmitNumber\(\d+\)/.test(term);
  }

  static requiresAllResponses(term: string): boolean {
    return (
      TermEvaluator.isAccumulatedIdeaCountTerm(term) ||
      TermEvaluator.isIdeaCountWithResponseIndexTerm(term)
    );
  }

  setConstraintService(service: ConstraintService) {
    this.constraintService = service;
  }
}
