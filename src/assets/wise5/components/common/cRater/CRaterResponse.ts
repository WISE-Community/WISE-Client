import { Response } from '../feedbackRule/Response';
import { CRaterIdea } from './CRaterIdea';
import { CRaterScore } from './CRaterScore';

export class CRaterResponse extends Response {
  ideas: CRaterIdea[] = [];
  score: number;
  scores: CRaterScore[];

  constructor(jsonObject: any = {}) {
    super(jsonObject);
    this.populateFields(jsonObject);
  }

  getDetectedIdeaCount(): number {
    return this.getDetectedIdeaNames().length;
  }

  getDetectedIdeaNames(): string[] {
    const detectedIdeaNames = [];
    this.ideas.forEach((idea: CRaterIdea) => {
      if (idea.detected) {
        detectedIdeaNames.push(idea.name);
      }
    });
    return detectedIdeaNames;
  }

  getKIScore(): number {
    return this.isSingleScoreItem()
      ? this.score
      : this.scores.find((score) => score.id === 'ki').score;
  }

  private isSingleScoreItem(): boolean {
    return this.score != null;
  }

  isNonScorable(): boolean {
    return this.scores.some((score) => score.id === 'nonscorable' && score.score === 1);
  }
}
