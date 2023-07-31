import { Component, OnInit } from '@angular/core';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  selector: 'node-advanced-general-authoring',
  templateUrl: './node-advanced-general-authoring.component.html'
})
export class NodeAdvancedGeneralAuthoringComponent implements OnInit {
  node: any;

  constructor(private projectService: TeacherProjectService, private upgrade: UpgradeModule) {}

  ngOnInit() {
    this.node = this.projectService.getNodeById(this.upgrade.$injector.get('$stateParams').nodeId);
  }

  saveProject() {
    return this.projectService.saveProject();
  }
}
