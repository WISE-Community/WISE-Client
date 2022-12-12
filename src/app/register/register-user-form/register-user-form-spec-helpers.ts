import { AbstractControl } from '@angular/forms';

export function createAccountSuccessResponse(username: string) {
  return {
    status: 'success',
    username: username
  };
}

export function createAccountErrorResponse(messageCode: string) {
  return {
    error: {
      messageCode: messageCode
    }
  };
}

export const nameTests = [
  {
    name: 'smith',
    isValid: true,
    description: 'should be valid when it contains letters'
  },
  {
    name: 'smith star',
    isValid: true,
    description: 'should be valid when it contains letters and a space'
  },
  {
    name: 'smith star fish',
    isValid: true,
    description: 'should be valid when it contains letters and spaces'
  },
  {
    name: 'smith-star',
    isValid: true,
    description: 'should be valid when it contains letters and a dash'
  },
  {
    name: 'smith-star-fish',
    isValid: true,
    description: 'should be valid when it contains letters and dashes'
  },
  {
    name: 'sam-smith star',
    isValid: true,
    description: 'should be valid when it contains letters and a dash and space'
  },
  {
    name: 'smith@',
    isValid: false,
    description: 'should not be valid when it contains letters and a symbol'
  },
  {
    name: ' smith',
    isValid: false,
    description: 'should not be valid when it contains letters and starts with a space'
  },
  {
    name: '-smith',
    isValid: false,
    description: 'should not be valid when it contains letters and starts with a dash'
  },
  {
    name: 'smith ',
    isValid: false,
    description: 'should not be valid when it contains letters and ends with a space'
  },
  {
    name: 'smith-',
    isValid: false,
    description: 'should not be valid when it contains letters and ends with a dash'
  },
  {
    name: '-smith-',
    isValid: false,
    description: 'should not be valid when it contains letters and starts and ends with a dash'
  },
  {
    name: ' smith ',
    isValid: false,
    description: 'should not be valid when it contains letters and starts and ends with a space'
  }
];

export function validateAndExpect(field: AbstractControl, value: string, isValid: boolean) {
  field.setValue(value);
  if (isValid) {
    expect(field.getError('pattern')).toBeNull();
  } else {
    expect(field.getError('pattern')).not.toBeNull();
  }
}
