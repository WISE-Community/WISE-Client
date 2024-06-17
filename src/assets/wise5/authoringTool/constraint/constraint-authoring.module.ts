import { NgModule } from '@angular/core';
import { EditConstraintRemovalCriteriaComponent } from './edit-constraint-removal-criteria/edit-constraint-removal-criteria.component';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';
import { RequiredErrorLabelComponent } from '../node/advanced/required-error-label/required-error-label.component';

@NgModule({
  declarations: [EditConstraintRemovalCriteriaComponent],
  exports: [EditConstraintRemovalCriteriaComponent],
  imports: [RequiredErrorLabelComponent, StudentTeacherCommonModule]
})
export class ConstraintAuthoringModule {}
