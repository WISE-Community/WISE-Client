import { Component } from '@angular/core';
import { RegisterUserCompleteComponent } from '../register-user-complete.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [MatCard, MatCardContent, MatButton],
  templateUrl: './register-student-complete.component.html',
  selector: 'app-register-student-complete',
  styleUrl: './register-student-complete.component.scss'
})
export class RegisterStudentCompleteComponent extends RegisterUserCompleteComponent {}
