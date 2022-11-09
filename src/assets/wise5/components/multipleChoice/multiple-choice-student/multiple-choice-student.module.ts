import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { MultipleChoiceStudent } from './multiple-choice-student.component';

@NgModule({
  declarations: [MultipleChoiceStudent],
  imports: [StudentTeacherCommonModule, StudentComponentModule],
  exports: [MultipleChoiceStudent]
})
export class MultipleChoiceStudentModule {}
