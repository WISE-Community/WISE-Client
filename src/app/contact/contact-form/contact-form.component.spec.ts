import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ContactFormComponent } from './contact-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { StudentService } from '../../student/student.service';
import { User } from '../../domain/user';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LibraryService } from '../../services/library.service';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { getErrorMessage } from '../../common/test-helper';

export class MockStudentService {
  getTeacherList(): Observable<User> {
    return Observable.create(new User());
  }
}

export class MockLibraryService {}

let component: ContactFormComponent;
let configService: ConfigService;
let fixture: ComponentFixture<ContactFormComponent>;
let http: HttpClient;
let isRecaptchaEnabledSpy: jasmine.Spy;
const recaptchaPrivateKey = '123';
let recaptchaV3Service: ReCaptchaV3Service;
let userService: UserService;

describe('ContactFormComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContactFormComponent],
        imports: [
          BrowserAnimationsModule,
          HttpClientTestingModule,
          MatInputModule,
          MatSelectModule,
          ReactiveFormsModule,
          RecaptchaV3Module,
          RouterTestingModule
        ],
        providers: [
          ConfigService,
          { provide: LibraryService, useClass: MockLibraryService },
          { provide: RECAPTCHA_V3_SITE_KEY, useValue: recaptchaPrivateKey },
          { provide: StudentService, useClass: MockStudentService },
          UserService
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    configService = TestBed.inject(ConfigService);
    recaptchaV3Service = TestBed.inject(ReCaptchaV3Service);
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(ContactFormComponent);
    http = TestBed.inject(HttpClient);
    isRecaptchaEnabledSpy = spyOn(configService, 'isRecaptchaEnabled');
    isRecaptchaEnabledSpy.and.returnValue(false);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show the email field if the user is not signed in', () => {
    const userService = TestBed.inject(UserService);
    userService.isSignedIn = () => {
      return false;
    };
    userService.isStudent = () => {
      return false;
    };
    component.showEmailIfNecessary();
    const emailInput = fixture.debugElement.nativeElement.querySelector('input[name="email"]');
    expect(emailInput).not.toBeNull();
  });

  it('should show the email field if the user is signed in as a teacher', () => {
    const userService = TestBed.inject(UserService);
    userService.isSignedIn = () => {
      return true;
    };
    userService.isStudent = () => {
      return false;
    };
    component.showEmailIfNecessary();
    const emailInput = fixture.debugElement.nativeElement.querySelector('input[name="email"]');
    expect(emailInput).not.toBeNull();
  });

  it('should not show the email field if the user is signed in as a student', () => {
    const userService = TestBed.inject(UserService);
    userService.isSignedIn = () => {
      return true;
    };
    userService.isStudent = () => {
      return true;
    };
    component.showEmailIfNecessary();
    const emailInput = fixture.debugElement.nativeElement.querySelector('input[name="email"]');
    expect(emailInput).not.toBeNull();
  });

  it('should auto populate the name field if the user is signed in', () => {
    spyOn(userService, 'isSignedIn').and.returnValue(true);
    spyOn(userService, 'isStudent').and.returnValue(false);
    spyOn(userService, 'getUser').and.returnValue(
      new BehaviorSubject(new User({ firstName: 'Demo', lastName: 'User', username: 'DemoUser' }))
    );
    component.ngOnInit();
    const nameInput = fixture.debugElement.nativeElement.querySelector('input[name="name"]');
    const name = nameInput.valueOf().value;
    expect(name).toBe('Demo User');
  });

  it("should have its submit button disabled if the form isn't filled out", () => {
    const submitButton = fixture.debugElement.nativeElement.querySelector('button');
    expect(submitButton.disabled).toBe(true);
  });

  it('should have its submit button enabled if the form is filled out', () => {
    component.setControlFieldValue('name', 'Spongebob');
    component.setControlFieldValue('email', 'spongebob@bikinibottom.com');
    component.setControlFieldValue('issueType', 'OTHER');
    component.setControlFieldValue('summary', 'I have a problem');
    component.setControlFieldValue('description', 'My mouse is broken');
    fixture.detectChanges();
    const submitButton = fixture.debugElement.nativeElement.querySelector('button');
    expect(submitButton.disabled).toBe(false);
  });

  submit();
});

function submit(): void {
  describe('submit()', () => {
    submit_showErrorMessage();
    submit_showRecaptchaErrorMessage();
    submit_showSuccess();
  });
}

function submit_showErrorMessage(): void {
  it('should show error message', async () => {
    const httpPostSpy = httpPostSpyAndReturn('error');
    await submitAndDetectChanges();
    expect(httpPostSpy).toHaveBeenCalled();
    expect(getErrorMessage(fixture)).toContain(
      'Sorry, there was a problem submitting the form. Please try again.'
    );
  });
}

function submit_showRecaptchaErrorMessage(): void {
  it('should show recaptcha error message', async () => {
    isRecaptchaEnabledSpy.and.returnValue(true);
    component.ngOnInit();
    spyOn(recaptchaV3Service, 'execute').and.returnValue(of('generated-token'));
    const httpPostSpy = httpPostSpyAndReturn('error');
    await submitAndDetectChanges();
    expect(httpPostSpy).toHaveBeenCalled();
    expect(getErrorMessage(fixture)).toContain(
      'Recaptcha failed. Please reload the page and try again!'
    );
  });
}

function submit_showSuccess(): void {
  it('should successfully submit', async () => {
    const httpPostSpy = httpPostSpyAndReturn('success');
    await submitAndDetectChanges();
    expect(httpPostSpy).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain(
      'Your message has been sent. We will get back to you as soon as possible.'
    );
  });
}

async function submitAndDetectChanges(): Promise<void> {
  await component.submit();
  fixture.detectChanges();
}

function httpPostSpyAndReturn(status: string): jasmine.Spy {
  return spyOn(http, 'post').and.returnValue(of({ status: status }));
}
