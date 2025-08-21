import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { EditDialogGuidanceComputerAvatarComponent } from '../../dialogGuidance/edit-dialog-guidance-computer-avatar/edit-dialog-guidance-computer-avatar.component';

@Component({
  templateUrl: './ai-chat-authoring.component.html',
  styleUrl: './ai-chat-authoring.component.scss',
  imports: [
    MatButtonModule,
    MatTooltip,
    MatIcon,
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
}
