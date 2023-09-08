import { ConstraintService } from '../../../../services/constraintService';
import { CRaterResponse } from '../../cRater/CRaterResponse';
import { ChoseChoiceTermEvaluator } from './ChoseChoiceTermEvaluator';

class ConstraintServiceStub {
  evaluateCriteria(criteria: any): boolean {
    return true;
  }
}

describe('ChoseChoiceTermEvaluator', () => {
  let evaluator1, mockConstraintService;
  beforeEach(() => {
    evaluator1 = new ChoseChoiceTermEvaluator('choseChoice("node1", "componentA", "choice1")');
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
