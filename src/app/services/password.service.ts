import { Injectable } from '@angular/core';

@Injectable()
export class PasswordService {
  public minLength: number = 8;
  public minLengthErrorMessage: string = $localize`Password must be at least 8 characters`;
  public pattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$';
  public patternErrorMessage: string = $localize`Password must have at least one lowercase, one uppercase, and one number character`;
}
