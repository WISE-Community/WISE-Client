import { CRaterResponse } from '../cRater/CRaterResponse';
import { FeedbackRule } from './FeedbackRule';
import { FeedbackRuleEvaluator } from './FeedbackRuleEvaluator';
import { TermEvaluator } from './TermEvaluator/TermEvaluator';

export class FeedbackRuleEvaluatorMultipleStudents extends FeedbackRuleEvaluator<CRaterResponse[]> {
  getFeedbackRules(responses: CRaterResponse[]): FeedbackRule[] {
    const matchedRules = this.component
      .getFeedbackRules()
      .filter((rule) => this.satisfiesRule(responses, Object.assign(new FeedbackRule(), rule)));
    return matchedRules.length > 0
      ? matchedRules
      : [this.getDefaultRule(this.component.getFeedbackRules())];
  }

  protected satisfiesFinalSubmitRule(
    responses: CRaterResponse[],
    feedbackRule: FeedbackRule
  ): boolean {
    return (
      this.hasMaxSubmitAndIsFinalSubmitRule(feedbackRule) &&
      responses.some((response: CRaterResponse) => {
        return this.component.hasMaxSubmitCountAndUsedAllSubmits(response.submitCounter);
      })
    );
  }

  protected satisfiesSecondToLastSubmitRule(
    responses: CRaterResponse[],
    feedbackRule: FeedbackRule
  ): boolean {
    return (
      this.hasMaxSubmitAndIsSecondToLastSubmitRule(feedbackRule) &&
      responses.some((response: CRaterResponse) => {
        return this.isSecondToLastSubmit(response.submitCounter);
      })
    );
  }

  protected satisfiesNonScorableRule(
    responses: CRaterResponse[],
    feedbackRule: FeedbackRule
  ): boolean {
    return (
      feedbackRule.expression === 'isNonScorable' &&
      responses.some((response: CRaterResponse) => {
        return response.isNonScorable();
      })
    );
  }

  protected evaluateTerm(term: string, responses: CRaterResponse[]): boolean {
    const evaluator: TermEvaluator = this.factory.getTermEvaluator(term, this.constraintService);
    return responses.some((response: CRaterResponse) => {
      return evaluator.evaluate(response);
    });
  }
}
