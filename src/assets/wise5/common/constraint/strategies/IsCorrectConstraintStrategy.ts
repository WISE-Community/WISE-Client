import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class IsCorrectConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    const componentStates = this.dataService.getComponentStatesByNodeIdAndComponentId(
      criteria.params.nodeId,
      criteria.params.componentId
    );
    return componentStates.some((componentState) => componentState.studentData.isCorrect);
  }
}
