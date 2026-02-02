import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { EditComponentPeerGroupingTagComponent } from '../../../../../app/authoring-tool/edit-component-peer-grouping-tag/edit-component-peer-grouping-tag.component';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ShowMyWorkAuthoringComponent } from '../../showMyWork/show-my-work-authoring/show-my-work-authoring.component';

@Component({
  imports: [
    EditComponentPrompt,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    EditComponentPeerGroupingTagComponent,
    MatCheckbox,
    MatRadioModule,
    MatIcon
  ],
  selector: 'show-group-work-authoring',
  styles: ['.layout-select { margin: 8px 0 16px; } .bottom-spacing { margin-bottom: 10px; }'],
  templateUrl: './show-group-work-authoring.component.html'
})
export class ShowGroupWorkAuthoringComponent extends ShowMyWorkAuthoringComponent {}
