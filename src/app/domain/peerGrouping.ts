import {
  DIFFERENT_IDEAS_REGEX,
  DIFFERENT_SCORES_REGEX
} from '../../assets/wise5/authoringTool/peer-grouping/PeerGroupingLogic';
import { ReferenceComponent } from './referenceComponent';

export class PeerGrouping {
  logic: string;
  maxMembershipCount: number;
  name: string;
  stepsUsedIn: string[];
  tag: string;
  threshold: any[];

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      if (jsonObject[key] != null) {
        this[key] = jsonObject[key];
      }
    }
  }

  getDifferentIdeasReferenceComponent(): ReferenceComponent {
    return this.getReferenceComponent(DIFFERENT_IDEAS_REGEX);
  }

  getDifferentScoresReferenceComponent(): ReferenceComponent {
    return this.getReferenceComponent(DIFFERENT_SCORES_REGEX);
  }

  getReferenceComponent(regex: RegExp) {
    const result = new RegExp(regex).exec(this.logic);
    return new ReferenceComponent(result[1], result[2]);
  }

  getDifferentIdeasMode(): string {
    return this.getMode(DIFFERENT_IDEAS_REGEX);
  }

  getDifferentScoresMode(): string {
    return this.getMode(DIFFERENT_SCORES_REGEX);
  }

  getMode(regex: RegExp) {
    const result = new RegExp(regex).exec(this.logic);
    return result[4];
  }
}
