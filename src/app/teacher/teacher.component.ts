import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  imports: [CommonModule, RouterModule],
  styles: [
    `
      .teacher {
        height: 100%;
      }
    `
  ],
  template: `
    <div [ngClass]="{ 'main app-background content': !isTeacherApp(), teacher: isTeacherApp() }">
      <router-outlet></router-outlet>
    </div>
  `
})
export class TeacherComponent {
  constructor(private router: Router) {}

  protected isTeacherApp(): boolean {
    return this.router.url.includes('/teacher/edit') || this.router.url.includes('/teacher/manage');
  }
}
