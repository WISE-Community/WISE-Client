import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotStudentComponent } from './forgot-student.component';
import { provideRouter } from '@angular/router';

describe('ForgotStudentComponent', () => {
  let component: ForgotStudentComponent;
  let fixture: ComponentFixture<ForgotStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ForgotStudentComponent],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(ForgotStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the username and password options', () => {
    const options = fixture.debugElement.nativeElement.querySelectorAll('app-call-to-action');
    expect(options.length).toBe(2);
    expect(options[0].getAttribute('headline')).toContain('Username');
    expect(options[1].getAttribute('headline')).toContain('Password');
  });
});
