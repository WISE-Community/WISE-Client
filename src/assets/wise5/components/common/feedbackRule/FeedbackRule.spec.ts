import { FeedbackRule } from './FeedbackRule';

describe('FeedbackRule', () => {
  getPostfixExpression();
});

function getPostfixExpression() {
  describe('getPostfixRule()', () => {
    it('should convert rule to postfix format', () => {
      expectPostfixExpression('idea1 && idea2 && idea3', ['idea1', 'idea2', '&&', 'idea3', '&&']);
      expectPostfixExpression('idea1 || idea2 && idea3', ['idea1', 'idea2', '||', 'idea3', '&&']);
      expectPostfixExpression('!idea1 && !idea2', ['idea1', '!', 'idea2', '!', '&&']);
    });
  });
}

function expectPostfixExpression(expression: string, expectedResult: string[]) {
  const feedbackRule = new FeedbackRule();
  feedbackRule.expression = expression;
  expect(feedbackRule.getPostfixExpression()).toEqual(expectedResult);
}
