import { NgModule } from '@angular/core';
import { ShowMyWorkStudentComponent } from './show-my-work-student.component';
import { ShowWorkStudentComponent } from '../../showWork/show-work-student/show-work-student.component';

@NgModule({
  imports: [ShowMyWorkStudentComponent, ShowWorkStudentComponent],
  exports: [ShowMyWorkStudentComponent]
})
export class ShowMyWorkStudentModule {}
