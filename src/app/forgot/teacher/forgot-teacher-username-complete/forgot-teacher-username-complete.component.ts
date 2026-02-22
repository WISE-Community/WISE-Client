import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatAnchor } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  imports: [MatCard, MatCardContent, MatAnchor, RouterLink],
  templateUrl: './forgot-teacher-username-complete.component.html'
})
export class ForgotTeacherUsernameCompleteComponent {}
