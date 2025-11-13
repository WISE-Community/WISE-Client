import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomePageProjectLibraryComponent } from './home-page-project-library.component';
import { LibraryService } from '../../../services/library.service';
import { MockComponents } from 'ng-mocks';
import { LibraryFiltersComponent } from '../library-filters/library-filters.component';
import { provideRouter } from '@angular/router';
import { OfficialLibraryComponent } from '../official-library/official-library.component';

export class MockLibraryService {
  getOfficialLibraryProjects() {}
  clearAll() {}
}

describe('HomePageProjectLibraryComponent', () => {
  let component: HomePageProjectLibraryComponent;
  let fixture: ComponentFixture<HomePageProjectLibraryComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HomePageProjectLibraryComponent,
        MockComponents(OfficialLibraryComponent, LibraryFiltersComponent)
      ],
      providers: [{ provide: LibraryService, useClass: MockLibraryService }, provideRouter([])]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageProjectLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
