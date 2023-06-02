import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { defer, Observable } from 'rxjs';
import { TeacherRunListComponent } from './teacher-run-list.component';
import { TeacherService } from '../teacher.service';
import { Project } from '../../domain/project';
import { TeacherRun } from '../teacher-run';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../services/user.service';

class TeacherScheduleStubComponent {}

export function fakeAsyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

export class MockTeacherService {
  getRuns(): Observable<TeacherRun[]> {
    const runs: TeacherRun[] = [];
    const run1 = new TeacherRun();
    run1.id = 1;
    run1.name = 'Photosynthesis';
    run1.numStudents = 30;
    run1.periods = ['1', '2'];
    run1.startTime = new Date('2018-01-01T00:00:00.0').getTime();
    const project1 = new Project();
    project1.id = 1;
    project1.name = 'Photosynthesis';
    project1.projectThumb = '';
    run1.project = project1;
    const run2 = new TeacherRun();
    run2.id = 2;
    run2.name = 'Plate Tectonics';
    run2.numStudents = 15;
    run2.periods = ['3', '4'];
    run2.startTime = new Date('2018-03-03T00:00:00.0').getTime();
    const project2 = new Project();
    project2.id = 1;
    project2.name = 'Plate Tectonics';
    project2.projectThumb = '';
    run2.project = project2;
    runs.push(run1);
    runs.push(run2);
    return Observable.create((observer) => {
      observer.next(runs);
      observer.complete();
    });
  }
  runs$ = fakeAsyncResponse({
    id: 3,
    name: 'Global Climate Change',
    periods: ['1', '2']
  });
}

export class MockConfigService {
  getCurrentServerTime(): number {
    return new Date('2018-08-24T00:00:00.0').getTime();
  }
}

export class MockUserService {
  getUserId(): number {
    return 1;
  }
}

describe('TeacherRunListComponent', () => {
  let component: TeacherRunListComponent;
  let fixture: ComponentFixture<TeacherRunListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TeacherRunListComponent],
        imports: [
          RouterTestingModule.withRoutes([
            { path: 'teacher/home/schedule', component: TeacherScheduleStubComponent }
          ])
        ],
        providers: [
          { provide: TeacherService, useClass: MockTeacherService },
          { provide: ConfigService, useClass: MockConfigService },
          { provide: UserService, useClass: MockUserService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherRunListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function isRunsSortedByStartTimeDesc(runs: TeacherRun[]): boolean {
    let previous: number = null;
    for (let run of runs) {
      let current = run.startTime;
      if (previous && previous < current) {
        return false;
      }
      previous = current;
    }
    return true;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort runs by start date', () => {
    const run3 = new TeacherRun();
    run3.id = 3;
    run3.name = 'Planet Earth';
    run3.numStudents = 10;
    run3.periods = ['6', '7'];
    run3.startTime = new Date('2018-02-02T00:00:00.0').getTime();
    const project3 = new Project();
    project3.id = 1;
    project3.name = 'Planet Earth';
    project3.projectThumb = '';
    run3.project = project3;
    component.runs.push(run3);
    component.runs.sort(component.sortByStartTimeDesc);
    expect(isRunsSortedByStartTimeDesc(component.runs)).toBeTruthy();
  });
});