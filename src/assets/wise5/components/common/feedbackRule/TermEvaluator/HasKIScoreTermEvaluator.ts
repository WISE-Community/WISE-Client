import { CRaterResponse } from '../../cRater/CRaterResponse';
import { TermEvaluator } from './TermEvaluator';

export class HasKIScoreTermEvaluator extends TermEvaluator {
  expectedKIScore: number;

  constructor(term: string) {
    super(term);
    this.expectedKIScore = parseInt(term.match(/hasKIScore\((.*)\)/)[1]);
  }

  evaluate(response: CRaterResponse): boolean {
    return response.getKIScore() === this.expectedKIScore;
  }
}
