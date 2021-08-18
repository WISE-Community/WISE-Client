import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { ConfigService } from '../../../../services/configService';
import { ManageUserComponent } from './manage-user.component';

class ConfigServiceStub {
  getPermissions() {}
  getRunId() {
    return 123;
  }
}

let configService: ConfigService;
let fixture: ComponentFixture<ManageUserComponent>;
let component: ManageUserComponent;
let http: HttpTestingController;

describe('ManageUserComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ManageUserComponent],
      imports: [HttpClientTestingModule, MatSnackBarModule],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: MatDialog, useValue: {} }
      ]
    });
    configService = TestBed.inject(ConfigService);
  });
  beforeEach(() => {
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ManageUserComponent);
    component = fixture.componentInstance;
    component.user = { id: 1, name: 'oski bear', username: 'oskib0101' };
  });
  userNameDisplay();
  makeRequestToRemoveStudent();
});

function userNameDisplay() {
  describe('user name', () => {
    it('should show username when user has ViewStudentNames permission', () => {
      spyOnCanViewStudentNames(true);
      fixture.detectChanges();
      expect(getUsername()).toEqual('oski bear (oskib0101)');
    });
    it('should show user id when user does not have ViewStudentNames permission', () => {
      spyOnCanViewStudentNames(false);
      fixture.detectChanges();
      expect(getUsername()).toEqual('Student 1');
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

function getUsername(): string {
  return fixture.debugElement.query(By.css('.username')).nativeElement.textContent;
}

function makeRequestToRemoveStudent() {
  describe('preformRemoveUser()', () => {
    it('should make request to remove student from unit and then to retrieve config', () => {
      component.performRemoveUser();
      const req = http.expectOne(`/api/teacher/run/123/student/1/remove`);
      expect(req.request.method).toEqual('DELETE');
      req.flush({});
      http.verify();
    });
  });
}
