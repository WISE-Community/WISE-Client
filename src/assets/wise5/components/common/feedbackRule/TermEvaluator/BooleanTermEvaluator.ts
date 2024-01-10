import { Response } from '../Response';
import { TermEvaluator } from './TermEvaluator';

export class BooleanTermEvaluator extends TermEvaluator {
  constructor(protected term: string) {
    super(term);
  }

  evaluate(response: Response): boolean {
    /**
     * The term 'true' or 'false' is usually not authored, but is created and added to the termStack
     * by the application as it processes operator expressions like "&&", "||", and "!"
     * (see FeedbackRuleEvaluator.evaluateOperator()).
     * For example, if the student had ideas 1, 2 and 3, evaluating the postfix expression
     * ["1", "2", "&&", "3", "&&"] goes like this:
     * ["1", "2", "&&", "3", "&&"] => ["true", "3", "&&"] => ["true"] => true.
     */
    return this.term === 'true';
  }
}
