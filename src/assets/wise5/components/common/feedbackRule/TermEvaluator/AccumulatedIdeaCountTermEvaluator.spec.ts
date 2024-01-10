import { AccumulatedIdeaCountTermEvaluator } from './AccumulatedIdeaCountTermEvaluator';
import {
  IdeaCountTermEvaluatorTester,
  response_with_idea_1,
  response_with_idea_2,
  response_with_ideas_1_2,
  response_with_ideas_1_2_3
} from './test-utils';

describe('AccumulatedIdeaCountTermEvaluator', () => {
  describe('evaluate()', () => {
    it('should check whether number of detected ideas meets criteria', () => {
      const evaluatorTester = new IdeaCountTermEvaluatorTester([
        new AccumulatedIdeaCountTermEvaluator('accumulatedIdeaCountMoreThan(2)'),
        new AccumulatedIdeaCountTermEvaluator('accumulatedIdeaCountEquals(2)'),
        new AccumulatedIdeaCountTermEvaluator('accumulatedIdeaCountLessThan(2)')
      ]);
      evaluatorTester.expectEvaluations([response_with_idea_1], [false, false, true]);
      evaluatorTester.expectEvaluations([response_with_ideas_1_2], [false, true, false]);
      evaluatorTester.expectEvaluations(
        [response_with_idea_1, response_with_idea_2],
        [false, true, false]
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
});
