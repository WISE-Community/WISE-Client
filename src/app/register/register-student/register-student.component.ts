import { Component } from '@angular/core';
import { GoogleUser } from '../../modules/google-sign-in/GoogleUser';
import { AbstractRegisterUserComponent } from '../abstract-register-user.component';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.scss']
})
export class RegisterStudentComponent extends AbstractRegisterUserComponent {
  protected firstName: string = '';
  protected joinFormPath: string = '/join/student/form';
  protected lastName: string = '';

  protected getFormParams(): any {
    return { firstName: this.firstName, lastName: this.lastName };
  }

  protected getGoogleFormParams(credential: GoogleUser): any {
    return { gID: credential.sub, name: credential.name };
  }
}
