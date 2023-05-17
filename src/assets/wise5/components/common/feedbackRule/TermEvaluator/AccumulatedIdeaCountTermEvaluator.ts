import { CRaterResponse } from '../../cRater/CRaterResponse';
import { AbstractIdeaCountTermEvaluator } from './AbstractIdeaCountTermEvaluator';

export class AccumulatedIdeaCountTermEvaluator extends AbstractIdeaCountTermEvaluator {
  constructor(term: string) {
    super(term, /accumulatedIdeaCount(.*)\((.*)\)/);
  }

  protected getDetectedIdeaCount(responses: CRaterResponse[]): number {
    return new Set(responses.flatMap((response) => response.getDetectedIdeaNames())).size;
  }
}
