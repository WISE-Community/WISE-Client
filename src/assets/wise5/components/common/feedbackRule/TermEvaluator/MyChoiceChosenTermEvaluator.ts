import { Response } from '../Response';
import { TermEvaluator } from './TermEvaluator';

export class MyChoiceChosenTermEvaluator extends TermEvaluator {
  private choiceId: string;

  constructor(term: string) {
    super(term);
    this.choiceId = term.match(/myChoiceChosen\("(\w+)"\)/)[1];
  }

  evaluate(response: Response | Response[]): boolean {
    return this.constraintService.evaluateCriteria({
      name: 'choiceChosen',
      params: {
        nodeId: this.referenceComponent.nodeId,
        componentId: this.referenceComponent.id,
        choiceIds: this.choiceId
      }
    });
  }
}
