import { FeedbackRuleExpression } from './FeedbackRuleExpression';

describe('FeedbackRuleExpression', () => {
  getPostfix();
});

function getPostfix() {
  describe('getPostfix()', () => {
    it('should convert text to array in postfix order', () => {
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

function expectPostfixExpression(text: string, expectedResult: string[]) {
  const expression = new FeedbackRuleExpression(text);
  expect(expression.getPostfix()).toEqual(expectedResult);
}
