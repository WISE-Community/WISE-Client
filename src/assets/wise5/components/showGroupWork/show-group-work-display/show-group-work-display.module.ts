import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ShowGroupWorkDisplayComponent } from './show-group-work-display.component';
import { ShowWorkStudentComponent } from '../../showWork/show-work-student/show-work-student.component';

@NgModule({
  declarations: [ShowGroupWorkDisplayComponent],
  imports: [CommonModule, MatCardModule, MatIconModule, ShowWorkStudentComponent],
  exports: [ShowGroupWorkDisplayComponent]
})
export class ShowGroupWorkDisplayModule {}
