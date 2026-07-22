import { Component } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { WiseAuthoringTinymceEditorComponent } from '../../../directives/wise-tinymce-editor/wise-authoring-tinymce-editor.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatInputModule, WiseAuthoringTinymceEditorComponent],
  templateUrl: 'open-response-authoring.component.html'
})
export class OpenResponseAuthoringComponent extends AbstractComponentAuthoring {
  componentChanged(): void {
    this.projectService.nodeChanged();
    this.projectService.saveProject();
  }
}
