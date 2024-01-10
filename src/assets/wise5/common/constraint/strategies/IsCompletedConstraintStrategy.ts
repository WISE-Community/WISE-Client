import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class IsCompletedConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    return this.completionService.isCompleted(criteria.params.nodeId, criteria.params.componentId);
  }
}
