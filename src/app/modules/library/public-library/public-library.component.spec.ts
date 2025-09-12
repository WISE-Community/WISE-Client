import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicLibraryComponent } from './public-library.component';
import { MockProvider } from 'ng-mocks';
import { LibraryService } from '../../../services/library.service';
import { of } from 'rxjs';
import { LibraryProject } from '../libraryProject';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';

describe('PublicLibraryComponent', () => {
  let component: PublicLibraryComponent;
  let fixture: ComponentFixture<PublicLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLibraryComponent],
      providers: [
        MockProvider(LibraryService, {
          communityLibraryProjectsSource$: of([
            { id: 1, metadata: { publicUnitType: 'wiseTested', unitType: 'Platform' } },
            { id: 2, metadata: { publicUnitType: 'wiseTested', unitType: 'Platform' } }
          ] as LibraryProject[]),
          officialLibraryProjectsSource$: of([
            { id: 1, metadata: { publicUnitType: 'wiseTested', unitType: 'Platform' } },
            { id: 3, metadata: { publicUnitType: 'communityBuilt', unitType: 'Platform' } }
          ] as LibraryProject[])
        }),
        ProjectFilterValues
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should remove duplicates and order units', () => {
    expect(component['filteredProjects'].map((p) => p.id)).toEqual([2, 1, 3]);
  });
});
