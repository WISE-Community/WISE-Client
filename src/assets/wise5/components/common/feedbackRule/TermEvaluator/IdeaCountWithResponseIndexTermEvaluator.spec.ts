import { IdeaCountWithResponseIndexTermEvaluator } from './IdeaCountWithResponseIndexTermEvaluator';
import {
  IdeaCountTermEvaluatorTester,
  response_with_idea_1,
  response_with_ideas_1_2,
  response_with_ideas_1_2_3
} from './test-utils';

const evaluatorTester = new IdeaCountTermEvaluatorTester([
  new IdeaCountWithResponseIndexTermEvaluator('ideaCountMoreThan(2, 2)'),
  new IdeaCountWithResponseIndexTermEvaluator('ideaCountEquals(2,2)'),
  new IdeaCountWithResponseIndexTermEvaluator('ideaCountLessThan(2,2)')
]);
describe('IdeaCountWithResponseIndexTermEvaluator', () => {
  describe('evaluate()', () => {
    evaluate_NotEnoughResponses_ReturnFalse();
    evaluate_EnoughResponses_CheckNumberOfDetectedIdeas();
  });
});

function evaluate_NotEnoughResponses_ReturnFalse() {
  describe('response index is more than number of responses', () => {
    it('should return false', () => {
      evaluatorTester.expectEvaluations([], [false, false, false]);
      evaluatorTester.expectEvaluations([response_with_idea_1], [false, false, false]);
    });
  });
}

function evaluate_EnoughResponses_CheckNumberOfDetectedIdeas() {
  describe('response index is more than number of responses', () => {
    it('should check whether number of detected ideas at the index meets criteria', () => {
      evaluatorTester.expectEvaluations(
        [response_with_idea_1, response_with_idea_1],
        [false, false, true]
      );
      evaluatorTester.expectEvaluations(
        [response_with_idea_1, response_with_ideas_1_2],
        [false, true, false]
      );
      evaluatorTester.expectEvaluations(
        [response_with_idea_1, response_with_ideas_1_2_3],
        [true, false, false]
      );
    });
  });
}
