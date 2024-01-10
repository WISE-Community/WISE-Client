import { CRaterResponse } from '../cRater/CRaterResponse';
import { FeedbackRule } from './FeedbackRule';
import { FeedbackRuleEvaluator } from './FeedbackRuleEvaluator';
import { Response } from './Response';
import { TermEvaluator } from './TermEvaluator/TermEvaluator';

export class FeedbackRuleEvaluatorMultipleStudents extends FeedbackRuleEvaluator<Response[]> {
  getFeedbackRules(responses: Response[]): FeedbackRule[] {
    const matchedRules = this.component
      .getFeedbackRules()
      .filter((rule) => this.satisfiesRule(responses, Object.assign(new FeedbackRule(), rule)));
    return matchedRules.length > 0
      ? matchedRules
      : [this.getDefaultRule(this.component.getFeedbackRules())];
  }

  protected satisfiesFinalSubmitRule(responses: Response[], feedbackRule: FeedbackRule): boolean {
    return (
      this.hasMaxSubmitAndIsFinalSubmitRule(feedbackRule) &&
      responses.some((response: CRaterResponse) => {
        return this.component.hasMaxSubmitCountAndUsedAllSubmits(response.submitCounter);
      })
    );
  }

  protected satisfiesSecondToLastSubmitRule(
    responses: Response[],
    feedbackRule: FeedbackRule
  ): boolean {
    return (
      this.hasMaxSubmitAndIsSecondToLastSubmitRule(feedbackRule) &&
      responses.some((response: Response) => {
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

  protected evaluateTerm(term: string, responses: Response[]): boolean {
    const evaluator: TermEvaluator = this.factory.getTermEvaluator(term);
    evaluator.setPeerGroup(this.peerGroup);
    evaluator.setReferenceComponent(this.referenceComponent);
    return responses.some((response: Response) => {
      return evaluator.evaluate(response);
    });
  }
}
