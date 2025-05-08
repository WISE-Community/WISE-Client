import { ArchiveProjectResponse } from '../../../domain/archiveProjectResponse';
import { ArchiveProjectService } from '../../../services/archive-project.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { fakeAsyncResponse } from '../../../student/student-run-list/student-run-list.component.spec';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LibraryProject } from '../libraryProject';
import { LibraryService } from '../../../services/library.service';
import { of } from 'rxjs';
import { PersonalLibraryComponent } from './personal-library.component';
import { PersonalLibraryHarness } from './personal-library.harness';
import { ProjectTagService } from '../../../../assets/wise5/services/projectTagService';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

const archivedTag = { id: 1, text: 'archived', color: null };
let archiveProjectService: ArchiveProjectService;
let component: PersonalLibraryComponent;
let fixture: ComponentFixture<PersonalLibraryComponent>;
let harness: PersonalLibraryHarness;
let http: HttpClient;
const projectId1 = 1;
const projectId2 = 2;
const projectId3 = 3;
const projectId4 = 4;
const projectId5 = 5;

describe('PersonalLibraryComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, PersonalLibraryComponent],
      providers: [
        ArchiveProjectService,
        LibraryService,
        ProjectFilterValues,
        ProjectTagService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(PersonalLibraryComponent);
    component = fixture.componentInstance;
    setUpFiveProjects();
    archiveProjectService = TestBed.inject(ArchiveProjectService);
    http = TestBed.inject(HttpClient);
    fixture.detectChanges();
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, PersonalLibraryHarness);
  });

  showActiveProjects();
  showArchivedProjects();
  archiveMultipleProjects();
  restoreMultipleProjects();
  noProjectsSelected_clickSelectAllProjects_selectsAllProjects();
  someProjectsSelected_clickSelectAllProjects_unselectsAllProjects();
  allProjectsSelected_clickSelectAllProjects_unselectsAllProjects();
  projectsAreSelected_goToArchivedView_projectsAreUnselected();
  projectsAreSelected_goToNextPage_projectsAreUnselected();
  projectsAreSelected_performSearch_allProjectsAreUnselected();
});

function setUpFiveProjects() {
  TestBed.inject(LibraryService).personalLibraryProjectsSource$ = fakeAsyncResponse([
    new LibraryProject({
      id: projectId1,
      metadata: { title: 'Hello' },
      tags: [archivedTag]
    }),
    new LibraryProject({
      id: projectId2,
      metadata: { title: 'Hello World' },
      tags: [archivedTag]
    }),
    new LibraryProject({
      id: projectId3,
      metadata: { title: 'World Energy' },
      tags: []
    }),
    new LibraryProject({
      id: projectId4,
      metadata: { title: 'World Climate' },
      tags: []
    }),
    new LibraryProject({
      id: projectId5,
      metadata: { title: 'Recycling' },
      tags: []
    })
  ]);
}

function setUpTwentyProjects() {
  const libraryProjects = [];
  for (let i = 1; i <= 20; i++) {
    libraryProjects.push(new LibraryProject({ id: i, metadata: { title: '' }, tags: [] }));
  }
  TestBed.inject(LibraryService).personalLibraryProjectsSource$ =
    fakeAsyncResponse(libraryProjects);
}

function showActiveProjects() {
  describe('active units view', () => {
    it('only shows active units', async () => {
      expect(await harness.getProjectIdsInView()).toEqual([projectId5, projectId4, projectId3]);
    });
  });
}

function showArchivedProjects() {
  describe('archived units view', () => {
    it('only shows archived units', async () => {
      await harness.showArchivedView();
      expect(await harness.getProjectIdsInView()).toEqual([projectId2, projectId1]);
    });
  });
}

function archiveMultipleProjects() {
  describe('in active view', () => {
    describe('select multiple projects and click archive button', () => {
      it('archives multiple projects', async () => {
        await harness.selectProjects([projectId4, projectId3]);
        spyOn(http, 'put').and.returnValue(
          of([
            new ArchiveProjectResponse(4, true, archivedTag),
            new ArchiveProjectResponse(3, true, archivedTag)
          ])
        );
        await (await harness.getArchiveButton()).click();
        expect(await harness.getProjectIdsInView()).toEqual([projectId5]);
      });
    });
  });
}

function restoreMultipleProjects() {
  describe('in archived view', () => {
    describe('select multiple projects and click restore button', () => {
      it('restores multiple projects', async () => {
        await harness.showArchivedView();
        await harness.selectProjects([projectId2, projectId1]);
        spyOn(http, 'delete').and.returnValue(
          of([
            new ArchiveProjectResponse(2, false, archivedTag),
            new ArchiveProjectResponse(1, false, archivedTag)
          ])
        );
        await (await harness.getUnarchiveButton()).click();
        expect(await harness.getProjectIdsInView()).toEqual([]);
      });
    });
  });
}

function noProjectsSelected_clickSelectAllProjects_selectsAllProjects() {
  describe('no projects are selected', () => {
    describe('click the select all projects checkbox', () => {
      it('selects all projects in view', async () => {
        setUpTwentyProjects();
        component.ngOnInit();
        expect(await harness.getSelectedProjectIds()).toEqual([]);
        await (await harness.getSelectAllCheckbox()).check();
        // each page displays 12 projects
        const expectedSelectedProjectIds = generateExpectedProjectIds(20, 9);
        expect(await harness.getSelectedProjectIds()).toEqual(expectedSelectedProjectIds);
      });
    });
  });
}

function someProjectsSelected_clickSelectAllProjects_unselectsAllProjects() {
  describe('some projects are selected', () => {
    describe('click the select all projects checkbox', () => {
      it('unselects all projects', async () => {
        await harness.selectProjects([projectId4, projectId3]);
        expect(await harness.getSelectedProjectIds()).toEqual([projectId4, projectId3]);
        await (await harness.getSelectAllCheckbox()).check();
        expect(await harness.getSelectedProjectIds()).toEqual([]);
      });
    });
  });
}

function allProjectsSelected_clickSelectAllProjects_unselectsAllProjects() {
  describe('all projects are selected', () => {
    describe('click the select all projects checkbox', () => {
      it('unselects all projects', async () => {
        await harness.selectProjects([projectId5, projectId4, projectId3]);
        expect(await harness.getSelectedProjectIds()).toEqual([projectId5, projectId4, projectId3]);
        await (await harness.getSelectAllCheckbox()).uncheck();
        expect(await harness.getSelectedProjectIds()).toEqual([]);
      });
    });
  });
}

function projectsAreSelected_goToArchivedView_projectsAreUnselected() {
  describe('projects are selected', () => {
    describe('go to archived view', () => {
      it('projects are unselected', async () => {
        await harness.selectProjects([projectId5, projectId4, projectId3]);
        expect(await harness.getSelectedProjectIds()).toEqual([projectId5, projectId4, projectId3]);
        await harness.showArchivedView();
        expect(await harness.getSelectedProjectIds()).toEqual([]);
        await harness.showActiveView();
        expect(await harness.getSelectedProjectIds()).toEqual([]);
      });
    });
  });
}

function projectsAreSelected_goToNextPage_projectsAreUnselected() {
  describe('projects are selected', () => {
    describe('go to next page', () => {
      it('projects are unselected', async () => {
        setUpTwentyProjects();
        component.ngOnInit();
        await (await harness.getSelectAllCheckbox()).check();
        // each page displays 12 projects
        const expectedSelectedProjectIds = generateExpectedProjectIds(20, 9);
        expect(await harness.getSelectedProjectIds()).toEqual(expectedSelectedProjectIds);
        await (await harness.getPaginator()).goToNextPage();
        expect(await harness.getSelectedProjectIds()).toEqual([]);
        await (await harness.getPaginator()).goToPreviousPage();
        expect(await harness.getSelectedProjectIds()).toEqual([]);
      });
    });
  });
}

function projectsAreSelected_performSearch_allProjectsAreUnselected() {
  describe('projects are selected', () => {
    describe('perform search', () => {
      it('unselects all projects', async () => {
        await (await harness.getSelectAllCheckbox()).check();
        expect(await harness.getSelectedProjectIds()).toEqual([projectId5, projectId4, projectId3]);
        component.filterUpdated();
        expect(await harness.getSelectedProjectIds()).toEqual([]);
      });
    });
  });
}

function generateExpectedProjectIds(startProjectId: number, endProjectId: number): number[] {
  const expectedProjectIds = [];
  for (let i = startProjectId; i >= endProjectId; i--) {
    expectedProjectIds.push(i);
  }
  return expectedProjectIds;
}
