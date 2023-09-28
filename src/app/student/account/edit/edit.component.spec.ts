import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditComponent } from './edit.component';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({ selector: 'app-edit-password', template: '' })
class EditPasswordComponent {}

@Component({ selector: 'student-edit-profile', template: '' })
class StudentEditProfileComponent {}

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditComponent],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
