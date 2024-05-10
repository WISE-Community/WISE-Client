import { ConstraintRemovalCriteriaParams } from './ConstraintRemovalCriteriaParams';

export class ConstraintRemovalCriteria {
  name: string;
  params: ConstraintRemovalCriteriaParams;

  constructor(name: string, params: ConstraintRemovalCriteriaParams) {
    this.name = name;
    this.params = params;
  }
}
