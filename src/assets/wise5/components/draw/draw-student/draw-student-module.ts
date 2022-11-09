import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { DrawStudent } from './draw-student.component';

@NgModule({
  declarations: [DrawStudent],
  imports: [StudentTeacherCommonModule, StudentComponentModule],
  exports: [DrawStudent]
})
export class DrawStudentModule {}
