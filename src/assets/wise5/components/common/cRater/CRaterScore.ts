export class CRaterScore {
  id: string;
  realNumberScore: number;
  score: number;
  scoreRangeMax: number;
  scoreRangeMin: number;

  constructor(
    id: string,
    score: number,
    realNumberScore: number,
    scoreRangeMin: number,
    scoreRangeMax: number
  ) {
    this.id = id;
    this.score = score;
    this.realNumberScore = realNumberScore;
    this.scoreRangeMin = scoreRangeMin;
    this.scoreRangeMax = scoreRangeMax;
  }
}
