import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { ShowWorkStudentModule } from '../../showWork/show-work-student/show-work-student.module';
import { ShowMyWorkStudentComponent } from './show-my-work-student.component';

@NgModule({
  declarations: [ShowMyWorkStudentComponent],
  imports: [CommonModule, MatCardModule, ShowWorkStudentModule, StudentComponentModule],
  exports: [ShowMyWorkStudentComponent]
})
export class ShowMyWorkStudentModule {}
