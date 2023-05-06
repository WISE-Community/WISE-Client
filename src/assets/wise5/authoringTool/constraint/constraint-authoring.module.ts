import { NgModule } from '@angular/core';
import { EditConstraintRemovalCriteriaComponent } from './edit-constraint-removal-criteria/edit-constraint-removal-criteria.component';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';

@NgModule({
  declarations: [EditConstraintRemovalCriteriaComponent],
  exports: [EditConstraintRemovalCriteriaComponent],
  imports: [StudentTeacherCommonModule]
})
export class ConstraintAuthoringModule {}
