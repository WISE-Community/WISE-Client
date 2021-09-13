import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { UpdateWorkgroupService } from '../../../../../../app/services/updateWorkgroupService';
import { ConfigService } from '../../../../services/configService';
import { ManageTeamComponent } from './manage-team.component';

class ConfigServiceStub {
  getPermissions() {}
  getAvatarColorForWorkgroupId() {}
  retrieveConfig() {
    return {};
  }
}

class UpdateWorkgroupServiceStub {}

let configService: ConfigService;
let fixture: ComponentFixture<ManageTeamComponent>;
let component: ManageTeamComponent;

describe('ManageTeamComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ManageTeamComponent],
      imports: [MatSnackBarModule],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: UpdateWorkgroupService, useClass: UpdateWorkgroupServiceStub },
        { provide: MatDialog, useValue: {} }
      ]
    });
  });
  beforeEach(() => {
    configService = TestBed.inject(ConfigService);
    fixture = TestBed.createComponent(ManageTeamComponent);
    component = fixture.componentInstance;
    component.team = { workgroupId: 3, users: [{ id: 1 }] };
  });
  changePeriodLinkVisible();
});

function changePeriodLinkVisible() {
  describe('change period link', () => {
    it('should appear when user has GradeStudentWork permission', () => {
      spyOnCanGradeStudentWork(true);
      fixture.detectChanges();
      expect(getChangePeriodLink()).toBeTruthy();
    });
    it('should not appear when user does not have GradeStudentWork permission', () => {
      spyOnCanGradeStudentWork(false);
      fixture.detectChanges();
      expect(getChangePeriodLink()).toBeFalsy();
    });
    it('should not appear when there are no members', () => {
      component.team.users = [];
      spyOnCanGradeStudentWork(true);
      fixture.detectChanges();
      expect(getChangePeriodLink()).toBeFalsy();
    });
  });
}

function spyOnCanGradeStudentWork(canGrade: boolean) {
  spyOn(configService, 'getPermissions').and.returnValue({
    canGradeStudentWork: canGrade,
    canViewStudentNames: true,
    canAuthorProject: true
  });
}

function getChangePeriodLink() {
  return fixture.debugElement.query(By.css('.change-period'));
}
