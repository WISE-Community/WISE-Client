import { FeedbackRule } from './FeedbackRule';

describe('FeedbackRule', () => {
  getPostfixExpression();
});

function getPostfixExpression() {
  describe('getPostfixRule()', () => {
    it('should convert rule to postfix format', () => {
      expectPostfixExpression('1 && 2 && 3', ['1', '2', '&&', '3', '&&']);
      expectPostfixExpression('1 || 2 && 3', ['1', '2', '||', '3', '&&']);
      expectPostfixExpression('!1 && !2', ['1', '!', '2', '!', '&&']);
      expectPostfixExpression('1 && isSubmitNumber(2)', ['1', 'isSubmitNumber(2)', '&&']);
      expectPostfixExpression('(1 && 2) || (3 && 4)', ['1', '2', '&&', '3', '4', '&&', '||']);
      expectPostfixExpression('!(1 || 2) && 3', ['1', '2', '||', '!', '3', '&&']);
      expectPostfixExpression('(!1 || (2 && 3)) || 4', ['1', '!', '2', '3', '&&', '||', '4', '||']);
    });
  });
}

function expectPostfixExpression(expression: string, expectedResult: string[]) {
  const feedbackRule = new FeedbackRule();
  feedbackRule.expression = expression;
  expect(feedbackRule.getPostfixExpression()).toEqual(expectedResult);
}
