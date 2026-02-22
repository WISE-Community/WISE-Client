import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../services/config.service';
import { CurriculumComponent } from './curriculum.component';
import { LibraryFiltersComponent } from '../modules/library/library-filters/library-filters.component';
import { LibraryService } from '../services/library.service';
import { MockComponents, MockProvider, MockProviders } from 'ng-mocks';
import { PersonalLibraryComponent } from '../modules/library/personal-library/personal-library.component';
import { PublicLibraryComponent } from '../modules/library/public-library/public-library.component';
import { UserService } from '../services/user.service';
import { provideRouter } from '@angular/router';

describe('CurriculumComponent', () => {
  let component: CurriculumComponent;
  let fixture: ComponentFixture<CurriculumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CurriculumComponent,
        MockComponents(LibraryFiltersComponent, PersonalLibraryComponent, PublicLibraryComponent)
      ],
      providers: [
        MockProviders(ConfigService, UserService),
        MockProvider(LibraryService, {
          communityLibraryProjectsSource$: of([]),
          numberOfPublicProjectsVisible$: of(3),
          numberOfPersonalProjectsVisible$: of(2)
        }),
        provideRouter([])
      ]
    }).compileComponents();
    spyOn(TestBed.inject(ConfigService), 'getAuthoringToolLink').and.returnValue('');

    fixture = TestBed.createComponent(CurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should hide My Units tab and authoring tool link when not logged in as a teacher', () => {
    spyOn(TestBed.inject(UserService), 'isTeacher').and.returnValue(false);
    component.ngOnInit();
    fixture.detectChanges();
    expect(numAuthoringToolButtonElements(fixture)).toEqual(0);
    expect(numTabNavBarElements(fixture)).toEqual(0);
  });

  it('should show My Units tab and teacher home and authoring tool links when logged in as teacher', () => {
    spyOn(TestBed.inject(UserService), 'isTeacher').and.returnValue(true);
    component.ngOnInit();
    fixture.detectChanges();
    expect(numAuthoringToolButtonElements(fixture)).toEqual(2);
    expect(numTabNavBarElements(fixture)).toEqual(1);
    expect(component['showMyUnits']).toBeTruthy();
  });
});

function numAuthoringToolButtonElements(fixture: ComponentFixture<CurriculumComponent>) {
  return fixture.debugElement.nativeElement.querySelectorAll('header * a').length;
}

function numTabNavBarElements(fixture: ComponentFixture<CurriculumComponent>) {
  return fixture.debugElement.nativeElement.querySelectorAll('nav').length;
}
