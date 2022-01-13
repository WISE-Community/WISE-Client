import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMyWorkStudentComponent } from './show-my-work-student.component';

describe('ShowMyWorkStudentComponent', () => {
  let component: ShowMyWorkStudentComponent;
  let fixture: ComponentFixture<ShowMyWorkStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowMyWorkStudentComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMyWorkStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
