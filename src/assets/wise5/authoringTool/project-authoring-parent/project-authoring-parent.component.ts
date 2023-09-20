import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeacherProjectService } from '../../services/teacherProjectService';

@Component({
  templateUrl: './project-authoring-parent.component.html',
  styleUrls: ['./project-authoring-parent.component.scss']
})
export class ProjectAuthoringParentComponent {
  protected projectId: number;

  constructor(private projectService: TeacherProjectService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('unitId'));
    this.projectService.notifyAuthorProjectBegin(this.projectId);
    window.onbeforeunload = (event) => {
      this.projectService.notifyAuthorProjectEnd(this.projectId);
    };
  }

  ngOnDestroy(): void {
    this.projectService.notifyAuthorProjectEnd(this.projectId);
  }
}
