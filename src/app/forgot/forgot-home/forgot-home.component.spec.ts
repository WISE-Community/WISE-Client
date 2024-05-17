import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotHomeComponent } from './forgot-home.component';
import { provideRouter } from '@angular/router';

describe('ForgotHomeComponent', () => {
  let component: ForgotHomeComponent;
  let fixture: ComponentFixture<ForgotHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ForgotHomeComponent],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(ForgotHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the student and teacher options', () => {
    const options = fixture.debugElement.nativeElement.querySelectorAll('app-call-to-action');
    expect(options.length).toBe(2);
    expect(options[0].getAttribute('headline')).toContain('Student');
    expect(options[1].getAttribute('headline')).toContain('Teacher');
  });
});
