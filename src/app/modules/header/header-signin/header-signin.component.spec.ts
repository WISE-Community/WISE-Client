import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HeaderSigninComponent } from './header-signin.component';
import { provideRouter } from '@angular/router';

describe('HeaderSigninComponent', () => {
  let component: HeaderSigninComponent;
  let fixture: ComponentFixture<HeaderSigninComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HeaderSigninComponent],
        providers: [provideRouter([])]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
