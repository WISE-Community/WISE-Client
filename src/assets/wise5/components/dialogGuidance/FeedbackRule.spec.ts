import { FeedbackRule } from './FeedbackRule';

describe('FeedbackRule', () => {
  getPostfixExpression();
});

function getPostfixExpression() {
  describe('getPostfixRule()', () => {
    it('should convert rule to postfix format', () => {
      const feedbackRule = new FeedbackRule();
      feedbackRule.expression = 'idea1 && idea2 && idea3';
      expect(feedbackRule.getPostfixExpression()).toEqual(['idea1', 'idea2', '&&', 'idea3', '&&']);
    });
  });
}
