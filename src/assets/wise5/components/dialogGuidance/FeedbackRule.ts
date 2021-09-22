export class FeedbackRule {
  feedback: string;
  rule: string[];

  static isSecondToLastSubmitRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.rule[0] === 'isSecondToLastSubmit';
  }

  static isFinalSubmitRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.rule[0] === 'isFinalSubmit';
  }

  static isDefaultRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.rule[0] === 'isDefault';
  }

  // uses shunting yard algorithm to get expression in postfix (reverse-polish) notation
  getPostfixExpression(): string[] {
    const result = [];
    const operatorStack = [];
    for (const symbol of this.rule) {
      if (FeedbackRule.isOperator(symbol)) {
        while (operatorStack.length > 0) {
          const last = operatorStack[operatorStack.length - 1];
          if (
            FeedbackRule.hasGreaterPrecedence(last, symbol) ||
            FeedbackRule.hasSamePrecedence(last, symbol)
          ) {
            result.push(operatorStack.pop());
          } else {
            break;
          }
        }
        operatorStack.push(symbol);
      } else {
        result.push(symbol);
      }
    }
    while (operatorStack.length > 0) {
      result.push(operatorStack.pop());
    }
    return result;
  }

  static isOperator(symbol: string): boolean {
    return ['&&'].includes(symbol);
  }

  static isOperand(symbol: string): boolean {
    return !this.isOperator(symbol);
  }

  static hasGreaterPrecedence(symbol1: string, symbol2: string): boolean {
    return this.getPrecedence(symbol1) > this.getPrecedence(symbol2);
  }

  static hasSamePrecedence(symbol1: string, symbol2: string): boolean {
    return this.getPrecedence(symbol1) === this.getPrecedence(symbol2);
  }

  static getPrecedence(symbol: string): number {
    if (['&&'].includes(symbol)) {
      return 1;
    } else {
      return 0;
    }
  }
}
