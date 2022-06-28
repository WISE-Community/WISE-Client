import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { EmbeddedStudent } from './embedded-student.component';

@NgModule({
  declarations: [EmbeddedStudent],
  imports: [StudentTeacherCommonModule, StudentComponentModule],
  exports: [EmbeddedStudent]
})
export class EmbeddedStudentModule {}
