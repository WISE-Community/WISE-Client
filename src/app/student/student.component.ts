import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  imports: [NgClass, RouterOutlet],
  styles: ['.full-height { height: 100%; }'],
  templateUrl: './student.component.html'
})
export class StudentComponent {
  constructor(private router: Router) {}

  protected isShowingAngularJSApp(): boolean {
    return (
      this.router.url.includes('/student/unit') ||
      this.router.url.includes('/preview/unit') ||
      this.router.url.includes('/survey')
    );
  }
}
