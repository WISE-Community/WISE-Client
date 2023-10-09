import { CRaterResponse } from '../../cRater/CRaterResponse';
import { TermEvaluator } from './TermEvaluator';

export class IdeaTermEvaluator extends TermEvaluator {
  constructor(protected term: string) {
    super(term);
  }

  evaluate(response: CRaterResponse): boolean {
    return response.getDetectedIdeaNames().includes(this.term);
  }
}
