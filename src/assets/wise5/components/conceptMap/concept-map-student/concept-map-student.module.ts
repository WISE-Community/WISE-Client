import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { ConceptMapStudent } from './concept-map-student.component';

@NgModule({
  declarations: [ConceptMapStudent],
  imports: [StudentTeacherCommonModule, StudentComponentModule],
  exports: [ConceptMapStudent]
})
export class ConceptMapStudentModule {}
