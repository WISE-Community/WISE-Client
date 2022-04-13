import { CRaterIdea } from './CRaterIdea';
import { CRaterScore } from './CRaterScore';

export class CRaterResponse {
  ideas: CRaterIdea[] = [];
  score: number;
  scores: CRaterScore[];

  constructor() {}

  getDetectedIdeaNames(): string[] {
    const detectedIdeaNames = [];
    this.ideas.forEach((idea: CRaterIdea) => {
      if (idea.detected) {
        detectedIdeaNames.push(idea.name);
      }
    });
    return detectedIdeaNames;
  }

  getKIScore() {
    for (const score of this.scores) {
      if (score.id === 'ki') {
        return score.score;
      }
    }
  }

  isNonScorable(): boolean {
    return this.scores.some((score) => score.id === 'nonscorable' && score.score === 1);
  }
}
