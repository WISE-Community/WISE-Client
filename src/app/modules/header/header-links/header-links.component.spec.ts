import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderLinksComponent } from './header-links.component';
import { User } from '../../../domain/user';
import { provideRouter } from '@angular/router';

describe('HeaderLinksComponent', () => {
  let component: HeaderLinksComponent;
  let fixture: ComponentFixture<HeaderLinksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeaderLinksComponent],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(HeaderLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show header sign in if no user is logged in', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('app-header-signin').length).toBe(1);
  });
});
