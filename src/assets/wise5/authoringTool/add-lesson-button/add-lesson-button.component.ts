import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { temporarilyHighlightElement } from '../../common/dom/dom';

@Component({
  selector: 'add-lesson-button',
  templateUrl: './add-lesson-button.component.html',
  styleUrls: ['./add-lesson-button.component.scss']
})
export class AddLessonButtonComponent {
  @Input() lessonId: string;

  constructor(private projectService: TeacherProjectService) {}

  protected addLessonBefore(): void {
    const newLesson = this.projectService.createGroup('New Lesson');
    const previousLessonId = this.projectService.getPreviousNodeId(this.lessonId);
    if (previousLessonId == null) {
      const insertLocation = this.projectService.isActive(this.lessonId)
        ? 'group0'
        : 'inactiveGroups';
      this.projectService.createNodeInside(newLesson, insertLocation);
    } else {
      this.projectService.createNodeAfter(newLesson, previousLessonId);
    }
    this.updateProject(newLesson.id);
  }

  protected addLessonAfter(): void {
    const newLesson = this.projectService.createGroup('New Lesson');
    this.projectService.createNodeAfter(newLesson, this.lessonId);
    this.updateProject(newLesson.id);
  }

  private updateProject(newNodeId: string): void {
    this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      this.projectService.refreshProject();
      temporarilyHighlightElement(newNodeId);
    });
  }
}
