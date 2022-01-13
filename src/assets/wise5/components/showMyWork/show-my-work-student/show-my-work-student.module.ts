import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ShowWorkStudentModule } from '../../showWork/show-work-student/show-work-student.module';
import { ShowMyWorkStudentComponent } from './show-my-work-student.component';

@NgModule({
  declarations: [ShowMyWorkStudentComponent],
  imports: [CommonModule, MatCardModule, ShowWorkStudentModule],
  exports: [ShowMyWorkStudentComponent]
})
export class ShowMyWorkStudentModule {}
