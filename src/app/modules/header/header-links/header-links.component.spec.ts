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
    const user: User = new User();
    user.id = 1;
    user.firstName = 'Amanda';
    user.lastName = 'Panda';
    user.roles = ['student'];
    user.username = 'AmandaP0101';
    component.user = user;
    component.location = 'student';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show user welcome message', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.header__links').textContent).toContain('Welcome Amanda!');
  });
});
