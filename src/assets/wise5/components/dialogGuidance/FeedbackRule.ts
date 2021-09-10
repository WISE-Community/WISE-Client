export class FeedbackRule {
  ideas: string[];
  feedback: string;

  constructor(feedback: string, ideas: string[]) {
    this.feedback = feedback;
    this.ideas = ideas;
  }
}
