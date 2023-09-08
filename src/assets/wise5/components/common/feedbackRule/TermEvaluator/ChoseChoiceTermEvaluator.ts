import { CRaterResponse } from '../../cRater/CRaterResponse';
import { TermEvaluator } from './TermEvaluator';

export class ChoseChoiceTermEvaluator extends TermEvaluator {
  private nodeId: string;
  private componentId: string;
  private choiceId: string;

  constructor(term: string) {
    super(term);
    const matches = term.match(/choseChoice\("(\w+)",\s*"(\w+)",\s*"(\w+)"\)/);
    this.nodeId = matches[1];
    this.componentId = matches[2];
    this.choiceId = matches[3];
  }

  evaluate(response: CRaterResponse | CRaterResponse[]): boolean {
    return this.constraintService.evaluateCriteria({
      name: 'choiceChosen',
      params: {
        nodeId: this.nodeId,
        componentId: this.componentId,
        choiceIds: this.choiceId
      }
    });
  }
}
