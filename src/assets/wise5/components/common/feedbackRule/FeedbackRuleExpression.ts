export class FeedbackRuleExpression {
  static operatorPrecedences = { '!': 2, '&&': 1, '||': 1 };

  constructor(private text: string) {}

  // uses shunting-yard algorithm to get expression in postfix (reverse-polish) notation
  getPostfix(): string[] {
    const result = [];
    const operatorStack = [];
    for (const symbol of this.getExpressionAsArray()) {
      if (FeedbackRuleExpression.isOperator(symbol)) {
        this.processOperator(symbol, operatorStack, result);
      } else if (FeedbackRuleExpression.isLeftParenthesis(symbol)) {
        operatorStack.push(symbol);
      } else if (FeedbackRuleExpression.isRightParenthesis(symbol)) {
        this.processRightParenthesis(operatorStack, result);
      } else {
        result.push(symbol);
      }
    }
    while (operatorStack.length > 0) {
      result.push(operatorStack.pop());
    }
    return result;
  }

  private getExpressionAsArray(): string[] {
    return this.text
      .replace(/ /g, '')
      .split(
        /(hasKIScore\(\d\)|accumulatedIdeaCountEquals\(\d\)|accumulatedIdeaCountLessThan\(\d\)|accumulatedIdeaCountMoreThan\(\d\)|ideaCountEquals\(\S+\)|ideaCountLessThan\(\S+\)|ideaCountMoreThan\(\S+\)|myChoiceChosen\(\S+?\)|isSubmitNumber\(\d+\)|&&|\|\||!|\(|\))/g
      )
      .filter((el) => el !== '');
  }

  private processOperator(symbol: string, operatorStack: string[], result: string[]): void {
    while (operatorStack.length > 0) {
      const topOperatorOnStack = operatorStack[operatorStack.length - 1];
      if (
        FeedbackRuleExpression.hasGreaterPrecedence(topOperatorOnStack, symbol) ||
        FeedbackRuleExpression.hasSamePrecedence(topOperatorOnStack, symbol)
      ) {
        result.push(operatorStack.pop());
      } else {
        break;
      }
    }
    operatorStack.push(symbol);
  }

  private processRightParenthesis(operatorStack: string[], result: string[]): void {
    let topOperatorOnStack = operatorStack[operatorStack.length - 1];
    while (!FeedbackRuleExpression.isLeftParenthesis(topOperatorOnStack)) {
      result.push(operatorStack.pop());
      topOperatorOnStack = operatorStack[operatorStack.length - 1];
    }
    operatorStack.pop(); // discard left parenthesis
  }

  static isLeftParenthesis(symbol: string): boolean {
    return symbol === '(';
  }

  static isRightParenthesis(symbol: string): boolean {
    return symbol === ')';
  }

  static isOperator(symbol: string): boolean {
    return ['&&', '||', '!'].includes(symbol);
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
    return this.operatorPrecedences[symbol] ?? 0;
  }
}
