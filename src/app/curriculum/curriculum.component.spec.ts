import { BehaviorSubject, of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../services/config.service';
import { CurriculumComponent } from './curriculum.component';
import { LibraryFiltersComponent } from '../modules/library/library-filters/library-filters.component';
import { LibraryService } from '../services/library.service';
import { MockComponents, MockProvider, MockProviders } from 'ng-mocks';
import { PersonalLibraryComponent } from '../modules/library/personal-library/personal-library.component';
import { ProjectFilterValues } from '../domain/projectFilterValues';
import { PublicLibraryComponent } from '../modules/library/public-library/public-library.component';
import { User } from '../domain/user';
import { UserService } from '../services/user.service';

describe('CurriculumComponent', () => {
  let component: CurriculumComponent;
  let fixture: ComponentFixture<CurriculumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponents(LibraryFiltersComponent, PersonalLibraryComponent, PublicLibraryComponent)
      ],
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

    fixture = TestBed.createComponent(CurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide My Units tab and authoring tool link when not logged in', () => {
    spyOn(TestBed.inject(UserService), 'getUser').and.returnValue(
      new BehaviorSubject<User>(new User())
    );
    component.ngOnInit();
    fixture.detectChanges();
    expect(numAuthoringToolButtonElements(fixture)).toEqual(0);
    expect(numTabGroupElements(fixture)).toEqual(0);
  });

  it('should hide My Units tab and authoring tool link when logged in as student', () => {
    spyOn(TestBed.inject(UserService), 'getUser').and.returnValue(
      new BehaviorSubject<User>(new User({ roles: ['student'] }))
    );
    component.ngOnInit();
    fixture.detectChanges();
    expect(numAuthoringToolButtonElements(fixture)).toEqual(0);
    expect(numTabGroupElements(fixture)).toEqual(0);
  });

  it('should show My Units tab and authoring tool link when logged in as teacher', () => {
    spyOn(TestBed.inject(UserService), 'getUser').and.returnValue(
      new BehaviorSubject<User>(new User({ roles: ['teacher'] }))
    );
    component.ngOnInit();
    fixture.detectChanges();
    expect(numAuthoringToolButtonElements(fixture)).toEqual(1);
    expect(numTabGroupElements(fixture)).toEqual(1);
    expect(component['showMyUnits']).toBeTruthy();
  });
});

function numAuthoringToolButtonElements(fixture: ComponentFixture<CurriculumComponent>) {
  return fixture.debugElement.nativeElement.querySelectorAll('.authoring-tool-button').length;
}

function numTabGroupElements(fixture: ComponentFixture<CurriculumComponent>) {
  return fixture.debugElement.nativeElement.querySelectorAll('mat-tab-group').length;
}
