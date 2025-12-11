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
  selector: 'app-register-teacher',
  styleUrl: './register-teacher.component.scss',
  templateUrl: './register-teacher.component.html'
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
