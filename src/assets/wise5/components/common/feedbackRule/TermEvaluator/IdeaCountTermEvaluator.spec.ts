import { IdeaCountTermEvaluator } from './IdeaCountTermEvaluator';
import {
  IdeaCountTermEvaluatorTester,
  response_with_idea_1,
  response_with_ideas_1_2,
  response_with_ideas_1_2_3
} from './test-utils';

describe('IdeaCountTermEvaluator', () => {
  describe('evaluate()', () => {
    it('should check whether number of detected ideas meets criteria', () => {
      const evaluatorTester = new IdeaCountTermEvaluatorTester([
        new IdeaCountTermEvaluator('ideaCountMoreThan(2)'),
        new IdeaCountTermEvaluator('ideaCountEquals(2)'),
        new IdeaCountTermEvaluator('ideaCountLessThan(2)')
      ]);
      evaluatorTester.expectEvaluations(response_with_idea_1, [false, false, true]);
      evaluatorTester.expectEvaluations(response_with_ideas_1_2, [false, true, false]);
      evaluatorTester.expectEvaluations(response_with_ideas_1_2_3, [true, false, false]);
    });
  });
});
