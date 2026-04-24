import { Component } from '@angular/core';
import { GoogleUser } from '../../modules/google-sign-in/GoogleUser';
import { AbstractRegisterUserComponent } from '../abstract-register-user.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { GoogleSignInButtonComponent } from '../../modules/google-sign-in/google-sign-in-button/google-sign-in-button.component';

@Component({
  imports: [
    MatCard,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatButton,
    GoogleSignInButtonComponent
  ],
  selector: 'app-register-student',
  styleUrl: './register-student.component.scss',
  templateUrl: './register-student.component.html'
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
