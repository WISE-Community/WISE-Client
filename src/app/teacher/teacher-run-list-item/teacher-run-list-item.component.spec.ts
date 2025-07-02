import { ArchiveProjectResponse } from '../../domain/archiveProjectResponse';
import { ArchiveProjectService } from '../../services/archive-project.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../services/config.service';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { of } from 'rxjs';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { TeacherRun } from '../teacher-run';
import { TeacherRunListItemComponent } from './teacher-run-list-item.component';
import { TeacherRunListItemHarness } from './teacher-run-list-item.harness';
import { TeacherService } from '../teacher.service';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { User } from '../../domain/user';
import { UserService } from '../../services/user.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

export class MockTeacherService {}

export class MockConfigService {
  getContextPath(): string {
    return '/wise';
  }
  getCurrentServerTime(): number {
    return new Date('2018-08-24T00:00:00.0').getTime();
  }
  getWISE4Hostname(): string {
    return 'http://localhost:8080/legacy';
  }
}

const archivedTag = { id: 1, text: 'archived', color: null };
let component: TeacherRunListItemComponent;
let fixture: ComponentFixture<TeacherRunListItemComponent>;
let http: HttpClient;
const periods = ['1', '2'];
const projectName: string = 'Photosynthesis';
const numStudents: number = 30;
const runCode: string = 'Dog123';
let runListItemHarness: TeacherRunListItemHarness;
const userId: number = 1;
let userService: UserService;

describe('TeacherRunListItemComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TeacherRunListItemComponent],
      providers: [
        ArchiveProjectService,
        provideAnimations(),
        { provide: ConfigService, useClass: MockConfigService },
        ProjectTagService,
        { provide: TeacherService, useClass: MockTeacherService },
        UserService,
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([])
      ]
    });
    http = TestBed.inject(HttpClient);
    userService = TestBed.inject(UserService);
    spyOn(userService, 'getUserId').and.returnValue(userId);
    fixture = TestBed.createComponent(TeacherRunListItemComponent);
    component = fixture.componentInstance;
    component.run = new TeacherRun({
      id: 1,
      archived: false,
      selected: false,
      name: projectName,
      numStudents: numStudents,
      owner: new User({ id: userId }),
      periods: periods,
      project: {
        id: 1,
        tags: [],
        name: projectName,
        owner: new User({ id: userId })
      },
      runCode: runCode,
      startTime: new Date('2018-10-17').getTime(),
      endTime: new Date('2018-10-18').getTime()
    });
    fixture.detectChanges();
    runListItemHarness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      TeacherRunListItemHarness
    );
  });

  render();
  runArchiveStatusChanged();
});

function render() {
  describe('render', () => {
    it('should show run info', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.textContent).toContain(projectName);
      expect(compiled.textContent).toContain(`${periods.length} periods`);
      expect(compiled.textContent).toContain(`${numStudents} students`);
      expect(compiled.textContent).toContain(`Access Code: ${runCode}`);
    });
  });
}

function runArchiveStatusChanged() {
  describe('run is not archived and archive menu button is clicked', () => {
    it('should archive run and emit events', async () => {
      expect(await runListItemHarness.isArchived()).toBeFalse();
      spyOn(http, 'put').and.returnValue(of(new ArchiveProjectResponse(1, true, archivedTag)));
      await runListItemHarness.clickArchiveMenuButton();
      expect(await runListItemHarness.isArchived()).toBeTrue();
    });
  });
}
