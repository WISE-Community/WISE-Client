import { Component, OnInit } from '@angular/core';
import { insertWiseLinks, replaceWiseLinks } from '../../../common/wise-link/wise-link';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'edit-node-rubric',
  templateUrl: 'edit-node-rubric.component.html'
})
export class EditNodeRubricComponent implements OnInit {
  node: any;
  rubric: string;

  constructor(
    private configService: ConfigService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe((params) => {
      this.node = this.projectService.getNodeById(params.nodeId);
      this.rubric = this.projectService.replaceAssetPaths(replaceWiseLinks(this.node.rubric));
    });
  }

  rubricChanged(): void {
    this.node.rubric = insertWiseLinks(this.configService.removeAbsoluteAssetPaths(this.rubric));
    this.projectService.saveProject();
  }
}
