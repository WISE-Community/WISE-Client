import { CRaterResponse } from '../../cRater/CRaterResponse';

export abstract class TermEvaluator {
  constructor(protected term: string) {}
  abstract evaluate(response: CRaterResponse | CRaterResponse[]): boolean;

  static isAccumulatedIdeaCountTerm(term: string): boolean {
    return /accumulatedIdeaCount(MoreThan|Equals|LessThan)\([\d+]\)/.test(term);
  }

  static isHasKIScoreTerm(term: string): boolean {
    return /hasKIScore\([1-5]\)/.test(term);
  }

  static isIdeaCountTerm(term: string): boolean {
    return /ideaCount(MoreThan|Equals|LessThan)\([\d+]\)/.test(term);
  }

  static isSubmitNumberTerm(term: string): boolean {
    return /isSubmitNumber\(\d+\)/.test(term);
  }
}
