import { ConfigService } from '../../services/configService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { Component } from '@angular/core';
import { insertWiseLinks } from '../../common/wise-link/wise-link';

@Component({
  selector: 'rubric-authoring',
  templateUrl: 'rubric-authoring.component.html',
  styleUrls: ['./rubric-authoring.component.scss']
})
export class RubricAuthoringComponent {
  rubric: string = '';

  constructor(
    private configService: ConfigService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.rubric = this.projectService.replaceAssetPaths(this.projectService.getProjectRubric());
  }

  protected rubricChanged(): void {
    const html = insertWiseLinks(this.configService.removeAbsoluteAssetPaths(this.rubric));
    this.projectService.setProjectRubric(html);
    this.projectService.saveProject();
  }
}
