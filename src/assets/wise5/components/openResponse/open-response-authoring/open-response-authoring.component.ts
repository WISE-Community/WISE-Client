import { Component } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  imports: [CommonModule, EditComponentPrompt, FlexLayoutModule, MatIconModule, MatTooltipModule],
  standalone: true,
  templateUrl: 'open-response-authoring.component.html'
})
export class OpenResponseAuthoringComponent extends AbstractComponentAuthoring {}
