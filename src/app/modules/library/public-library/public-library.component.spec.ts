import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicLibraryComponent } from './public-library.component';
import { MockProvider } from 'ng-mocks';
import { LibraryService } from '../../../services/library.service';
import { of } from 'rxjs';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';

describe('PublicLibraryComponent', () => {
  let component: PublicLibraryComponent;
  let fixture: ComponentFixture<PublicLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLibraryComponent],
      providers: [
        MockProvider(LibraryService, {
          projectFilterValuesSource$: of({} as ProjectFilterValues),
          communityLibraryProjectsSource$: of([]),
          officialLibraryProjectsSource$: of([])
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
