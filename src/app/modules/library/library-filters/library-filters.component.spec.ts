import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LibraryFiltersComponent } from './library-filters.component';
import { LibraryService } from '../../../services/library.service';
import sampleLibraryProjects from '../sampleLibraryProjects';
import { SimpleChange } from '@angular/core';
import { LibraryProject } from '../libraryProject';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';

describe('LibraryFiltersComponent', () => {
  let component: LibraryFiltersComponent;
  let fixture: ComponentFixture<LibraryFiltersComponent>;
  let projects: LibraryProject[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibraryFiltersComponent],
      providers: [
        MockProvider(LibraryService, {
          officialLibraryProjectsSource$: of([] as LibraryProject[]),
          communityLibraryProjectsSource$: of([] as LibraryProject[]),
          sharedLibraryProjectsSource$: of([] as LibraryProject[]),
          personalLibraryProjectsSource$: of([] as LibraryProject[])
        }),
        ProjectFilterValues
      ]
    });
    projects = sampleLibraryProjects;
    fixture = TestBed.createComponent(LibraryFiltersComponent);
    component = fixture.componentInstance;
    component['libraryProjects'] = projects;
    component.ngOnChanges({ projects: new SimpleChange(null, projects, true) });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the filter options', () => {
    expect(component['libraryProjects'].length).toBe(2);
    expect(component['standardOptions'].length).toBe(4);
    expect(component['disciplineOptions'].length).toBe(2);
  });

  it('should call ProjectFilterValues.emitUpdated when the search value changes', waitForAsync(() => {
    const spy = spyOn(TestBed.inject(ProjectFilterValues), 'emitUpdated');
    component['searchUpdated']('photo');
    expect(spy).toHaveBeenCalled();
  }));

  it('should call ProjectFilterValues.emitUpdated when a filter value changes', waitForAsync(() => {
    const spy = spyOn(TestBed.inject(ProjectFilterValues), 'emitUpdated');
    component['filterUpdated'](['Earth Sciences', 'Physical Sciences'], 'discipline');
    expect(spy).toHaveBeenCalled();
  }));
});
