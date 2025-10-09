import { NgModule } from '@angular/core';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { ShowGroupWorkStudentComponent } from './show-group-work-student.component';

@NgModule({
  imports: [ShowGroupWorkStudentComponent, StudentComponentModule],
  exports: [ShowGroupWorkStudentComponent]
})
export class ShowGroupWorkStudentModule {}
