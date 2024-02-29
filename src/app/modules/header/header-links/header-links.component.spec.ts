import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HeaderLinksComponent } from './header-links.component';
import { User } from '../../../domain/user';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HeaderLinksComponent', () => {
  let component: HeaderLinksComponent;
  let fixture: ComponentFixture<HeaderLinksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderLinksComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA]
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
