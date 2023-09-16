import { Component } from '../../../../common/Component';
import { ConstraintService } from '../../../../services/constraintService';
import { Response } from '../Response';

export abstract class TermEvaluator {
  protected referenceComponent: Component;
  protected constraintService: ConstraintService;

  constructor(protected term: string) {}
  abstract evaluate(response: Response | Response[]): boolean;

  static isAccumulatedIdeaCountTerm(term: string): boolean {
    return /accumulatedIdeaCount(MoreThan|Equals|LessThan)\([\d+]\)/.test(term);
  }

  static isMyChoiceChosenTerm(term: string): boolean {
    return /myChoiceChosen\("\w+"\)/.test(term);
  }

  static isHasKIScoreTerm(term: string): boolean {
    return /hasKIScore\([1-5]\)/.test(term);
  }

  static isIdeaCountTerm(term: string): boolean {
    return /ideaCount(MoreThan|Equals|LessThan)\([\d+]\)/.test(term);
  }

  static isIdeaCountWithResponseIndexTerm(term: string): boolean {
    return /ideaCount(MoreThan|Equals|LessThan)\(\d+,\s*\d+\)/.test(term);
  }

  static isSubmitNumberTerm(term: string): boolean {
    return /isSubmitNumber\(\d+\)/.test(term);
  }

  static requiresAllResponses(term: string): boolean {
    return (
      TermEvaluator.isAccumulatedIdeaCountTerm(term) ||
      TermEvaluator.isIdeaCountWithResponseIndexTerm(term)
    );
  }

  setConstraintService(service: ConstraintService): void {
    this.constraintService = service;
  }

  setReferenceComponent(referenceComponent: Component): void {
    this.referenceComponent = referenceComponent;
  }
}
