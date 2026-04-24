import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PasswordModule } from '../../../password/password.module';
import { UserService } from '../../../services/user.service';
import { UnlinkGoogleAccountPasswordComponent } from './unlink-google-account-password.component';
import { PasswordRequirementComponent } from '../../../password/password-requirement/password-requirement.component';

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
      imports: [PasswordModule, UnlinkGoogleAccountPasswordComponent],
      providers: [{ provide: UserService, useValue: userService }]
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
    const newPassword = PasswordRequirementComponent.VALID_PASSWORD;
    component.newPasswordFormGroup.setValue({
      newPassword: newPassword,
      confirmNewPassword: newPassword
    });
    component.submit();
    expect(unlinkFunctionSpy).toHaveBeenCalledWith(newPassword);
  });
}
