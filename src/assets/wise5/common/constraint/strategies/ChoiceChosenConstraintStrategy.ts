import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class ChoiceChosenConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    const latestComponentState = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
      criteria.params.nodeId,
      criteria.params.componentId
    );
    return latestComponentState != null && this.isChoiceChosen(criteria, latestComponentState);
  }

  private isChoiceChosen(criteria: any, componentState: any): boolean {
    const studentChoiceIds = componentState.studentData.studentChoices.map(
      (choice: any) => choice.id
    );
    return studentChoiceIds.includes(criteria.params.choiceIds);
  }
}
