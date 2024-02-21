import { Component } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';

@Component({
  selector: 'ai-chat-authoring',
  templateUrl: './ai-chat-authoring.component.html',
  styleUrls: ['./ai-chat-authoring.component.scss']
})
export class AiChatAuthoringComponent extends AbstractComponentAuthoring {}
