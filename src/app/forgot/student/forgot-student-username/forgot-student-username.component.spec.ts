import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotStudentUsernameComponent } from './forgot-student-username.component';
import { StudentService } from '../../../student/student.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

class MockStudentService {
  getStudentUsernames = jasmine.createSpy('getStudentUsernames').and.returnValue(of([]));
}

describe('ForgotStudentUsernameComponent', () => {
  let component: ForgotStudentUsernameComponent;
  let fixture: ComponentFixture<ForgotStudentUsernameComponent>;
  let studentService: MockStudentService;

  const getSubmitButton = () => {
    return fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
  };

  beforeEach(() => {
    studentService = new MockStudentService();
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ForgotStudentUsernameComponent],
      providers: [{ provide: StudentService, useValue: studentService }, provideRouter([])]
    });
    fixture = TestBed.createComponent(ForgotStudentUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the no usernames found message', () => {
    component.foundUsernames = [];
    component.setMessageForFoundUsernames();
    component.showSearchResults = true;
    fixture.detectChanges();
    const message = fixture.debugElement.nativeElement.querySelector('.warn');
    expect(message.textContent).toContain('We did not find any usernames');
  });

  it('should show the found a username message', () => {
    component.foundUsernames = ['SpongebobSquarepants'];
    component.setMessageForFoundUsernames();
    component.showSearchResults = true;
    fixture.detectChanges();
    const message = fixture.debugElement.nativeElement.querySelector('.info');
    expect(message.textContent).toContain('We found a username');
  });

  it('should show the found multiple usernames message', () => {
    component.foundUsernames = ['SpongebobSquarepants', 'PatrickStar'];
    component.setMessageForFoundUsernames();
    component.showSearchResults = true;
    fixture.detectChanges();
    const message = fixture.debugElement.nativeElement.querySelector('.info');
    expect(message.textContent).toContain('We found multiple usernames');
  });

  it('should disable the search button when the fields are not filled in', () => {
    fixture.detectChanges();
    const submitButton = getSubmitButton();
    expect(submitButton.disabled).toBe(true);
  });

  it('should enable the search button with first and last name alone', () => {
    component.setControlFieldValue('firstName', 'Spongebob');
    component.setControlFieldValue('lastName', 'Squarepants');
    fixture.detectChanges();
    const submitButton = getSubmitButton();
    expect(submitButton.disabled).toBe(false);
    expect(
      fixture.debugElement.nativeElement.querySelector('[formControlName="birthMonth"]')
    ).toBeNull();
    expect(
      fixture.debugElement.nativeElement.querySelector('[formControlName="birthDay"]')
    ).toBeNull();
  });

  it('should search with names alone and display the no-match message', () => {
    component.setControlFieldValue('firstName', 'Spongebob');
    component.setControlFieldValue('lastName', 'Squarepants');
    component.submit();
    fixture.detectChanges();

    expect(studentService.getStudentUsernames).toHaveBeenCalledOnceWith('Spongebob', 'Squarepants');
    expect(fixture.debugElement.nativeElement.querySelector('.warn').textContent).toContain(
      'We did not find any usernames'
    );
  });

  it('should navigate to the login page', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    const username = 'SpongebobS0101';
    component.loginWithUsername(username);
    expect(navigateSpy).toHaveBeenCalledWith(['/login', { username: username }]);
  });

  it('should navigate to the login page when a username is clicked', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    component.foundUsernames = ['SpongebobS0101'];
    component.showSearchResults = true;
    fixture.detectChanges();
    const usernameLink = fixture.debugElement.nativeElement.querySelector('.username-btn');
    usernameLink.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/login', { username: 'SpongebobS0101' }]);
  });
});
