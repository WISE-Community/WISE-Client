'use strict';

import { Component } from '@angular/core';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'discussion-authoring',
  templateUrl: 'discussion-authoring.component.html',
  styleUrls: ['discussion-authoring.component.scss']
})
export class DiscussionAuthoring extends AbstractComponentAuthoring {
  constructor(
    protected ConfigService: ConfigService,
    protected NodeService: TeacherNodeService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService
  ) {
    super(ConfigService, NodeService, ProjectAssetService, ProjectService);
  }
}
