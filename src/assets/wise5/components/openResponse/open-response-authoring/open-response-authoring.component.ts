import { Component } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';

@Component({
  imports: [EditComponentPrompt, MatIconModule, MatTooltipModule],
  templateUrl: 'open-response-authoring.component.html'
})
export class OpenResponseAuthoringComponent extends AbstractComponentAuthoring {}
