import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FlexModule } from '@angular/flex-layout/flex';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ConfigService } from '../../../services/configService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EditDialogGuidanceComputerAvatarComponent } from '../../dialogGuidance/edit-dialog-guidance-computer-avatar/edit-dialog-guidance-computer-avatar.component';

@Component({
  templateUrl: './ai-chat-authoring.component.html',
  styleUrl: './ai-chat-authoring.component.scss',
  imports: [
    FlexModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    NgIf,
    MatFormFieldModule,
    MatInput,
    CdkTextareaAutosize,
    FormsModule,
    EditComponentPrompt,
    MatCheckbox,
    EditDialogGuidanceComputerAvatarComponent
  ]
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
