import { CRaterResponse } from '../../cRater/CRaterResponse';
import { TermEvaluator } from './TermEvaluator';

export class IsSubmitNumberEvaluator extends TermEvaluator {
  expectedSubmitNumber: number;
  constructor(term: string) {
    super(term);
    this.expectedSubmitNumber = parseInt(term.match(/isSubmitNumber\((.*)\)/)[1]);
  }

  evaluate(response: CRaterResponse): boolean {
    return response.submitCounter === this.expectedSubmitNumber;
  }
}
