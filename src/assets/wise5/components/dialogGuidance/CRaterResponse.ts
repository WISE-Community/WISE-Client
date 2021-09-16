import { CRaterIdea } from './CRaterIdea';
import { CRaterScore } from './CRaterScore';

export class CRaterResponse {
  scores: CRaterScore[];
  ideas: CRaterIdea[];

  constructor() {}

  getDetectedIdeas(): CRaterIdea[] {
    return this.ideas.filter((idea) => idea.detected);
  }

  getKIScore() {
    for (const score of this.scores) {
      if (score.id === 'ki') {
        return score.score;
      }
    }
  }
}
