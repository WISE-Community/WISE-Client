import { EvaluateConstraintContext } from '../EvaluateConstraintContext';

export interface ConstraintStrategy {
  evaluate(criteria: any): boolean;
  setContext(context: EvaluateConstraintContext): void;
}
