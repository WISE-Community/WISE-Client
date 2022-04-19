import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ForgotTeacherUsernameCompleteComponent } from './forgot-teacher-username-complete.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ForgotTeacherUsernameCompleteComponent', () => {
  let component: ForgotTeacherUsernameCompleteComponent;
  let fixture: ComponentFixture<ForgotTeacherUsernameCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotTeacherUsernameCompleteComponent],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ForgotTeacherUsernameCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the confirmation message', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain(
      'Your username has been sent to your email'
    );
  });
});
