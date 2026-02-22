import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { TeacherService } from '../../../../../../app/teacher/teacher.service';
import { ConfigService } from '../../../../services/configService';
import { ChangeStudentPasswordDialogComponent } from './change-student-password-dialog.component';

class ConfigServiceStub {
  getPermissions() {
    return true;
  }
  getRunId() {
    return 1;
  }
  isGoogleUser() {
    return false;
  }
}
class TeacherServiceStub {
  changeStudentPassword() {}
}
const user = { id: 1 };
let component: ChangeStudentPasswordDialogComponent;
let fixture: ComponentFixture<ChangeStudentPasswordDialogComponent>;
let teacherService: TeacherService;
let snackBar: MatSnackBar;
let dialog: MatDialog;
let snackBarOpenSpy, dialogCloseAllSpy;

describe('ChangeStudentPasswordDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeStudentPasswordDialogComponent],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: TeacherService, useClass: TeacherServiceStub },
        { provide: MAT_DIALOG_DATA, useValue: user }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    teacherService = TestBed.inject(TeacherService);
    snackBar = TestBed.inject(MatSnackBar);
    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(ChangeStudentPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  changePassword();
});

function changePassword() {
  describe('changePassword()', () => {
    beforeEach(() => {
      snackBarOpenSpy = spyOn(snackBar, 'open');
      dialogCloseAllSpy = spyOn(dialog, 'closeAll');
    });
    afterEach(() => {
      expect(component.isChangingPassword).toBeFalsy();
    });
    changePassword_success_closeDialog();
    changePassword_failure_keepDialogOpen();
  });
}

function changePassword_success_closeDialog() {
  it('should close dialog on success', () => {
    spyOn(teacherService, 'changeStudentPassword').and.returnValue(of({}));
    component.changePassword();
    expect(snackBarOpenSpy).toHaveBeenCalled();
    expect(dialogCloseAllSpy).toHaveBeenCalled();
  });
}

function changePassword_failure_keepDialogOpen() {
  it('should keep dialog open on failure', () => {
    spyOn(teacherService, 'changeStudentPassword').and.returnValue(
      throwError({
        error: { messageCode: 'invalidPassword' }
      })
    );
    component.changePassword();
    expect(dialogCloseAllSpy).not.toHaveBeenCalled();
  });
}
