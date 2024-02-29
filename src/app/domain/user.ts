export class User {
  displayName: string;
  firstName: string;
  id: number;
  isGoogleUser: boolean = false;
  isRecaptchaInvalid: boolean = false;
  isRecaptchaRequired: boolean;
  language: string;
  lastName: string;
  permissions: number[];
  roles: string[];
  token: string;
  username: string;

  constructor(jsonObject: any = {}) {
    for (let key of Object.keys(jsonObject)) {
      this[key] = jsonObject[key];
    }
  }
}
