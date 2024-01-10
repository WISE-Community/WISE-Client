import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class ChoiceChosenConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    const service = this.componentServiceLookupService.getService('MultipleChoice');
    const latestComponentState = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
      criteria.params.nodeId,
      criteria.params.componentId
    );
    return latestComponentState != null && service.choiceChosen(criteria, latestComponentState);
  }
}
