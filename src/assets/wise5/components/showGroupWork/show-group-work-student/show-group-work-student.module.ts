import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { ShowWorkStudentModule } from '../../showWork/show-work-student/show-work-student.module';
import { ShowGroupWorkStudentComponent } from './show-group-work-student.component';

@NgModule({
  declarations: [ShowGroupWorkStudentComponent],
  imports: [CommonModule, ShowWorkStudentModule, StudentComponentModule],
  exports: [ShowGroupWorkStudentComponent]
})
export class ShowGroupWorkStudentModule {}
