import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class IsCompletedConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    return this.dataService.isCompleted(criteria.params.nodeId);
  }
}
