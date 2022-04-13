export class CRaterScore {
  id: string;
  score: number;
  realNumberScore: number;

  constructor(id: string, score: number, realNumberScore: number) {
    this.id = id;
    this.score = score;
    this.realNumberScore = realNumberScore;
  }
}
