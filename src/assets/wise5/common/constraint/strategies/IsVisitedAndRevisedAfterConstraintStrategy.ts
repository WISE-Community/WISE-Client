import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class IsVisitedAndRevisedAfterConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    const isVisitedAfterNodeId = criteria.params.isVisitedAfterNodeId;
    const isRevisedAfterNodeId = criteria.params.isRevisedAfterNodeId;
    const isRevisedAfterComponentId = criteria.params.isRevisedAfterComponentId;
    const criteriaCreatedTimestamp = criteria.params.criteriaCreatedTimestamp;
    return this.dataService
      .getEvents()
      .some((event) =>
        this.isVisitedAndRevisedAfter(
          isVisitedAfterNodeId,
          isRevisedAfterNodeId,
          isRevisedAfterComponentId,
          event,
          criteriaCreatedTimestamp
        )
      );
  }

  private isVisitedAndRevisedAfter(
    visitNodeId: string,
    reviseNodeId: string,
    reviseComponentId: string,
    event: any,
    timestamp: any
  ): boolean {
    return (
      this.dataService.isNodeVisitedAfterTimestamp(event, visitNodeId, timestamp) &&
      this.dataService.hasWorkCreatedAfterTimestamp(
        reviseNodeId,
        reviseComponentId,
        event.clientSaveTime
      )
    );
  }
}
