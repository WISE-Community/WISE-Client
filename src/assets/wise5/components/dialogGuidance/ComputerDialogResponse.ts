import { DialogResponse } from './DialogResponse';

export class ComputerDialogResponse extends DialogResponse {
  ideas: any[];
  scores: any[];
  user: string = 'Computer';

  constructor(text: string, scores: any[], ideas: string[], timestamp: number) {
    super(text, timestamp);
    this.ideas = ideas;
    this.scores = scores;
  }
}
