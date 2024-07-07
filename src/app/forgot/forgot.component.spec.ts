import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ForgotComponent } from './forgot.component';
import { provideRouter } from '@angular/router';

describe('ForgotComponent', () => {
  let component: ForgotComponent;
  let fixture: ComponentFixture<ForgotComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ForgotComponent],
        providers: [provideRouter([])]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
