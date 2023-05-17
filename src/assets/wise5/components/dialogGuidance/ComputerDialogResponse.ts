import { CRaterIdea } from '../common/cRater/CRaterIdea';
import { DialogResponse } from './DialogResponse';

export class ComputerDialogResponse extends DialogResponse {
  feedbackRuleId?: string;
  ideas: CRaterIdea[];
  initialResponse: boolean;
  user: string = 'Computer';

  constructor(
    text: string,
    ideas: CRaterIdea[],
    timestamp: number,
    initialResponse: boolean = false
  ) {
    super(text, timestamp);
    this.ideas = ideas;
    this.initialResponse = initialResponse;
  }
}
