import { CRaterResponse } from '../CRaterResponse';

export abstract class TermEvaluator {
  constructor(protected term: string) {}
  abstract evaluate(response: CRaterResponse): boolean;
}
