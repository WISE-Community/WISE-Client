import { Component, OnInit } from '@angular/core';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

@Component({
  selector: 'node-advanced-general-authoring',
  templateUrl: './node-advanced-general-authoring.component.html'
})
export class NodeAdvancedGeneralAuthoringComponent implements OnInit {
  node: any;

  constructor(
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.node = this.TeacherDataService.getCurrentNode();
  }

  saveProject() {
    return this.ProjectService.saveProject();
  }
}
