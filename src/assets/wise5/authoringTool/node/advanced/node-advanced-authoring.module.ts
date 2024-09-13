import { NgModule } from '@angular/core';
import { NodeAdvancedConstraintAuthoringComponent } from './constraint/node-advanced-constraint-authoring.component';
import { NodeAdvancedGeneralAuthoringComponent } from './general/node-advanced-general-authoring.component';
import { NodeAdvancedJsonAuthoringComponent } from './json/node-advanced-json-authoring.component';
import { NodeAdvancedAuthoringComponent } from './node-advanced-authoring/node-advanced-authoring.component';
import { NodeAdvancedPathAuthoringComponent } from './path/node-advanced-path-authoring.component';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { NodeConstraintAuthoringComponent } from '../../constraint/node-constraint-authoring/node-constraint-authoring.component';
import { EditNodeRubricComponent } from '../editRubric/edit-node-rubric.component';
import { WiseTinymceEditorModule } from '../../../directives/wise-tinymce-editor/wise-tinymce-editor.module';
import { RouterModule } from '@angular/router';
import { TranslatableRichTextEditorComponent } from '../../components/translatable-rich-text-editor/translatable-rich-text-editor.component';
import { RequiredErrorLabelComponent } from './required-error-label/required-error-label.component';

@NgModule({
  declarations: [
    EditNodeRubricComponent,
    NodeAdvancedAuthoringComponent,
    NodeAdvancedConstraintAuthoringComponent,
    NodeAdvancedGeneralAuthoringComponent,
    NodeAdvancedJsonAuthoringComponent,
    NodeAdvancedPathAuthoringComponent
  ],
  exports: [
    EditNodeRubricComponent,
    NodeAdvancedAuthoringComponent,
    NodeAdvancedConstraintAuthoringComponent,
    NodeAdvancedGeneralAuthoringComponent,
    NodeAdvancedJsonAuthoringComponent,
    NodeAdvancedPathAuthoringComponent
  ],
  imports: [
    NodeConstraintAuthoringComponent,
    RequiredErrorLabelComponent,
    RouterModule,
    StudentTeacherCommonModule,
    TranslatableRichTextEditorComponent,
    WiseTinymceEditorModule
  ]
})
export class NodeAdvancedAuthoringModule {}
