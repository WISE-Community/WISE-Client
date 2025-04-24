import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurriculumComponent } from './curriculum.component';
import { MockComponents, MockProvider, MockProviders } from 'ng-mocks';
import { LibraryService } from '../services/library.service';
import { BehaviorSubject, of } from 'rxjs';
import { ProjectFilterValues } from '../domain/projectFilterValues';
import { LibraryFiltersComponent } from '../modules/library/library-filters/library-filters.component';
import { PublicLibraryComponent } from '../modules/library/public-library/public-library.component';
import { ConfigService } from '../services/config.service';
import { UserService } from '../services/user.service';
import { User } from '../domain/user';

describe('CurriculumComponent', () => {
  let component: CurriculumComponent;
  let fixture: ComponentFixture<CurriculumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponents(LibraryFiltersComponent, PublicLibraryComponent)],
      imports: [CurriculumComponent],
      providers: [
        MockProviders(ConfigService, UserService),
        MockProvider(LibraryService, {
          projectFilterValuesSource$: of({} as ProjectFilterValues),
          communityLibraryProjectsSource$: of([]),
          numberOfPublicProjectsVisible$: of(3),
          numberOfPersonalProjectsVisible$: of(2)
        })
      ]
    }).compileComponents();
    spyOn(TestBed.inject(ConfigService), 'getAuthoringToolLink').and.returnValue('');
    spyOn(TestBed.inject(UserService), 'getUser').and.returnValue(
      new BehaviorSubject<User>(new User())
    );

    fixture = TestBed.createComponent(CurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
