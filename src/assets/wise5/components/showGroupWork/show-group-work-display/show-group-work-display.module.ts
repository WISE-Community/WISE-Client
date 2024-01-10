import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ShowWorkStudentModule } from '../../showWork/show-work-student/show-work-student.module';
import { ShowGroupWorkDisplayComponent } from './show-group-work-display.component';

@NgModule({
  declarations: [ShowGroupWorkDisplayComponent],
  imports: [CommonModule, FlexLayoutModule, MatCardModule, MatIconModule, ShowWorkStudentModule],
  exports: [ShowGroupWorkDisplayComponent]
})
export class ShowGroupWorkDisplayModule {}
