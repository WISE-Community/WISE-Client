import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { ConfigService } from '../../../../services/configService';
import { RemoveUserConfirmDialogComponent } from './remove-user-confirm-dialog.component';

class ConfigServiceStub {
  getPermissions() {}
}

let configService: ConfigService;
let component: RemoveUserConfirmDialogComponent;
let fixture: ComponentFixture<RemoveUserConfirmDialogComponent>;

describe('RemoveUserConfirmDialogComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveUserConfirmDialogComponent],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      imports: [MatDialogModule]
    });
    configService = TestBed.inject(ConfigService);
    fixture = TestBed.createComponent(RemoveUserConfirmDialogComponent);
    component = fixture.componentInstance;
    component.user = { id: 1, name: 'Oski Bear', username: 'oskib0101' };
  });

  userNameDisplay();
});

function userNameDisplay() {
  describe('user name', () => {
    it('should display username if user has canViewStudentNames permission', () => {
      spyOnCanViewStudentNames(true);
      fixture.detectChanges();
      expect(getStudentName()).toContain('Oski Bear (oskib0101)');
    });
    it('should display Student Id if user does not have canViewStudentNames permission', () => {
      spyOnCanViewStudentNames(false);
      fixture.detectChanges();
      expect(getStudentName()).toContain('Student 1');
    });
  });
}

function spyOnCanViewStudentNames(canView: boolean) {
  spyOn(configService, 'getPermissions').and.returnValue({
    canGradeStudentWork: true,
    canViewStudentNames: canView,
    canAuthorProject: true
  });
}

function getStudentName() {
  return fixture.debugElement.query(By.css('.student-name')).nativeElement.textContent;
}
