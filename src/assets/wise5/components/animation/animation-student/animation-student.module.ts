import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { AnimationStudent } from './animation-student.component';

@NgModule({
  declarations: [AnimationStudent],
  imports: [StudentTeacherCommonModule, StudentComponentModule],
  exports: [AnimationStudent]
})
export class AnimationStudentModule {}
