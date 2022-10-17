import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';

export class DynamicPrompt {
  enabled: boolean;
  peerGroupingTag?: string;
  postPrompt?: string;
  prePrompt?: string;
  referenceComponent: {
    componentId: string;
    nodeId: string;
  };
  rules: FeedbackRule[];

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      if (jsonObject[key] != null) {
        this[key] = jsonObject[key];
      }
    }
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

  getPeerGroupingTag(): string {
    return this.peerGroupingTag;
  }

  isPeerGroupingTagSpecified(): boolean {
    return this.peerGroupingTag != null && this.peerGroupingTag !== '';
  }
}
