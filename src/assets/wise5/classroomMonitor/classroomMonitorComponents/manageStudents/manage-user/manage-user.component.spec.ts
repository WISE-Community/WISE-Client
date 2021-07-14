import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { ConfigService } from '../../../../services/configService';
import { ManageUserComponent } from './manage-user.component';

class ConfigServiceStub {
  getPermissions() {}
}

let configService: ConfigService;
let fixture: ComponentFixture<ManageUserComponent>;
let component: ManageUserComponent;

describe('ManageUserComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ManageUserComponent],
      providers: [{ provide: ConfigService, useClass: ConfigServiceStub }]
    });
    configService = TestBed.inject(ConfigService);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserComponent);
    component = fixture.componentInstance;
    component.user = { id: 1, name: 'oski bear', username: 'oskib0101' };
  });
  userNameDisplay();
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
