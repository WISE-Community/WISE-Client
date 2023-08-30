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

let component: NewPasswordAndConfirmComponent;
let fixture: ComponentFixture<NewPasswordAndConfirmComponent>;
const INVALID_PASSWORD_MISSING_LETTER = '1234567!';
const INVALID_PASSWORD_MISSING_NUMBER = 'abcdefg!';
const INVALID_PASSWORD_MISSING_SYMBOL = 'abcd1234';
const INVALID_PASSWORD_SHORT_LENGTH = 'abcd12!';
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
  describe('password is missing', () => {
    it('should show password required error', async () => {
      await newPasswordAndConfirmHarness.setNewPassword('');
      expect(await newPasswordAndConfirmHarness.isNewPasswordRequiredErrorDisplayed()).toBeTrue();
    });
  });
  describe('password is valid', () => {
    it('should not show any error', async () => {
      await newPasswordAndConfirmHarness.setNewPassword(VALID_PASSWORD);
      expect(await newPasswordAndConfirmHarness.isNewPasswordRequiredErrorDisplayed()).toBeFalse();
    });
  });
  describe('password is missing a letter', () => {
    it('should indicate password needs to include a letter', async () => {
      await setPasswordAndExepctErrors(INVALID_PASSWORD_MISSING_LETTER, true, false, false, false);
    });
  });
  describe('password is missing a number', () => {
    it('should indicate password needs to include a number', async () => {
      await setPasswordAndExepctErrors(INVALID_PASSWORD_MISSING_NUMBER, false, true, false, false);
    });
  });
  describe('password is missing a symbol', () => {
    it('should indicate password needs to include a symbol', async () => {
      await setPasswordAndExepctErrors(INVALID_PASSWORD_MISSING_SYMBOL, false, false, true, false);
    });
  });
  describe('password is too short', () => {
    it('should indicate password needs to be longer', async () => {
      await setPasswordAndExepctErrors(INVALID_PASSWORD_SHORT_LENGTH, false, false, false, true);
    });
  });
}

async function setPasswordAndExepctErrors(
  password: string,
  expectedMissingLetter: boolean,
  expectedMissingNumber: boolean,
  expectedMissingSymbol: boolean,
  expectedTooShort: boolean
): Promise<void> {
  await newPasswordAndConfirmHarness.setNewPassword(password);
  await checkPasswordRequirements(
    expectedMissingLetter,
    expectedMissingNumber,
    expectedMissingSymbol,
    expectedTooShort
  );
}

async function checkPasswordRequirements(
  expectedMissingLetter: boolean,
  expectedMissingNumber: boolean,
  expectedMissingSymbol: boolean,
  expectedTooShort: boolean
): Promise<void> {
  expect(await newPasswordAndConfirmHarness.isMissingLetter()).toBe(expectedMissingLetter);
  expect(await newPasswordAndConfirmHarness.isMissingNumber()).toBe(expectedMissingNumber);
  expect(await newPasswordAndConfirmHarness.isMissingSymbol()).toBe(expectedMissingSymbol);
  expect(await newPasswordAndConfirmHarness.isTooShort()).toBe(expectedTooShort);
}

function confirmPasswordValidation() {
  describe('passwords do not match', () => {
    it('should show password does not match error', async () => {
      await newPasswordAndConfirmHarness.setNewPassword('a');
      await newPasswordAndConfirmHarness.setConfirmNewPassword('b');
      expect(
        await newPasswordAndConfirmHarness.isConfirmNewPasswordDoesNotMatchErrorDisplayed()
      ).toBeTrue();
    });
  });

  describe('passwords match', () => {
    it('should not show any error', async () => {
      await newPasswordAndConfirmHarness.setNewPassword(VALID_PASSWORD);
      await newPasswordAndConfirmHarness.setConfirmNewPassword(VALID_PASSWORD);
      expect(
        await newPasswordAndConfirmHarness.isConfirmNewPasswordDoesNotMatchErrorDisplayed()
      ).toBeFalse();
    });
  });
}
