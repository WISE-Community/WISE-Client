export class ConstraintRemovalCriteriaParams {
  choiceIds?: string;
  componentId?: string;
  fromNodeId?: string;
  requireAllCellsInARowToBeFilled?: boolean;
  requiredNumberOfFilledRows?: number;
  requiredNumberOfNotes?: number;
  requiredNumberOfWords?: number;
  requiredSubmitCount?: number;
  scores?: string[];
  tableHasHeaderRow?: boolean;
  toNodeId?: string;
  nodeId?: string;

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      this[key] = jsonObject[key];
    }
  }
}
