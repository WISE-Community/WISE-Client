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
    const result = new RegExp(DIFFERENT_IDEAS_REGEX).exec(this.logic);
    return new ReferenceComponent(result[1], result[2]);
  }

  getDifferentScoresReferenceComponent(): ReferenceComponent {
    const result = new RegExp(DIFFERENT_SCORES_REGEX).exec(this.logic);
    return new ReferenceComponent(result[1], result[2]);
  }

  getDifferentScoresMode(): string {
    const result = new RegExp(DIFFERENT_SCORES_REGEX).exec(this.logic);
    return result[4];
  }
}
