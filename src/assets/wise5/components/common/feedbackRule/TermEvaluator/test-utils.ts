import { CRaterIdea } from '../../cRater/CRaterIdea';
import { CRaterResponse } from '../../cRater/CRaterResponse';
import { AbstractIdeaCountTermEvaluator } from './AbstractIdeaCountTermEvaluator';

const idea1 = new CRaterIdea('1', true);
const idea2 = new CRaterIdea('2', true);
const idea3 = new CRaterIdea('3', true);
const response_with_idea_1 = new CRaterResponse({ ideas: [idea1] });
const response_with_idea_2 = new CRaterResponse({ ideas: [idea2] });
const response_with_ideas_1_2 = new CRaterResponse({ ideas: [idea1, idea2] });
const response_with_ideas_1_2_3 = new CRaterResponse({ ideas: [idea1, idea2, idea3] });

export {
  response_with_idea_1,
  response_with_idea_2,
  response_with_ideas_1_2,
  response_with_ideas_1_2_3
};

export class IdeaCountTermEvaluatorTester {
  constructor(private evaluators: AbstractIdeaCountTermEvaluator[]) {}

  expectEvaluations(response: CRaterResponse | CRaterResponse[], expectedValues: boolean[]) {
    this.evaluators.forEach((evaluator, index) => {
      expect(evaluator.evaluate(response)).toBe(expectedValues[index]);
    });
  }
}
