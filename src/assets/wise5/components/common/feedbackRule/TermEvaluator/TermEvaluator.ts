import { CRaterResponse } from '../../cRater/CRaterResponse';

export abstract class TermEvaluator {
  constructor(protected term: string) {}
  abstract evaluate(response: CRaterResponse): boolean;
}
