import { NgModule } from '@angular/core';
import { NodeAdvancedBranchAuthoringComponent } from './branch/node-advanced-branch-authoring.component';
import { NodeAdvancedConstraintAuthoringComponent } from './constraint/node-advanced-constraint-authoring.component';
import { NodeAdvancedGeneralAuthoringComponent } from './general/node-advanced-general-authoring.component';
import { NodeAdvancedJsonAuthoringComponent } from './json/node-advanced-json-authoring.component';
import { NodeAdvancedAuthoringComponent } from './node-advanced-authoring/node-advanced-authoring.component';
import { NodeAdvancedPathAuthoringComponent } from './path/node-advanced-path-authoring.component';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { NodeConstraintAuthoringComponent } from '../../constraint/node-constraint-authoring/node-constraint-authoring.component';
import { ConstraintAuthoringModule } from '../../constraint/constraint-authoring.module';
import { EditNodeRubricComponent } from '../editRubric/edit-node-rubric.component';
import { WiseTinymceEditorModule } from '../../../directives/wise-tinymce-editor/wise-tinymce-editor.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    EditNodeRubricComponent,
    NodeAdvancedAuthoringComponent,
    NodeAdvancedBranchAuthoringComponent,
    NodeAdvancedConstraintAuthoringComponent,
    NodeAdvancedGeneralAuthoringComponent,
    NodeAdvancedJsonAuthoringComponent,
    NodeAdvancedPathAuthoringComponent,
    NodeConstraintAuthoringComponent
  ],
  exports: [
    EditNodeRubricComponent,
    NodeAdvancedAuthoringComponent,
    NodeAdvancedBranchAuthoringComponent,
    NodeAdvancedConstraintAuthoringComponent,
    NodeAdvancedGeneralAuthoringComponent,
    NodeAdvancedJsonAuthoringComponent,
    NodeAdvancedPathAuthoringComponent,
    NodeConstraintAuthoringComponent
  ],
  imports: [
    ConstraintAuthoringModule,
    RouterModule,
    StudentTeacherCommonModule,
    WiseTinymceEditorModule
  ]
})
export class NodeAdvancedAuthoringModule {}
