import { CRaterIdea } from './CRaterIdea';
import { CRaterScore } from './CRaterScore';
import { DialogResponse } from './DialogResponse';

export class ComputerDialogResponse extends DialogResponse {
  ideas: CRaterIdea[];
  scores: CRaterScore[];
  user: string = 'Computer';

  constructor(text: string, scores: CRaterScore[], ideas: CRaterIdea[], timestamp: number) {
    super(text, timestamp);
    this.ideas = ideas;
    this.scores = scores;
  }
}
