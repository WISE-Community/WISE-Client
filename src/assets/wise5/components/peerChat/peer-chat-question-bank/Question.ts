import { generateRandomKey } from '../../../common/string/string';

export class Question {
  id: string;
  text: string = '';

  constructor() {
    this.id = generateRandomKey();
  }
}
