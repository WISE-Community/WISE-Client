import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordRequirementComponent } from './password-requirement.component';
import { FormControl } from '@angular/forms';
import { PasswordRequirementHarness } from './password-requirement.harness';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatIconModule } from '@angular/material/icon';

let component: PasswordRequirementComponent;
let fixture: ComponentFixture<PasswordRequirementComponent>;
let passwordRequirementHarness: PasswordRequirementHarness;

describe('PasswordRequirementComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordRequirementComponent],
      imports: [MatIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordRequirementComponent);
    component = fixture.componentInstance;
    component.passwordFormControl = new FormControl();
    fixture.detectChanges();
    passwordRequirementHarness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      PasswordRequirementHarness
    );
  });

  requirementIsPristine();
  requirementIsFailed();
  requirementIsPassed();
});

function requirementIsPristine(): void {
  describe('form control is pristine', () => {
    it('shows no icon', async () => {
      expect(await passwordRequirementHarness.isPristine()).toBeTrue();
    });
  });
}

function requirementIsFailed(): void {
  describe('requirement is failed', () => {
    beforeEach(() => {
      component.errorFieldName = 'missingLetter';
      component.requirementText = 'include a letter';
      component.passwordFormControl.setErrors({ missingLetter: true });
      component.passwordFormControl.markAsDirty();
    });
    it('shows error icon', async () => {
      expect(await passwordRequirementHarness.isFail()).toBeTrue();
    });
  });
}

function requirementIsPassed(): void {
  describe('requirement is passed', () => {
    beforeEach(() => {
      component.passwordFormControl.markAsDirty();
    });
    it('shows success icon', async () => {
      expect(await passwordRequirementHarness.isPass()).toBeTrue();
    });
  });
}
