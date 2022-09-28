import { ComputerDialogResponse } from './ComputerDialogResponse';
import { CRaterIdea } from '../common/cRater/CRaterIdea';

export class ComputerDialogResponseSingleScore extends ComputerDialogResponse {
  score: number;

  constructor(text: string, score: number, ideas: CRaterIdea[], timestamp: number) {
    super(text, ideas, timestamp);
    this.score = score;
  }
}
