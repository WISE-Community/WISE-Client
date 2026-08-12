import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component } from '@angular/core';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { EditDialogGuidanceComputerAvatarComponent } from '../../dialogGuidance/edit-dialog-guidance-computer-avatar/edit-dialog-guidance-computer-avatar.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  templateUrl: './ai-chat-authoring.component.html',
  styleUrl: './ai-chat-authoring.component.scss',
  imports: [
    CdkTextareaAutosize,
    EditComponentPrompt,
    EditDialogGuidanceComputerAvatarComponent,
    FormsModule,
    MatButtonModule,
    MatCheckbox,
    MatFormFieldModule,
    MatIcon,
    MatInput,
    MatOption,
    MatSelect,
    MatTooltip
  ]
})
export class AiChatAuthoringComponent extends AbstractComponentAuthoring {
  protected models: string[] = ['gpt-4o', 'gpt-4o-mini', 'gpt-5.4', 'gpt-5.4-mini', 'gpt-5.4-nano'];
  protected showSystemPromptHelp = false;
}
