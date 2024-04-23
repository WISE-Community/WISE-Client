import { Component } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ConfigService } from '../../../services/configService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  templateUrl: './ai-chat-authoring.component.html',
  styleUrls: ['./ai-chat-authoring.component.scss']
})
export class AiChatAuthoringComponent extends AbstractComponentAuthoring {
  protected showSystemPromptHelp = false;

  constructor(
    protected configService: ConfigService,
    protected nodeService: TeacherNodeService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, nodeService, projectAssetService, projectService);
  }
}
