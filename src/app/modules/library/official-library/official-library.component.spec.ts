import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OfficialLibraryComponent } from './official-library.component';
import { fakeAsyncResponse } from '../../../student/student-run-list/student-run-list.component.spec';
import { LibraryService } from '../../../services/library.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LibraryGroup } from '../libraryGroup';
import { MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { OverlayModule } from '@angular/cdk/overlay';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';

export class MockLibraryService {
  libraryGroupsSource$ = fakeAsyncResponse({});
  officialLibraryProjectsSource$ = fakeAsyncResponse([]);
  filterValuesUpdated$ = of();
  implementationModelOptions: LibraryGroup[] = [];
  numberOfPublicProjectsVisible = new BehaviorSubject<number>(0);
  getOfficialLibraryProjects() {}
  getFilterValues() {
    return new ProjectFilterValues();
  }
}

describe('OfficialLibraryComponent', () => {
  let component: OfficialLibraryComponent;
  let fixture: ComponentFixture<OfficialLibraryComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule, MatDialogModule],
      declarations: [OfficialLibraryComponent],
      providers: [{ provide: LibraryService, useClass: MockLibraryService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficialLibraryComponent);
    component = fixture.componentInstance;
    component.projects = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
