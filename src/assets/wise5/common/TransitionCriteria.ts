import { TransitionCriteriaParams } from './TransitionCriteriaParams';

export class TransitionCriteria {
  name: string;
  params: TransitionCriteriaParams;

  constructor(name: string, params: TransitionCriteriaParams) {
    this.name = name;
    this.params = params;
  }
}
