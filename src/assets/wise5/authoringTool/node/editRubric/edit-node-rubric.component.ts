import { Component, OnInit } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'edit-node-rubric',
  templateUrl: 'edit-node-rubric.component.html'
})
export class EditNodeRubricComponent implements OnInit {
  protected node: any;

  constructor(private projectService: TeacherProjectService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe((params) => {
      this.node = this.projectService.getNodeById(params.nodeId);
    });
  }

  protected rubricChanged(): void {
    this.projectService.saveProject();
  }
}
