import { copy } from '../../assets/wise5/common/object/object';
import { TransitionLogic } from '../../assets/wise5/common/TransitionLogic';

export function expectTransitionLogic(node: any, transitionLogic: TransitionLogic) {
  expect(copy(node.transitionLogic)).toEqual(copy(transitionLogic));
}

export function expectConstraint(
  constraint: any,
  expectedAction: string,
  expectedTargetId: string,
  expectedRemovalCriteria: any[]
) {
  expect(constraint.action).toEqual(expectedAction);
  expect(constraint.targetId).toEqual(expectedTargetId);
  for (let i = 0; i < expectedRemovalCriteria.length; i++) {
    expect(copy(constraint.removalCriteria[i])).toEqual(copy(expectedRemovalCriteria[i]));
  }
}
