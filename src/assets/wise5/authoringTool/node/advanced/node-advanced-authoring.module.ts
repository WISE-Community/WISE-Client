import { NgModule } from '@angular/core';
import { NodeAdvancedAuthoringComponent } from './node-advanced-authoring/node-advanced-authoring.component';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { RouterModule } from '@angular/router';
import { TranslatableRichTextEditorComponent } from '../../components/translatable-rich-text-editor/translatable-rich-text-editor.component';
import { RequiredErrorLabelComponent } from './required-error-label/required-error-label.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NodeAdvancedAuthoringComponent],
  exports: [NodeAdvancedAuthoringComponent],
  imports: [
    CommonModule,
    RequiredErrorLabelComponent,
    RouterModule,
    StudentTeacherCommonModule,
    TranslatableRichTextEditorComponent
  ]
})
export class NodeAdvancedAuthoringModule {}
