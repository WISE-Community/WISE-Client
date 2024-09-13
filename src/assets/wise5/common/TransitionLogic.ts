import { Transition } from './Transition';
import { TransitionCriteria } from './TransitionCriteria';
import { TransitionCriteriaParams } from './TransitionCriteriaParams';

export class TransitionLogic {
  canChangePath?: boolean;
  howToChooseAmongAvailablePaths?: string;
  maxPathsVisitable?: number;
  transitions: Transition[];
  whenToChoosePath?: string;

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      if (key === 'transitions') {
        this.transitions = jsonObject[key].map(
          (transition: any) =>
            new Transition(
              transition.to,
              transition.criteria?.map(
                (criteria: any) =>
                  new TransitionCriteria(
                    criteria.name,
                    new TransitionCriteriaParams(criteria.params)
                  )
              )
            )
        );
      } else {
        this[key] = jsonObject[key];
      }
    }
  }
}
