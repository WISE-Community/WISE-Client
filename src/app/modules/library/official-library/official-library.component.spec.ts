import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OfficialLibraryComponent } from './official-library.component';
import { fakeAsyncResponse } from '../../../student/student-run-list/student-run-list.component.spec';
import { LibraryService } from '../../../services/library.service';
import { LibraryGroup } from '../libraryGroup';
import { BehaviorSubject, of } from 'rxjs';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';

export class MockLibraryService {
  libraryGroupsSource$ = fakeAsyncResponse({});
  officialLibraryProjectsSource$ = fakeAsyncResponse([]);
  implementationModelOptions: LibraryGroup[] = [];
  numberOfPublicProjectsVisible = new BehaviorSubject<number>(0);
  getOfficialLibraryProjects() {}
}

describe('OfficialLibraryComponent', () => {
  let component: OfficialLibraryComponent;
  let fixture: ComponentFixture<OfficialLibraryComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OfficialLibraryComponent],
      providers: [{ provide: LibraryService, useClass: MockLibraryService }, ProjectFilterValues]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficialLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
