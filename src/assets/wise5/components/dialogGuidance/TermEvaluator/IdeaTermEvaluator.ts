import { CRaterResponse } from '../CRaterResponse';
import { TermEvaluator } from './TermEvaluator';

export class IdeaTermEvaluator extends TermEvaluator {
  constructor(protected term: string) {
    super(term);
  }

  evaluate(response: CRaterResponse): boolean {
    return this.term === 'true' || response.getDetectedIdeaNames().includes(this.term);
  }
}
