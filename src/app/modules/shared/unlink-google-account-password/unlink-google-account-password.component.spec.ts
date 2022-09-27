import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { PasswordService } from '../../../services/password.service';
import { UserService } from '../../../services/user.service';
import { UnlinkGoogleAccountPasswordComponent } from './unlink-google-account-password.component';

class MockUserService {
  unlinkGoogleUser(newPassword: string) {
    return of({});
  }
}

let component: UnlinkGoogleAccountPasswordComponent;
let fixture: ComponentFixture<UnlinkGoogleAccountPasswordComponent>;
let userService = new MockUserService();

describe('UnlinkGoogleAccountPasswordComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnlinkGoogleAccountPasswordComponent],
      imports: [BrowserAnimationsModule, ReactiveFormsModule, MatDialogModule],
      providers: [PasswordService, { provide: UserService, useValue: userService }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(UnlinkGoogleAccountPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  formSubmit_callUserServiceUnlinkGoogleUserFunction();
});

function formSubmit_callUserServiceUnlinkGoogleUserFunction() {
  it('should call UserService.UnlinkGoogleUserFunction when form is submitted', () => {
    const unlinkFunctionSpy = spyOn(userService, 'unlinkGoogleUser').and.returnValue(of({}));
    const newPassword = 'Abcd1234';
    component.newPasswordFormGroup.setValue({
      newPassword: newPassword,
      confirmNewPassword: newPassword
    });
    component.submit();
    expect(unlinkFunctionSpy).toHaveBeenCalledWith(newPassword);
  });
}
