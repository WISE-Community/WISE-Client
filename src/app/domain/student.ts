import { User } from './user';

export class Student extends User {
  gender: string;
  googleUserId: string;
  securityQuestion: string;
  securityAnswer: string;
  accessCode: string;
  period: string;
}
