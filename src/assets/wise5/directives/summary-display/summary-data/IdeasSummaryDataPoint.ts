import { ComponentState } from '../../../../../app/domain/componentState';

export abstract class IdeasSummaryDataPoint {
  protected allIdeaIds: Set<string>;
  protected detectedIdeaIds: Set<string>;

  constructor() {
    this.allIdeaIds = new Set<string>();
    this.detectedIdeaIds = new Set<string>();
  }

  protected processIdea(idea: { name: string; detected: boolean }): void {
    this.allIdeaIds.add(idea.name);
    if (idea.detected) {
      this.detectedIdeaIds.add(idea.name);
    }
  }

  getAllIdeaIds(): Set<string> {
    return this.allIdeaIds;
  }

  getDetectedIdeaIds(): Set<string> {
    return this.detectedIdeaIds;
  }
}
