import { CRaterResponse } from '../../cRater/CRaterResponse';
import { IsSubmitNumberEvaluator } from './IsSubmitNumberEvaluator';

describe('IsSubmitNumberEvaluator', () => {
  describe('evaluate()', () => {
    it("should return true iff response's submitCounter is the expected submit number", () => {
      const response_2nd_submit = createResponseWithSubmitNumber(2);
      const response_3rd_submit = createResponseWithSubmitNumber(3);
      const evaluator_2 = new IsSubmitNumberEvaluator('isSubmitNumber(2)');
      expect(evaluator_2.evaluate(response_2nd_submit)).toBeTrue();
      expect(evaluator_2.evaluate(response_3rd_submit)).toBeFalse();
    });
  });
});

function createResponseWithSubmitNumber(submitNumber: number): CRaterResponse {
  const response = new CRaterResponse();
  response.submitCounter = submitNumber;
  return response;
}
