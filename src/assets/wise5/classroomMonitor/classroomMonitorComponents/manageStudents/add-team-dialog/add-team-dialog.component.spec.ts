import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { WorkgroupService } from '../../../../../../app/services/workgroup.service';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { MoveUserConfirmDialogComponent } from '../move-user-confirm-dialog/move-user-confirm-dialog.component';
import { AddTeamDialogComponent } from './add-team-dialog.component';

class ConfigServiceStub {
  getRunId() {
    return 1;
  }
  getAllUsersInPeriod() {
    return [{ name: 'c' }, { name: 'b' }, { name: 'a' }];
  }
  retrieveConfig() {
    return of({});
  }
}
class TeacherDataServiceStub {
  getCurrentPeriodId() {
    return 1;
  }
}
class WorkgroupServiceStub {
  isUserInAnyWorkgroup() {}
  createWorkgroup() {
    return of(10);
  }
}
let component: AddTeamDialogComponent;
let fixture: ComponentFixture<AddTeamDialogComponent>;
let configService: ConfigService;
let workgroupService: WorkgroupService;
let dialog: MatDialog;
let http: HttpClient;
const period = {
  periodId: 1,
  periodName: '1'
};

describe('AddTeamDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AddTeamDialogComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [BrowserAnimationsModule,
        MatDialogModule,
        MatSnackBarModule],
    providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: TeacherDataService, useClass: TeacherDataServiceStub },
        { provide: WorkgroupService, useClass: WorkgroupServiceStub },
        { provide: MAT_DIALOG_DATA, useValue: period },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
  });

  beforeEach(() => {
    configService = TestBed.inject(ConfigService);
    dialog = TestBed.inject(MatDialog);
    http = TestBed.inject(HttpClient);
    workgroupService = TestBed.inject(WorkgroupService);
    fixture = TestBed.createComponent(AddTeamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  create();
  addTeamMember();
  deleteTeamMember();
  createTeam();
});

function create() {
  it('should create with all users in period sorted alphabetically', () => {
    expect(component).toBeTruthy();
    expect(component.allUsersInPeriod).toEqual([{ name: 'a' }, { name: 'b' }, { name: 'c' }]);
  });
}

function addTeamMember() {
  describe('addTeamMember()', () => {
    it('should move member from allUsersInPeriod to initialMembers', () => {
      component.addTeamMember({ name: 'b' });
      expectArrayEquals(component.initialTeamMembers, [{ name: 'b' }]);
      component.addTeamMember({ name: 'a' });
      expectArrayEquals(component.initialTeamMembers, [{ name: 'b' }, { name: 'a' }]);
    });
  });
}

function deleteTeamMember() {
  describe('deleteTeamMember()', () => {
    it('should move member from initialMembers to allUsersInPeriod', () => {
      component.initialTeamMembers = [{ name: 'd' }];
      component.deleteTeamMember(0);
      expectArrayEquals(component.initialTeamMembers, []);
    });
  });
}

function createTeam() {
  describe('createTeam()', () => {
    let dialogSpy;
    beforeEach(() => {
      component.initialTeamMembers = [{ id: 1, name: 'a' }];
      dialogSpy = spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(false)
      } as MatDialogRef<typeof MoveUserConfirmDialogComponent>);
    });
    it('should ask for confirmation when initialMember is in a workgroup', () => {
      spyOn(workgroupService, 'isUserInAnyWorkgroup').and.returnValue(true);
      component.createTeam();
      expect(dialogSpy).toHaveBeenCalled();
      expect(component.isProcessing).toBeFalsy();
    });
    it('should not ask for confirmation when initialMember is not in a workgroup', () => {
      spyOn(workgroupService, 'isUserInAnyWorkgroup').and.returnValue(false);
      const createWorkgroupSpy = spyOn(workgroupService, 'createWorkgroup').and.returnValue(of(10));
      component.createTeam();
      expect(dialogSpy).not.toHaveBeenCalled();
      expect(createWorkgroupSpy).toHaveBeenCalled();
    });
  });
}

function expectArrayEquals(arr1, arr2) {
  expect(arr1.length).toEqual(arr2.length);
  arr1.forEach((element, i) => {
    expect(arr1[i]).toEqual(arr2[i]);
  });
}
