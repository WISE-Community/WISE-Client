import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { ManageShowStudentInfoComponent } from './manage-show-student-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class ConfigServiceStub {
  getPermissions() {}
}

let configService: ConfigService;
let fixture: ComponentFixture<ManageShowStudentInfoComponent>;
let http: HttpTestingController;
let component: ManageShowStudentInfoComponent;
const user: any = {};

describe('ManageShowStudentInfoComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [ManageShowStudentInfoComponent],
    imports: [BrowserAnimationsModule, MatDialogModule],
    providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: MAT_DIALOG_DATA, useValue: user },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    configService = TestBed.inject(ConfigService);
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ManageShowStudentInfoComponent);
    component = fixture.componentInstance;
  });
  usernameVisible();
});

function usernameVisible() {
  describe('username', () => {
    it('should appear when user has ViewStudentNames permission', () => {
      spyOnCanViewStudentNames(true);
      fixture.detectChanges();
      expect(getUsernameDisplays().length).toEqual(2);
    });
    it('should not appear when user does not have ViewStudentNames permission', () => {
      spyOnCanViewStudentNames(false);
      fixture.detectChanges();
      expect(getUsernameDisplays().length).toEqual(0);
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

function getUsernameDisplays() {
  return fixture.debugElement.nativeElement.querySelectorAll('.username');
}
