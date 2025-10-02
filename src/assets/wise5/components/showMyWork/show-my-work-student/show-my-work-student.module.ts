import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { ShowMyWorkStudentComponent } from './show-my-work-student.component';
import { ShowWorkStudentComponent } from '../../showWork/show-work-student/show-work-student.component';

@NgModule({
  declarations: [ShowMyWorkStudentComponent],
  imports: [CommonModule, MatCardModule, ShowWorkStudentComponent, StudentComponentModule],
  exports: [ShowMyWorkStudentComponent]
})
export class ShowMyWorkStudentModule {}
