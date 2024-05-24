import { Component } from '@angular/core';
import { GoogleUser } from '../../modules/google-sign-in/GoogleUser';
import { AbstractRegisterUserComponent } from '../abstract-register-user.component';

@Component({
  selector: 'app-register-teacher',
  templateUrl: './register-teacher.component.html',
  styleUrls: ['./register-teacher.component.scss']
})
export class RegisterTeacherComponent extends AbstractRegisterUserComponent {
  protected email: string = '';
  protected joinFormPath: string = '/join/teacher/form';

  protected getFormParams(): any {
    return { email: this.email };
  }

  protected getGoogleFormParams(credential: GoogleUser): any {
    return { gID: credential.sub, name: credential.name, email: credential.email };
  }
}
