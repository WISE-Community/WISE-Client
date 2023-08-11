import { NgModule } from '@angular/core';
import { WiseAuthoringTinymceEditorComponent } from './wise-authoring-tinymce-editor.component';
import { WiseTinymceEditorComponent } from './wise-tinymce-editor.component';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [WiseAuthoringTinymceEditorComponent, WiseTinymceEditorComponent],
  exports: [WiseAuthoringTinymceEditorComponent, WiseTinymceEditorComponent],
  imports: [EditorModule]
})
export class WiseTinymceEditorModule {}
