import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurriculumComponent } from './curriculum.component';
import { MockComponents, MockProvider } from 'ng-mocks';
import { LibraryService } from '../services/library.service';
import { of } from 'rxjs';
import { ProjectFilterValues } from '../domain/projectFilterValues';
import { LibraryFiltersComponent } from '../modules/library/library-filters/library-filters.component';
import { PublicLibraryComponent } from '../modules/library/public-library/public-library.component';

describe('CurriculumComponent', () => {
  let component: CurriculumComponent;
  let fixture: ComponentFixture<CurriculumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponents(LibraryFiltersComponent, PublicLibraryComponent)],
      imports: [CurriculumComponent],
      providers: [
        MockProvider(LibraryService, {
          projectFilterValuesSource$: of({} as ProjectFilterValues),
          communityLibraryProjectsSource$: of([])
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
