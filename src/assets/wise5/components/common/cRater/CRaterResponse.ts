import { CRaterIdea } from './CRaterIdea';
import { CRaterScore } from './CRaterScore';

export class CRaterResponse {
  ideas: CRaterIdea[] = [];
  score: number;
  scores: CRaterScore[];
  submitCounter: number;

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      if (jsonObject[key] != null) {
        this[key] = jsonObject[key];
      }
    }
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
