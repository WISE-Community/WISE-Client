import { CRaterIdea } from './CRaterIdea';
import { DialogResponse } from './DialogResponse';

export class ComputerDialogResponse extends DialogResponse {
  ideas: CRaterIdea[];
  user: string = 'Computer';

  constructor(text: string, ideas: CRaterIdea[], timestamp: number) {
    super(text, timestamp);
    this.ideas = ideas;
  }
}
