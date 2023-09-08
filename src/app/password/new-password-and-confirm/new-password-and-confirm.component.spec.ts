import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewPasswordAndConfirmComponent } from './new-password-and-confirm.component';
import { MatIconModule } from '@angular/material/icon';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NewPasswordAndConfirmHarness } from './new-password-and-confirm.harness';
import { PasswordModule } from '../password.module';
import { PasswordErrors } from '../../domain/password/password-errors';

let component: NewPasswordAndConfirmComponent;
let fixture: ComponentFixture<NewPasswordAndConfirmComponent>;
const INVALID_PASSWORD_MISSING_LETTER = '1234567!';
const INVALID_PASSWORD_MISSING_NUMBER = 'abcdefg!';
const INVALID_PASSWORD_MISSING_SYMBOL = 'abcd1234';
const INVALID_PASSWORD_TOO_SHORT = 'abcd12!';
let newPasswordAndConfirmHarness: NewPasswordAndConfirmHarness;
const VALID_PASSWORD = 'abcd123!';

describe('NewPasswordAndConfirmComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPasswordAndConfirmComponent],
      imports: [
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        PasswordModule,
        ReactiveFormsModule
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(NewPasswordAndConfirmComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    fixture.detectChanges();
    newPasswordAndConfirmHarness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      NewPasswordAndConfirmHarness
    );
  });
  newPasswordValidation();
  confirmPasswordValidation();
});

function newPasswordValidation() {
  passwordIsMissing();
  passwordIsValid();
  passwordErrorCases();
}

function passwordIsMissing(): void {
  describe('password is missing', () => {
    it('shows password required error', async () => {
      await newPasswordAndConfirmHarness.setNewPassword('');
      expect(await newPasswordAndConfirmHarness.isNewPasswordRequiredErrorDisplayed()).toBeTrue();
    });
  });
}

function passwordIsValid(): void {
  describe('password is valid', () => {
    it('does not show any error', async () => {
      await newPasswordAndConfirmHarness.setNewPassword(VALID_PASSWORD);
      expect(await newPasswordAndConfirmHarness.isNewPasswordRequiredErrorDisplayed()).toBeFalse();
    });
  });
}

function passwordErrorCases(): void {
  const errorCases = [
    {
      descriptionText: 'missing a letter',
      password: INVALID_PASSWORD_MISSING_LETTER,
      expectedErrors: new PasswordErrors(true, false, false, false)
    },
    {
      descriptionText: 'missing a number',
      password: INVALID_PASSWORD_MISSING_NUMBER,
      expectedErrors: new PasswordErrors(false, true, false, false)
    },
    {
      descriptionText: 'missing a symbol',
      password: INVALID_PASSWORD_MISSING_SYMBOL,
      expectedErrors: new PasswordErrors(false, false, true, false)
    },
    {
      descriptionText: 'too short',
      password: INVALID_PASSWORD_TOO_SHORT,
      expectedErrors: new PasswordErrors(false, false, false, true)
    }
  ];
  errorCases.forEach(({ descriptionText, password, expectedErrors }) => {
    describe(`password is ${descriptionText}`, () => {
      beforeEach(async () => {
        await newPasswordAndConfirmHarness.setNewPassword(password);
      });
      it(`shows password is ${descriptionText} message`, async () => {
        await checkPasswordRequirements(expectedErrors);
      });
    });
  });
}

async function checkPasswordRequirements(passwordErrors: PasswordErrors): Promise<void> {
  expect(await newPasswordAndConfirmHarness.isMissingLetter()).toBe(passwordErrors.missingLetter);
  expect(await newPasswordAndConfirmHarness.isMissingNumber()).toBe(passwordErrors.missingNumber);
  expect(await newPasswordAndConfirmHarness.isMissingSymbol()).toBe(passwordErrors.missingSymbol);
  expect(await newPasswordAndConfirmHarness.isTooShort()).toBe(passwordErrors.tooShort);
}

function confirmPasswordValidation() {
  describe('passwords do not match', () => {
    it('shows password does not match error', async () => {
      await newPasswordAndConfirmHarness.setNewPassword('a');
      await newPasswordAndConfirmHarness.setConfirmNewPassword('b');
      expect(
        await newPasswordAndConfirmHarness.isConfirmNewPasswordDoesNotMatchErrorDisplayed()
      ).toBeTrue();
    });
  });

  describe('passwords match', () => {
    it('does not show any error', async () => {
      await newPasswordAndConfirmHarness.setNewPassword(VALID_PASSWORD);
      await newPasswordAndConfirmHarness.setConfirmNewPassword(VALID_PASSWORD);
      expect(
        await newPasswordAndConfirmHarness.isConfirmNewPasswordDoesNotMatchErrorDisplayed()
      ).toBeFalse();
    });
  });
}
