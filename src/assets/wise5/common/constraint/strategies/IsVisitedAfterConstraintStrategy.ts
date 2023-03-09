import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class IsVisitedAfterConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    const isVisitedAfterNodeId = criteria.params.isVisitedAfterNodeId;
    const criteriaCreatedTimestamp = criteria.params.criteriaCreatedTimestamp;
    return this.dataService
      .getEvents()
      .some(
        (event) =>
          event.nodeId === isVisitedAfterNodeId &&
          event.event === 'nodeEntered' &&
          event.clientSaveTime > criteriaCreatedTimestamp
      );
  }
}
