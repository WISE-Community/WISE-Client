import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { NotebookItemComponent } from './notebook-item.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: NotebookItemComponent;

describe('NotebookItemComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [NotebookItemComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    const fixture = TestBed.createComponent(NotebookItemComponent);
    component = fixture.componentInstance;
    component.notebookUpdatedSubscription = new Subscription();
  });

  isItemInGroup();
  isNotebookItemActive();
});

function isItemInGroup() {
  it('should check if an notebook item is in group when it is not in the group', () => {
    component.item = { groups: ['Group A'] };
    expect(component.isItemInGroup('Group B')).toEqual(false);
  });
  it('should check if an notebook item is in group when it is in the group', () => {
    component.item = { groups: ['Group A'] };
    expect(component.isItemInGroup('Group A')).toEqual(true);
  });
}

function isNotebookItemActive() {
  it('should check if a notebook item is active when it is not active', () => {
    component.item = { serverDeleteTime: 1607704074794 };
    expect(component.isNotebookItemActive()).toEqual(false);
  });
  it('should check if a notebook item is active when it is active', () => {
    component.item = { serverDeleteTime: null };
    expect(component.isNotebookItemActive()).toEqual(true);
  });
}
