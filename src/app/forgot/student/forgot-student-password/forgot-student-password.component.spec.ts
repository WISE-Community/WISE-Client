import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotStudentPasswordComponent } from './forgot-student-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentService } from '../../../student/student.service';
import { provideRouter, Router } from '@angular/router';
import { Observable } from 'rxjs';

export class MockStudentService {
  getSecurityQuestion(username: string): Observable<any> {
    return Observable.create((observer) => {
      observer.next({
        status: 'success',
        messageCode: 'usernameFound'
      });
      observer.complete();
    });
  }
}

describe('ForgotStudentPasswordComponent', () => {
  let component: ForgotStudentPasswordComponent;
  let fixture: ComponentFixture<ForgotStudentPasswordComponent>;

  const submitAndReceiveResponse = (studentServiceFunctionName, status, messageCode) => {
    const studentService = TestBed.get(StudentService);
    const observableResponse = createObservableResponse(status, messageCode);
    spyOn(studentService, studentServiceFunctionName).and.returnValue(observableResponse);
    component.submit();
    fixture.detectChanges();
  };

  const createObservableResponse = (status, messageCode) => {
    const observableResponse = Observable.create((observer) => {
      const response = {
        status: status,
        messageCode: messageCode
      };
      observer.next(response);
      observer.complete();
    });
    return observableResponse;
  };

  const getErrorMessage = () => {
    const errorMessageDiv = fixture.debugElement.nativeElement.querySelector('.warn');
    return errorMessageDiv.textContent;
  };

  const getSubmitButton = () => {
    return fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ForgotStudentPasswordComponent],
      providers: [{ provide: StudentService, useClass: MockStudentService }, provideRouter([])]
    });
    fixture = TestBed.createComponent(ForgotStudentPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button when the username field is not filled in', () => {
    fixture.detectChanges();
    const submitButton = getSubmitButton();
    expect(submitButton.disabled).toBe(true);
  });

  it('should enable the search button when the username field is filled in', () => {
    component.setControlFieldValue('username', 'SpongebobS0101');
    fixture.detectChanges();
    const submitButton = getSubmitButton();
    expect(submitButton.disabled).toBe(false);
  });

  it('should show the username not found message', () => {
    submitAndReceiveResponse('getSecurityQuestion', 'failure', 'usernameNotFound');
    expect(getErrorMessage()).toContain('We could not find that username');
  });

  it('should navigate to the answer security question page', () => {
    const router = TestBed.get(Router);
    const navigateSpy = spyOn(router, 'navigate');
    const username = 'SpongebobS0101';
    const questionKey = 'QUESTION_ONE';
    const question = 'What is your favorite snack?';
    component.goToQuestionPage(username, questionKey, question);
    const params = {
      username: username,
      questionKey: questionKey,
      question: question
    };
    expect(navigateSpy).toHaveBeenCalledWith(['/forgot/student/password/security'], {
      queryParams: params,
      skipLocationChange: true
    });
  });
});
