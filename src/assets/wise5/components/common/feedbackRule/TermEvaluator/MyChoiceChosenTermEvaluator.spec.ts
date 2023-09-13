import { Component } from '../../../../common/Component';
import { ComponentContent } from '../../../../common/ComponentContent';
import { ConstraintService } from '../../../../services/constraintService';
import { CRaterResponse } from '../../cRater/CRaterResponse';
import { MyChoiceChosenTermEvaluator } from './MyChoiceChosenTermEvaluator';

class ConstraintServiceStub {
  evaluateCriteria(criteria: any): boolean {
    return true;
  }
}

describe('MyChoiceChosenTermEvaluator', () => {
  let evaluator1, mockConstraintService;
  beforeEach(() => {
    evaluator1 = new MyChoiceChosenTermEvaluator('myChoiceChosen("choice1")');
    evaluator1.setReferenceComponent(
      new Component({ id: 'componentA' } as ComponentContent, 'node1')
    );
    mockConstraintService = new ConstraintServiceStub();
    evaluator1.setConstraintService(mockConstraintService as ConstraintService);
  });
  describe('evaluate()', () => {
    [
      { description: 'choice is chosen', choiceChosen: true, expected: true },
      { description: 'choice is not chosen', choiceChosen: false, expected: false }
    ].forEach(({ description, choiceChosen, expected }) => {
      describe(description, () => {
        beforeEach(() => {
          spyOn(mockConstraintService, 'evaluateCriteria').and.returnValue(choiceChosen);
        });
        it(`returns ${expected}`, () => {
          expect(evaluator1.evaluate(new CRaterResponse())).toEqual(expected);
        });
      });
    });
  });
});
