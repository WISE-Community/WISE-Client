import { CRaterResponse } from '../../cRater/CRaterResponse';
import { TermEvaluator } from './TermEvaluator';

export abstract class AbstractIdeaCountTermEvaluator extends TermEvaluator {
  comparer: 'MoreThan' | 'Equals' | 'LessThan';
  expectedIdeaCount: number;

  constructor(term: string, matcher: RegExp) {
    super(term);
    const matches = term.match(matcher);
    this.comparer = matches[1] as 'MoreThan' | 'Equals' | 'LessThan';
    this.expectedIdeaCount = parseInt(matches[2]);
  }

  evaluate(response: CRaterResponse | CRaterResponse[]): boolean {
    const detectedIdeaCount = this.getDetectedIdeaCount(response);
    switch (this.comparer) {
      case 'MoreThan':
        return detectedIdeaCount > this.expectedIdeaCount;
      case 'Equals':
        return detectedIdeaCount === this.expectedIdeaCount;
      case 'LessThan':
        return detectedIdeaCount < this.expectedIdeaCount;
    }
  }

  protected abstract getDetectedIdeaCount(response: CRaterResponse | CRaterResponse[]): number;
}
