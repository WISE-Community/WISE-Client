export class RegisterUserFormComponent {
  translateCreateAccountErrorMessageCode(messageCode: string) {
    switch (messageCode) {
      case 'invalidFirstAndLastName':
        return $localize`Error: First Name and Last Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash`;
      case 'invalidFirstName':
        return $localize`Error: First Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash`;
      case 'invalidLastName':
        return $localize`Error: Last Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash`;
    }
    return messageCode;
  }
}
