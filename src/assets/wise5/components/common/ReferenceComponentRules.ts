import { ReferenceComponent } from '../../../../app/domain/referenceComponent';
import { FeedbackRule } from './feedbackRule/FeedbackRule';

export abstract class ReferenceComponentRules {
  enabled: boolean;
  peerGroupingTag?: string;
  referenceComponent: ReferenceComponent;
  rules: FeedbackRule[];

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      if (jsonObject[key] != null) {
        this[key] = jsonObject[key];
      }
    }
  }

  getPeerGroupingTag(): string {
    return this.peerGroupingTag;
  }

  getReferenceNodeId(): string {
    return this.referenceComponent.nodeId;
  }

  getReferenceComponentId(): string {
    return this.referenceComponent.componentId;
  }

  getRules(): FeedbackRule[] {
    return this.rules;
  }

  isPeerGroupingTagSpecified(): boolean {
    return this.peerGroupingTag != null && this.peerGroupingTag !== '';
  }
}
