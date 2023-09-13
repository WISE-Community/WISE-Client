export class PasswordErrors {
  messageCode: string = 'invalidPassword';
  missingLetter: boolean;
  missingNumber: boolean;
  tooShort: boolean;

  constructor(missingLetter: boolean, missingNumber: boolean, tooShort: boolean) {
    this.missingLetter = missingLetter;
    this.missingNumber = missingNumber;
    this.tooShort = tooShort;
  }
}
