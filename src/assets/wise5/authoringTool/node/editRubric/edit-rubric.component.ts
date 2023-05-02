import { Component, OnInit } from '@angular/core';
import { insertWiseLinks, replaceWiseLinks } from '../../../common/wise-link/wise-link';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  selector: 'edit-rubric',
  templateUrl: 'edit-rubric.component.html'
})
export class EditRubricComponent implements OnInit {
  node: any;
  nodeId: string;
  rubric: string;

  constructor(
    private configService: ConfigService,
    private teacherProjectService: TeacherProjectService,
    private teacherDataService: TeacherDataService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit(): void {
    this.nodeId = this.teacherDataService.getCurrentNodeId();
    this.node = this.teacherProjectService.getNodeById(this.nodeId);
    this.rubric = this.teacherProjectService.replaceAssetPaths(replaceWiseLinks(this.node.rubric));
  }

  rubricChanged(): void {
    const html = insertWiseLinks(this.configService.removeAbsoluteAssetPaths(this.rubric));
    this.node.rubric = html;
    this.teacherProjectService.saveProject();
  }

  goBack(): void {
    this.upgrade.$injector.get('$state').go('root.at.project.node', {
      projectId: this.configService.getProjectId(),
      nodeId: this.nodeId
    });
  }
}
