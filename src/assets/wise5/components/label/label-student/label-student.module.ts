import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { LabelStudent } from './label-student.component';

@NgModule({
  imports: [LabelStudent, StudentTeacherCommonModule, StudentComponentModule],
  exports: [LabelStudent]
})
export class LabelStudentModule {}
