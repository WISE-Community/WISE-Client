import { Component } from '../../../../common/Component';
import { ConfigService } from '../../../../services/configService';
import { ConstraintService } from '../../../../services/constraintService';
import { PeerGroup } from '../../../peerChat/PeerGroup';
import { Response } from '../Response';

export abstract class TermEvaluator {
  protected configService: ConfigService;
  protected constraintService: ConstraintService;
  protected peerGroup: PeerGroup;
  protected referenceComponent: Component;

  constructor(protected term: string) {}
  abstract evaluate(response: Response | Response[]): boolean;

  static isAccumulatedIdeaCountTerm(term: string): boolean {
    return /accumulatedIdeaCount(MoreThan|Equals|LessThan)\([\d+]\)/.test(term);
  }

  static isBooleanTerm(term: string): boolean {
    return ['true', 'false'].includes(term);
  }

  static isLowestWorkgroupIdInPeerGroupTerm(term: string): boolean {
    return term === 'isLowestWorkgroupIdInPeerGroup';
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

  setConfigService(service: ConfigService): void {
    this.configService = service;
  }

  setConstraintService(service: ConstraintService): void {
    this.constraintService = service;
  }

  setPeerGroup(peerGroup: PeerGroup): void {
    this.peerGroup = peerGroup;
  }

  setReferenceComponent(referenceComponent: Component): void {
    this.referenceComponent = referenceComponent;
  }
}
