import { NgModule } from '@angular/core';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { ShowGroupWorkDisplayModule } from '../show-group-work-display/show-group-work-display.module';
import { ShowGroupWorkStudentComponent } from './show-group-work-student.component';

@NgModule({
  declarations: [ShowGroupWorkStudentComponent],
  imports: [ShowGroupWorkDisplayModule, StudentComponentModule],
  exports: [ShowGroupWorkStudentComponent]
})
export class ShowGroupWorkStudentModule {}
