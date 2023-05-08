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

@NgModule({
  declarations: [
    NodeAdvancedAuthoringComponent,
    NodeAdvancedBranchAuthoringComponent,
    NodeAdvancedConstraintAuthoringComponent,
    NodeAdvancedGeneralAuthoringComponent,
    NodeAdvancedJsonAuthoringComponent,
    NodeAdvancedPathAuthoringComponent,
    NodeConstraintAuthoringComponent
  ],
  imports: [ConstraintAuthoringModule, StudentTeacherCommonModule]
})
export class NodeAdvancedAuthoringModule {}
