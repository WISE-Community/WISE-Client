import { Component, Input, ViewChild } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { temporarilyHighlightElement } from '../../common/dom/dom';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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

  constructor(private projectService: TeacherProjectService) {}

  protected addFirstLesson(): void {
    const newLesson = this.createNewLesson();
    const insertLocation = this.active ? 'group0' : 'inactiveGroups';
    this.projectService.createNodeInside(newLesson, insertLocation);
    this.updateProject(newLesson.id);
  }

  protected addLessonBefore(): void {
    const previousLessonId = this.projectService.getPreviousNodeId(this.lessonId);
    if (previousLessonId == null) {
      this.addFirstLesson();
    } else {
      const newLesson = this.createNewLesson();
      this.projectService.createNodeAfter(newLesson, previousLessonId);
      this.updateProject(newLesson.id);
    }
  }

  protected addLessonAfter(): void {
    const newLesson = this.createNewLesson();
    this.projectService.createNodeAfter(newLesson, this.lessonId);
    this.updateProject(newLesson.id);
  }

  private createNewLesson(): any {
    return this.projectService.createGroup($localize`New Lesson`);
  }

  private updateProject(newNodeId: string): void {
    this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      this.projectService.refreshProject();
      // This timeout is used to allow the lesson to be added to the DOM before we highlight it
      setTimeout(() => {
        temporarilyHighlightElement(newNodeId);
      });
    });
  }
}
