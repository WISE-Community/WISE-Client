import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGuidanceStudentComponent } from './dialog-guidance-student.component';

describe('DialogGuidanceStudentComponent', () => {
  let component: DialogGuidanceStudentComponent;
  let fixture: ComponentFixture<DialogGuidanceStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogGuidanceStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGuidanceStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
