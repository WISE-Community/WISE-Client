import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStudentPasswordDialogComponent } from './change-student-password-dialog.component';

describe('ChangeStudentPasswordDialogComponent', () => {
  let component: ChangeStudentPasswordDialogComponent;
  let fixture: ComponentFixture<ChangeStudentPasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeStudentPasswordDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStudentPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
