import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotTeacherUsernameCompleteComponent } from './forgot-teacher-username-complete.component';
import { provideRouter } from '@angular/router';

describe('ForgotTeacherUsernameCompleteComponent', () => {
  let component: ForgotTeacherUsernameCompleteComponent;
  let fixture: ComponentFixture<ForgotTeacherUsernameCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ForgotTeacherUsernameCompleteComponent],
      providers: [provideRouter([])]
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
