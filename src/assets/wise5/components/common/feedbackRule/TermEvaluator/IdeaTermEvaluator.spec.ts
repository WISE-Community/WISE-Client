import { CRaterIdea } from '../../cRater/CRaterIdea';
import { CRaterResponse } from '../../cRater/CRaterResponse';
import { IdeaTermEvaluator } from './IdeaTermEvaluator';

describe('IdeaTermEvaluator', () => {
  const evaluator = new IdeaTermEvaluator('1');
  describe('evaluate(response)', () => {
    let response: CRaterResponse;
    beforeEach(() => {
      response = new CRaterResponse();
    });
    describe('response does not contain the idea', () => {
      it('returns false', () => {
        expect(evaluator.evaluate(response)).toBeFalse();
      });
    });
    describe('response contains the idea', () => {
      beforeEach(() => {
        response.ideas = [new CRaterIdea('1', true), new CRaterIdea('2', true)];
      });
      it('returns true', () => {
        expect(evaluator.evaluate(response)).toBeTrue();
      });
    });
  });
});
