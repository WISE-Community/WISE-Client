export class Choice {
  feedbackToShow: string;
  id: string;
  isCorrect: boolean;
  text: string;

  constructor(id: string, text: string, isCorrect: boolean, feedbackToShow: string) {
    this.id = id;
    this.text = text;
    this.isCorrect = isCorrect;
    this.feedbackToShow = feedbackToShow;
  }
}
