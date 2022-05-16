import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowWorkStudentComponent } from './show-work-student.component';

describe('ShowWorkStudentComponent', () => {
  let component: ShowWorkStudentComponent;
  let fixture: ComponentFixture<ShowWorkStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowWorkStudentComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowWorkStudentComponent);
    component = fixture.componentInstance;
    component.studentWork = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
