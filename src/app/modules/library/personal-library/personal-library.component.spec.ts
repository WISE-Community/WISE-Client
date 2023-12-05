import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PersonalLibraryComponent } from './personal-library.component';
import { fakeAsyncResponse } from '../../../student/student-run-list/student-run-list.component.spec';
import { LibraryService } from '../../../services/library.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { ArchiveProjectService } from '../../../services/archive-project.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LibraryProject } from '../libraryProject';
import { PersonalLibraryHarness } from './personal-library.harness';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { LibraryProjectComponent } from '../library-project/library-project.component';
import { LibraryProjectHarness } from '../library-project/library-project.harness';

let component: PersonalLibraryComponent;
let fixture: ComponentFixture<PersonalLibraryComponent>;
let harness: PersonalLibraryHarness;
const projectId1 = 1;
const projectId2 = 2;
const projectId3 = 3;

describe('PersonalLibraryComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          FormsModule,
          HttpClientTestingModule,
          MatDialogModule,
          MatFormFieldModule,
          MatOptionModule,
          MatSelectModule,
          MatSnackBarModule,
          OverlayModule
        ],
        declarations: [LibraryProjectComponent, PersonalLibraryComponent],
        providers: [ArchiveProjectService, LibraryService],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(async () => {
    fixture = TestBed.createComponent(PersonalLibraryComponent);
    component = fixture.componentInstance;
    TestBed.inject(LibraryService).personalLibraryProjectsSource$ = fakeAsyncResponse([
      new LibraryProject({ id: projectId1, metadata: {}, tags: ['archived'] }),
      new LibraryProject({ id: projectId2, metadata: {}, tags: ['archived'] }),
      new LibraryProject({ id: projectId3, metadata: {}, tags: [] })
    ]);
    fixture.detectChanges();
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, PersonalLibraryHarness);
  });

  showActiveProjects();
  showArchivedProjects();
});

function showActiveProjects() {
  describe('active units view', () => {
    it('only shows active units', async () => {
      expect(await getProjectIds(await harness.getProjects())).toEqual([projectId3]);
    });
  });
}

function showArchivedProjects() {
  describe('archived units view', () => {
    it('only shows archived units', async () => {
      await harness.showArchived();
      expect(await getProjectIds(await harness.getProjects())).toEqual([projectId2, projectId1]);
    });
  });
}

async function getProjectIds(projects: LibraryProjectHarness[]): Promise<number[]> {
  const projectIds = [];
  for (const project of projects) {
    projectIds.push(await project.getProjectId());
  }
  return projectIds;
}
