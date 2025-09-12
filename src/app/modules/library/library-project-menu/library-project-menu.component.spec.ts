import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LibraryProjectMenuComponent } from './library-project-menu.component';
import { TeacherService } from '../../../teacher/teacher.service';
import { Project } from '../../../domain/project';
import { UserService } from '../../../services/user.service';
import { User } from '../../../domain/user';
import { ConfigService } from '../../../services/config.service';
import { ArchiveProjectService } from '../../../services/archive-project.service';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { LibraryProjectMenuHarness } from './library-project-menu.harness';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MockProviders } from 'ng-mocks';

let component: LibraryProjectMenuComponent;
let fixture: ComponentFixture<LibraryProjectMenuComponent>;
let harness: LibraryProjectMenuHarness;
describe('LibraryProjectMenuComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, LibraryProjectMenuComponent],
      providers: [
        MockProviders(ArchiveProjectService, ConfigService, TeacherService, UserService),
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
  }));

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
    project.metadata = { publicUnitType: null };
    component.project = project;
    fixture.detectChanges();
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, LibraryProjectMenuHarness);
  });

  showsArchiveButton();
  showsRestoreButton();
  hideArchiveAndRestoreButtons();
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
      component.project.tags = [{ id: 1, text: 'archived', color: null }];
      component.ngOnInit();
    });
    it('shows restore button', async () => {
      expect(await harness.hasRestoreMenuButton()).toBe(true);
    });
  });
}

function hideArchiveAndRestoreButtons() {
  describe('project is public', () => {
    beforeEach(() => {
      component.project.metadata.publicUnitType = 'wiseTested';
      component.ngOnInit();
    });
    it('does not show archive or restore buttons', async () => {
      expect(await harness.hasRestoreMenuButton()).toBe(false);
      expect(await harness.hasArchiveMenuButton()).toBe(false);
    });
  });
}
