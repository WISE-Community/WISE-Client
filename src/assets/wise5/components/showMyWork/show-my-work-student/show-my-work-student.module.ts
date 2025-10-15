import { NgModule } from '@angular/core';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { ShowMyWorkStudentComponent } from './show-my-work-student.component';
import { ShowWorkStudentComponent } from '../../showWork/show-work-student/show-work-student.component';

@NgModule({
  imports: [ShowMyWorkStudentComponent, ShowWorkStudentComponent, StudentComponentModule],
  exports: [ShowMyWorkStudentComponent]
})
export class ShowMyWorkStudentModule {}
