import { Component } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ConfigService } from '../../../services/configService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormsModule } from '@angular/forms';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { MatCheckbox } from '@angular/material/checkbox';
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
    MatFormField,
    MatLabel,
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
