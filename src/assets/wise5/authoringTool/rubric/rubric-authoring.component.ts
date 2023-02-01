import { ConfigService } from '../../services/configService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { UpgradeModule } from '@angular/upgrade/static';
import { Component } from '@angular/core';
import { insertWiseLinks } from '../../common/wise-link/wise-link';

@Component({
  templateUrl: 'rubric-authoring.component.html'
})
export class RubricAuthoringComponent {
  rubric: string = '';

  constructor(
    private upgrade: UpgradeModule,
    private ConfigService: ConfigService,
    private ProjectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.rubric = this.ProjectService.replaceAssetPaths(this.ProjectService.getProjectRubric());
  }

  rubricChanged(): void {
    const html = insertWiseLinks(this.ConfigService.removeAbsoluteAssetPaths(this.rubric));
    this.ProjectService.setProjectRubric(html);
    this.ProjectService.saveProject();
  }

  goBack(): void {
    this.upgrade.$injector.get('$state').go('root.at.project');
  }
}
