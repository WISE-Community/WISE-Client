import { Component, OnInit } from '@angular/core';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'node-advanced-general-authoring',
  templateUrl: './node-advanced-general-authoring.component.html'
})
export class NodeAdvancedGeneralAuthoringComponent implements OnInit {
  protected node: any;

  constructor(private projectService: TeacherProjectService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.parent.parent.params.subscribe((params) => {
      this.node = this.projectService.getNodeById(params.nodeId);
    });
  }

  protected saveProject(): void {
    this.projectService.saveProject();
  }
}
