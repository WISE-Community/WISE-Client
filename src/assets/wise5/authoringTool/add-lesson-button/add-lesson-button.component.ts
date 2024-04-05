import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'add-lesson-button',
  templateUrl: './add-lesson-button.component.html',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule]
})
export class AddLessonButtonComponent {
  @Input() active: boolean;
  @Input() first: boolean;
  @Input() lessonId: string;
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;

  constructor(private route: ActivatedRoute, private router: Router) {}

  protected addFirstLesson(): void {
    this.goToAddLessonView(this.active ? 'group0' : 'inactiveGroups');
  }

  protected addLessonAfter(): void {
    this.goToAddLessonView(this.lessonId);
  }

  private goToAddLessonView(nodeId: string): void {
    this.router.navigate(['add-lesson'], {
      relativeTo: this.route,
      state: { target: nodeId }
    });
  }
}
