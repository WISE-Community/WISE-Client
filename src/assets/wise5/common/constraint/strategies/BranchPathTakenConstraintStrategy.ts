import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class BranchPathTakenConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    const branchPathTakenEvents = this.dataService.getBranchPathTakenEventsByNodeId(
      criteria.params.fromNodeId
    );
    return branchPathTakenEvents.some(
      (event) =>
        event.data.fromNodeId === criteria.params.fromNodeId &&
        event.data.toNodeId === criteria.params.toNodeId
    );
  }
}
