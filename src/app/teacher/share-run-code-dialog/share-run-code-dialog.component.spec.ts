import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ShareRunCodeDialogComponent } from './share-run-code-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfigService } from '../../services/config.service';
import { TeacherService } from '../teacher.service';
import { UserService } from '../../services/user.service';
import { TeacherRun } from '../teacher-run';
import { Project } from '../../domain/project';
import { AccessLinkService } from '../../services/accessLinkService';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MockProvider } from 'ng-mocks';

const runObj = new TeacherRun();
runObj.id = 1;
runObj.runCode = 'Dog123';
const project = new Project();
project.id = 1;
project.name = 'Photosynthesis';
runObj.project = project;
runObj.isSurveyRun = () => false;

export class MockConfigService {
  getWISEHostname(): string {
    return 'http://localhost:8080';
  }

  getContextPath(): string {
    return '';
  }

  isGoogleClassroomEnabled() {
    return true;
  }
}

export class MockTeacherService {}

export class MockUserService {
  isGoogleUser() {
    return true;
  }
}

let component: ShareRunCodeDialogComponent;
let fixture: ComponentFixture<ShareRunCodeDialogComponent>;
describe('ShareRunCodeDialogComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ShareRunCodeDialogComponent],
      imports: [
        BrowserAnimationsModule,
        ClipboardModule,
        MatDialogModule,
        MatIconModule,
        MatSnackBarModule
      ],
      providers: [
        MockProvider(AccessLinkService),
        { provide: ConfigService, useClass: MockConfigService },
        { provide: TeacherService, useClass: MockTeacherService },
        { provide: UserService, useClass: MockUserService },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: runObj }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareRunCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show run info', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain('Photosynthesis (Run ID: 1)');
  });

  defaultRun();
  surveyRun();
});

function defaultRun() {
  describe('when run is a default run', () => {
    beforeEach(() => {
      component.run.isSurveyRun = () => false;
      fixture.detectChanges();
    });
    it('should show access links to share with students', () => {
      const textContent = fixture.debugElement.nativeElement.textContent;
      expect(textContent).toContain('Copy this link to share with your students:');
      expect(textContent).toContain(
        `http://localhost:8080/login?accessCode=${component.run.runCode}`
      );
    });
  });
}

function surveyRun() {
  describe('when run is a survey run', () => {
    beforeEach(() => {
      component.run.isSurveyRun = () => true;
      spyOn(TestBed.inject(AccessLinkService), 'getAccessLinks').and.returnValue([
        'http://localhost:8080/run-survey/Dog123-1'
      ]);
      component.ngOnInit();
      fixture.detectChanges();
    });
    it('should show access links to share with participants', () => {
      const textContent = fixture.debugElement.nativeElement.textContent;
      expect(textContent).toContain('Copy this link to share with participants:');
      expect(textContent).toContain(`http://localhost:8080/run-survey/Dog123-1`);
    });
  });
}
