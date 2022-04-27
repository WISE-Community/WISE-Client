import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { UnlinkGoogleAccountConfirmComponent } from './unlink-google-account-confirm.component';

let component: UnlinkGoogleAccountConfirmComponent;
let fixture: ComponentFixture<UnlinkGoogleAccountConfirmComponent>;

describe('UnlinkGoogleAccountConfirmComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnlinkGoogleAccountConfirmComponent],
      imports: [MatDialogModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(UnlinkGoogleAccountConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  continue_closeAllDialogsAndOpenChangePasswordDialog();
});

function continue_closeAllDialogsAndOpenChangePasswordDialog() {
  it('continue() should closeAllDialogs and open a new dialog to edit password', () => {
    const closeAllDialogSpy = spyOn(component.dialog, 'closeAll');
    const openDialogSpy = spyOn(component.dialog, 'open');
    component.continue();
    expect(closeAllDialogSpy).toHaveBeenCalled();
    expect(openDialogSpy).toHaveBeenCalled();
  });
}
