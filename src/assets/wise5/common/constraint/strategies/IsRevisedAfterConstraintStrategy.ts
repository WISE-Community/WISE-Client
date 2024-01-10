import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class IsRevisedAfterConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    const latestComponentStateForComponent = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
      criteria.params.isRevisedAfterNodeId,
      criteria.params.isRevisedAfterComponentId
    );
    return (
      latestComponentStateForComponent != null &&
      latestComponentStateForComponent.clientSaveTime > criteria.params.criteriaCreatedTimestamp
    );
  }
}
