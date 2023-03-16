import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class IsVisitedConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    return this.dataService
      .getEvents()
      .some((event) => event.nodeId === criteria.params.nodeId && event.event === 'nodeEntered');
  }
}
