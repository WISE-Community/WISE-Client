export class CRaterResponse {
  scores: CRaterScore[];
  ideas: string[] = [];

  constructor() {}

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
