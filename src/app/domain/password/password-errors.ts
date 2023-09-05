export class PasswordErrors {
  messageCode: string = 'invalidPassword';
  missingLetter: boolean;
  missingNumber: boolean;
  missingSymbol: boolean;
  tooShort: boolean;

  constructor(
    missingLetter: boolean,
    missingNumber: boolean,
    missingSymbol: boolean,
    tooShort: boolean
  ) {
    this.missingLetter = missingLetter;
    this.missingNumber = missingNumber;
    this.missingSymbol = missingSymbol;
    this.tooShort = tooShort;
  }
}
