import { Component } from '@angular/core';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { insertWiseLinks, replaceWiseLinks } from '../../../common/wise-link/wise-link';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'html-authoring',
  templateUrl: 'html-authoring.component.html'
})
export class HtmlAuthoring extends AbstractComponentAuthoring {
  html: string = '';

  constructor(
    protected configService: ConfigService,
    protected nodeService: TeacherNodeService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, nodeService, projectAssetService, projectService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.html = this.projectService.replaceAssetPaths(replaceWiseLinks(this.componentContent.html));
  }

  htmlChanged(): void {
    this.componentContent.html = insertWiseLinks(
      this.configService.removeAbsoluteAssetPaths(this.html)
    );
    this.componentChanged();
  }
}
