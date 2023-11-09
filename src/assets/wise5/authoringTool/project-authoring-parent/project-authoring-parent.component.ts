import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';

@Component({
  templateUrl: './project-authoring-parent.component.html',
  styleUrls: ['./project-authoring-parent.component.scss']
})
export class ProjectAuthoringParentComponent {
  @Input('unitId') protected projectId?: number;

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.projectId = Number(this.projectId);
    this.projectService.notifyAuthorProjectBegin(this.projectId);
    window.onbeforeunload = (event) => {
      this.projectService.notifyAuthorProjectEnd(this.projectId);
    };
  }

  ngOnDestroy(): void {
    this.projectService.notifyAuthorProjectEnd(this.projectId);
  }
}
