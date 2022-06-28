import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { OutsideUrlStudent } from './outside-url-student.component';

@NgModule({
  declarations: [OutsideUrlStudent],
  imports: [StudentTeacherCommonModule, StudentComponentModule],
  exports: [OutsideUrlStudent]
})
export class OutsideUrlStudentModule {}
