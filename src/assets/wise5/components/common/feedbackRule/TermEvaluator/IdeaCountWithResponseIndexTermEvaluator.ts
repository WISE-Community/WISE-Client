import { CRaterResponse } from '../../cRater/CRaterResponse';
import { AbstractIdeaCountTermEvaluator } from './AbstractIdeaCountTermEvaluator';

export class IdeaCountWithResponseIndexTermEvaluator extends AbstractIdeaCountTermEvaluator {
  responseIndex: number;

  constructor(term: string) {
    super(term, /ideaCount(.*)\((\d+),\s*(\d+)\)/);
    this.responseIndex = parseInt(this.matches[3]) - 1; // authored index starts at 1
  }

  evaluate(responses: CRaterResponse[]): boolean {
    return responses.length <= this.responseIndex ? false : super.evaluate(responses);
  }

  protected getDetectedIdeaCount(responses: CRaterResponse[]): number {
    return responses[this.responseIndex].getDetectedIdeaCount();
  }
}
