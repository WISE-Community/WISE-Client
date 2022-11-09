import { ComputerDialogResponse } from './ComputerDialogResponse';
import { CRaterIdea } from '../common/cRater/CRaterIdea';
import { CRaterScore } from '../common/cRater/CRaterScore';

export class ComputerDialogResponseMultipleScores extends ComputerDialogResponse {
  scores: CRaterScore[];

  constructor(text: string, scores: CRaterScore[], ideas: CRaterIdea[], timestamp: number) {
    super(text, ideas, timestamp);
    this.scores = scores;
  }
}
