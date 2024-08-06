import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UpdateWorkgroupService } from '../../../../../../app/services/updateWorkgroupService';
import { ConfigService } from '../../../../services/configService';
import { ManageTeamComponent } from './manage-team.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ManageTeamHarness } from './manage-team.harness';
import { ManageStudentsModule } from '../manage-students.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { RemoveUserConfirmDialogComponent } from '../remove-user-confirm-dialog/remove-user-confirm-dialog.component';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

let component: ManageTeamComponent;
let configService: ConfigService;
let dialog: MatDialog;
let fixture: ComponentFixture<ManageTeamComponent>;
let getPermissionsSpy: jasmine.Spy;
let http: HttpClient;
let manageTeamHarness: ManageTeamHarness;
const studentName = 'a a';
const studentUsername = 'aa0101';

describe('ManageTeamComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
    declarations: [ManageTeamComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [BrowserAnimationsModule,
        ManageStudentsModule,
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule],
    providers: [ConfigService, UpdateWorkgroupService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    configService = TestBed.inject(ConfigService);
    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(ManageTeamComponent);
    http = TestBed.inject(HttpClient);
    getPermissionsSpy = spyOn(configService, 'getPermissions');
    spyOn(configService, 'getRunId').and.returnValue(1);
    spyOnCanGradeStudentWork(true);
    component = fixture.componentInstance;
    component.team = {
      workgroupId: 10,
      users: [{ id: 1, name: studentName, username: studentUsername }]
    };
    manageTeamHarness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      ManageTeamHarness
    );
  });
  changePeriodLinkVisibility();
  removeStudent();
});

function spyOnCanGradeStudentWork(canGrade: boolean) {
  getPermissionsSpy.and.returnValue({
    canGradeStudentWork: canGrade,
    canViewStudentNames: true,
    canAuthorProject: true
  });
}

function changePeriodLinkVisibility() {
  describe('change period link', () => {
    describe('teacher has GradeStudentWork permission', () => {
      it('makes change period link visible', async () => {
        expect(await manageTeamHarness.isChangePeriodLinkVisible()).toBeTrue();
      });
    });
    describe('teacher does not have GradeStudentWork permission', () => {
      it('makes change period link not visible', async () => {
        spyOnCanGradeStudentWork(false);
        component.ngOnInit();
        expect(await manageTeamHarness.isChangePeriodLinkVisible()).toBeFalse();
      });
    });
    describe('team has no members', () => {
      it('makes change period link not visible', async () => {
        component.team.users = [];
        expect(await manageTeamHarness.isChangePeriodLinkVisible()).toBeFalse();
      });
    });
  });
}

function removeStudent() {
  describe('removeStudent()', () => {
    describe('click remove student button on a student', () => {
      it('removes student from the team', async () => {
        spyOn(dialog, 'open').and.returnValue({
          afterClosed: () => of(true)
        } as MatDialogRef<typeof RemoveUserConfirmDialogComponent>);
        spyOn(http, 'delete').and.returnValue(of({}));
        await manageTeamHarness.clickRemoveUser(`${studentName} (${studentUsername})`);
        expect(await manageTeamHarness.getMemberCount()).toBe(0);
      });
    });
  });
}
