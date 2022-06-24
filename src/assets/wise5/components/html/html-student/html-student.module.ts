import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { HtmlStudent } from './html-student.component';

@NgModule({
  declarations: [HtmlStudent],
  imports: [StudentTeacherCommonModule, StudentComponentModule],
  exports: [HtmlStudent]
})
export class HtmlStudentModule {}
