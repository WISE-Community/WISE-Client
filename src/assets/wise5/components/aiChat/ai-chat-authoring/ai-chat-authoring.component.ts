import { Component } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { DialogWithCloseComponent } from '../../../directives/dialog-with-close/dialog-with-close.component';
import { MatDialog } from '@angular/material/dialog';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ConfigService } from '../../../services/configService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  templateUrl: './ai-chat-authoring.component.html',
  styleUrls: ['./ai-chat-authoring.component.scss']
})
export class AiChatAuthoringComponent extends AbstractComponentAuthoring {
  constructor(
    protected configService: ConfigService,
    private dialog: MatDialog,
    protected nodeService: TeacherNodeService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, nodeService, projectAssetService, projectService);
  }

  protected openSystemPromptHelpDialog(): void {
    const instructions = $localize`<h4>Instructions</h4>Use the system prompt to instruct the chat bot how to behave. Provide context, instructions, and other relevant information to help the chat bot act the way you want it to. Be as specific as possible. Students will not see the system prompt.`;
    const example = $localize`<h4>Example System Prompt</h4>You are a teacher helping a student understand the greenhouse effect by using the example of the inside of a car heating up from the sun on a cold day. You do not tell them the correct answer but you do guide them to the correct answer. Also make sure they explain their reasoning. Limit your response to 100 words or less.`;
    const content = `${instructions}<br/><br/>${example}`;
    this.dialog.open(DialogWithCloseComponent, {
      data: {
        content: content,
        title: $localize`System Prompt`
      }
    });
  }
}
