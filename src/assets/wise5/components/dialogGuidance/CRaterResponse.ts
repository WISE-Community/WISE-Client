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

class CRaterScore {
  id: string;
  score: number;
  realNumberScore: number;
}

class CRaterIdea {
  name: string;
  detected: boolean;
  characterOffsets: any[];
}
