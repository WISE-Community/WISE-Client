import { ComputerDialogResponse } from './ComputerDialogResponse';
import { CRaterIdea } from './CRaterIdea';
import { CRaterScore } from './CRaterScore';

export class ComputerDialogResponseMultipleScores extends ComputerDialogResponse {
  scores: CRaterScore[];

  constructor(text: string, scores: CRaterScore[], ideas: CRaterIdea[], timestamp: number) {
    super(text, ideas, timestamp);
    this.scores = scores;
  }
}
