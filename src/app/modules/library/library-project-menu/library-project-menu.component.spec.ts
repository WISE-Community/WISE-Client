import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { LibraryProjectMenuComponent } from './library-project-menu.component';
import { TeacherService } from '../../../teacher/teacher.service';
import { Project } from '../../../domain/project';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from '../../../services/user.service';
import { User } from '../../../domain/user';
import { Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { ArchiveProjectService } from '../../../services/archive-project.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { LibraryProjectMenuHarness } from './library-project-menu.harness';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export class MockUserService {
  getUser(): Observable<User[]> {
    const user: User = new User();
    user.firstName = 'Demo';
    user.lastName = 'Teacher';
    user.roles = ['teacher'];
    user.username = 'DemoTeacher';
    user.id = 123456;
    return Observable.create((observer) => {
      observer.next(user);
      observer.complete();
    });
  }
  getUserId(): number {
    return 123456;
  }
}

export class MockTeacherService {
  getProjectUsage(projectId: number): Observable<number> {
    return Observable.create((observer) => {
      observer.next(projectId);
      observer.complete();
    });
  }
}

export class MockConfigService {
  getContextPath(): string {
    return '';
  }
}

const archivedTag = { id: 1, text: 'archived', color: null };
let component: LibraryProjectMenuComponent;
let fixture: ComponentFixture<LibraryProjectMenuComponent>;
let harness: LibraryProjectMenuHarness;

describe('LibraryProjectMenuComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    declarations: [LibraryProjectMenuComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [BrowserAnimationsModule,
        MatDialogModule,
        MatMenuModule,
        MatSnackBarModule],
    providers: [
        ArchiveProjectService,
        { provide: TeacherService, useClass: MockTeacherService },
        { provide: UserService, useClass: MockUserService },
        { provide: ConfigService, useClass: MockConfigService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
    })
  );

  beforeEach(async () => {
    fixture = TestBed.createComponent(LibraryProjectMenuComponent);
    component = fixture.componentInstance;
    const project: Project = new Project();
    project.id = 1;
    project.name = 'Photosynthesis';
    const user = new User();
    user.id = 123456;
    user.username = 'Spongebob Squarepants';
    user.displayName = 'Spongebob Squarepants';
    project.owner = user;
    project.tags = [];
    component.project = project;
    fixture.detectChanges();
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, LibraryProjectMenuHarness);
  });

  showsArchiveButton();
  showsRestoreButton();
});

function showsArchiveButton() {
  describe('project does not have archived tag', () => {
    it('shows archive button', async () => {
      expect(await harness.hasArchiveMenuButton()).toBe(true);
    });
  });
}

function showsRestoreButton() {
  describe('project has archived tag', () => {
    beforeEach(() => {
      component.project.tags = [archivedTag];
      component.ngOnInit();
    });
    it('shows restore button', async () => {
      expect(await harness.hasRestoreMenuButton()).toBe(true);
    });
  });
}
