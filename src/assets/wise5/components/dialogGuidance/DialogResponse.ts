export class DialogResponse {
  text: string;
  user: string;

  constructor(text: string, user: string) {
    this.text = text;
    this.user = user;
  }
}
