import { Component, OnInit } from '@angular/core';
import { insertWiseLinks, replaceWiseLinks } from '../../../common/wise-link/wise-link';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  selector: 'edit-node-rubric',
  templateUrl: 'edit-node-rubric.component.html'
})
export class EditNodeRubricComponent implements OnInit {
  node: any;
  nodeId: string;
  rubric: string;

  constructor(
    private configService: ConfigService,
    private projectService: TeacherProjectService,
    private dataService: TeacherDataService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit(): void {
    this.node = this.projectService.getNodeById(this.dataService.getCurrentNodeId());
    this.rubric = this.projectService.replaceAssetPaths(replaceWiseLinks(this.node.rubric));
  }

  rubricChanged(): void {
    this.node.rubric = insertWiseLinks(this.configService.removeAbsoluteAssetPaths(this.rubric));
    this.projectService.saveProject();
  }

  goBack(): void {
    this.upgrade.$injector.get('$state').go('root.at.project.node', {
      projectId: this.configService.getProjectId(),
      nodeId: this.node.id
    });
  }
}
