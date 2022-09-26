import { CRaterResponse } from '../../cRater/CRaterResponse';
import { TermEvaluator } from './TermEvaluator';

export class IdeaCountTermEvaluator extends TermEvaluator {
  comparer: string;
  expectedIdeaCount: number;

  constructor(term: string) {
    super(term);
    const matches = term.match(/ideaCount(.*)\((.*)\)/);
    this.comparer = matches[1];
    this.expectedIdeaCount = parseInt(matches[2]);
  }

  evaluate(response: CRaterResponse): boolean {
    switch (this.comparer) {
      case 'MoreThan':
        return response.getDetectedIdeaCount() > this.expectedIdeaCount;
      case 'Equals':
        return response.getDetectedIdeaCount() === this.expectedIdeaCount;
      case 'LessThan':
        return response.getDetectedIdeaCount() < this.expectedIdeaCount;
    }
  }
}
