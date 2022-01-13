import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShowWorkStudentModule } from '../../showWork/show-work-student/show-work-student.module';
import { ShowGroupWorkStudentComponent } from './show-group-work-student.component';

@NgModule({
  declarations: [ShowGroupWorkStudentComponent],
  imports: [CommonModule, ShowWorkStudentModule],
  exports: [ShowGroupWorkStudentComponent]
})
export class ShowGroupWorkStudentModule {}
