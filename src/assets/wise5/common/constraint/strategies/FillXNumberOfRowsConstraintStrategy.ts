import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class FillXNumberOfRowsConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    const componentState = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
      criteria.params.nodeId,
      criteria.params.componentId
    );
    const tableService = this.componentServiceLookupService.getService('Table');
    return (
      componentState != null &&
      tableService.hasRequiredNumberOfFilledRows(
        componentState,
        criteria.params.requiredNumberOfFilledRows,
        criteria.params.tableHasHeaderRow,
        criteria.params.requireAllCellsInARowToBeFilled
      )
    );
  }
}
