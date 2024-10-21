import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatAnchor } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  templateUrl: './forgot-teacher-username-complete.component.html',
  styleUrl: './forgot-teacher-username-complete.component.scss',
  standalone: true,
  imports: [MatCard, MatCardContent, MatAnchor, RouterLink]
})
export class ForgotTeacherUsernameCompleteComponent {}
