import { TransitionCriteria } from './TransitionCriteria';

export class Transition {
  criteria?: TransitionCriteria[];
  to: string;

  constructor(to: string, criteria?: TransitionCriteria[]) {
    this.to = to;
    if (criteria != null) {
      this.criteria = criteria;
    }
  }
}
