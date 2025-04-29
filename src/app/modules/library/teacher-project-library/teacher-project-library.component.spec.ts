import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TeacherProjectLibraryComponent } from './teacher-project-library.component';
import { MatMenuModule } from '@angular/material/menu';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { LibraryService } from '../../../services/library.service';
import { defer } from 'rxjs';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';

export function fakeAsyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

export class MockLibraryService {
  numberOfPublicProjectsVisible$ = fakeAsyncResponse(0);
  numberOfPersonalProjectsVisible$ = fakeAsyncResponse(0);
  newProjectSource$ = fakeAsyncResponse(0);
  getOfficialLibraryProjects() {}
  getCommunityLibraryProjects() {}
  getPersonalLibraryProjects() {}
  getSharedLibraryProjects() {}
  getFilterValues() {
    return new ProjectFilterValues();
  }
  initFilterValues() {}
}

describe('TeacherProjectLibraryComponent', () => {
  let component: TeacherProjectLibraryComponent;
  let fixture: ComponentFixture<TeacherProjectLibraryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatMenuModule, RouterTestingModule],
      declarations: [TeacherProjectLibraryComponent],
      providers: [{ provide: LibraryService, useClass: MockLibraryService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherProjectLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
