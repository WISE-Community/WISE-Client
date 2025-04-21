import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicLibraryComponent } from './public-library.component';
import { MockProvider } from 'ng-mocks';
import { LibraryService } from '../../../services/library.service';
import { of } from 'rxjs';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';
import { LibraryProject } from '../libraryProject';

describe('PublicLibraryComponent', () => {
  let component: PublicLibraryComponent;
  let fixture: ComponentFixture<PublicLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLibraryComponent],
      providers: [
        MockProvider(LibraryService, {
          projectFilterValuesSource$: of(new ProjectFilterValues()),
          communityLibraryProjectsSource$: of([
            { id: 1, name: 'P1' },
            { id: 2, name: 'P2' }
          ] as LibraryProject[]),
          officialLibraryProjectsSource$: of([
            { id: 1, name: 'P1' },
            { id: 3, name: 'P3' }
          ] as LibraryProject[])
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should remove duplicate units', () => {
    expect(component['projects'].length).toBe(3);
  });
});
