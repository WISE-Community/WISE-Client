import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { configureTestSuite } from 'ng-bullet';
import { ConfigService } from '../../../../services/configService';
import { ManageUserComponent } from './manage-user.component';

class ConfigServiceStub {
  getPermissions() {}
  getRunId() {
    return 123;
  }
  retrieveConfig() {
    return {};
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
      imports: [BrowserAnimationsModule, HttpClientTestingModule, MatSnackBarModule],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: MatDialog, useValue: {} }
      ]
    });
  });
  beforeEach(() => {
    configService = TestBed.inject(ConfigService);
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ManageUserComponent);
    component = fixture.componentInstance;
    component.user = { id: 1, name: 'oski bear', username: 'oskib0101' };
  });
  makeRequestToRemoveStudent();
});

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
