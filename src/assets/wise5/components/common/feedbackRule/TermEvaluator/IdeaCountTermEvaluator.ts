import { CRaterResponse } from '../../cRater/CRaterResponse';
import { AbstractIdeaCountTermEvaluator } from './AbstractIdeaCountTermEvaluator';

export class IdeaCountTermEvaluator extends AbstractIdeaCountTermEvaluator {
  constructor(term: string) {
    super(term, /ideaCount(.*)\((.*)\)/);
  }

  protected getDetectedIdeaCount(response: CRaterResponse): number {
    return response.getDetectedIdeaCount();
  }
}
