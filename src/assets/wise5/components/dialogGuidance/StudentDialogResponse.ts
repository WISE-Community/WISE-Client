import { DialogResponse } from './DialogResponse';

export class StudentDialogResponse extends DialogResponse {
  ideas: string[];
  user: string = 'Student';

  constructor(text: string, timestamp: number) {
    super(text, timestamp);
  }
}
