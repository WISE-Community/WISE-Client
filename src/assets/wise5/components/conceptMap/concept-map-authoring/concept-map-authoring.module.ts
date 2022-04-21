import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UpgradeModule } from '@angular/upgrade/static';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ConceptMapAuthoring } from './concept-map-authoring.component';

@NgModule({
  declarations: [ConceptMapAuthoring, EditComponentPrompt],
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    UpgradeModule
  ],
  providers: [],
  exports: [ConceptMapAuthoring, EditComponentPrompt]
})
export class ConceptMapAuthoringModule {}
