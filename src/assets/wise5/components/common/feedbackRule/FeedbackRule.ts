export class FeedbackRule {
  id?: string;
  expression: string;
  feedback?: string | string[];
  prompt?: string;
  static operatorPrecedences = { '!': 2, '&&': 1, '||': 1 };

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      if (jsonObject[key] != null) {
        this[key] = jsonObject[key];
      }
    }
  }

  static isSecondToLastSubmitRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.expression === 'isSecondToLastSubmit';
  }

  static isFinalSubmitRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.expression === 'isFinalSubmit';
  }

  static isDefaultRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.expression === 'isDefault';
  }

  // uses shunting-yard algorithm to get expression in postfix (reverse-polish) notation
  getPostfixExpression(): string[] {
    const result = [];
    const operatorStack = [];
    for (const symbol of this.getExpressionAsArray()) {
      if (FeedbackRule.isOperator(symbol)) {
        while (operatorStack.length > 0) {
          const topOperatorOnStack = operatorStack[operatorStack.length - 1];
          if (
            FeedbackRule.hasGreaterPrecedence(topOperatorOnStack, symbol) ||
            FeedbackRule.hasSamePrecedence(topOperatorOnStack, symbol)
          ) {
            result.push(operatorStack.pop());
          } else {
            break;
          }
        }
        operatorStack.push(symbol);
      } else if (FeedbackRule.isLeftParenthesis(symbol)) {
        operatorStack.push(symbol);
      } else if (FeedbackRule.isRightParenthesis(symbol)) {
        let topOperatorOnStack = operatorStack[operatorStack.length - 1];
        while (!FeedbackRule.isLeftParenthesis(topOperatorOnStack)) {
          result.push(operatorStack.pop());
          topOperatorOnStack = operatorStack[operatorStack.length - 1];
        }
        operatorStack.pop(); // discard left parenthesis
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
    return this.expression
      .replace(/ /g, '')
      .split(
        /(hasKIScore\(\d\)|ideaCountEquals\(\d\)|ideaCountLessThan\(\d\)|ideaCountMoreThan\(\d\)|isSubmitNumber\(\d+\)|&&|\|\||!|\(|\))/g
      )
      .filter((el) => el !== '');
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
    return FeedbackRule.operatorPrecedences[symbol] ?? 0;
  }
}
