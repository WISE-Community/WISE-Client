import { Response } from '../Response';
import { BooleanTermEvaluator } from './BooleanTermEvaluator';

describe('BooleanTermEvaluator', () => {
  describe('evaluate()', () => {
    testEvaluate('true', true);
    testEvaluate('false', false);
  });
});

function testEvaluate(term: string, expectedResult: boolean) {
  describe(`term is "${term}"`, () => {
    let evaluator: BooleanTermEvaluator;
    beforeEach(() => {
      evaluator = new BooleanTermEvaluator(term);
    });
    it(`returns ${expectedResult}`, () => {
      expect(evaluator.evaluate(new Response())).toBe(expectedResult);
    });
  });
}
