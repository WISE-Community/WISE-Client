import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class UsedXSubmitsConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    const componentStates = this.dataService.getComponentStatesByNodeIdAndComponentId(
      criteria.params.nodeId,
      criteria.params.componentId
    );
    return this.getSubmitCount(componentStates) >= criteria.params.requiredSubmitCount;
  }

  private getSubmitCount(componentStates: any[]): number {
    /*
     * We are counting with two submit counters for backwards compatibility.
     * Some componentStates only have isSubmit=true and do not keep an
     * updated submitCounter for the number of submits.
     */
    let manualSubmitCounter = 0;
    let highestSubmitCounter = 0;
    for (const componentState of componentStates) {
      if (componentState.isSubmit) {
        manualSubmitCounter++;
      }
      const studentData = componentState.studentData;
      if (studentData.submitCounter > highestSubmitCounter) {
        highestSubmitCounter = studentData.submitCounter;
      }
    }
    return Math.max(manualSubmitCounter, highestSubmitCounter);
  }
}
