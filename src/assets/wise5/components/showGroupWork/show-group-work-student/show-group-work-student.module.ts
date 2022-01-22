import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { ShowWorkStudentModule } from '../../showWork/show-work-student/show-work-student.module';
import { ShowGroupWorkStudentComponent } from './show-group-work-student.component';

@NgModule({
  declarations: [ShowGroupWorkStudentComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    ShowWorkStudentModule,
    StudentComponentModule],
  exports: [ShowGroupWorkStudentComponent]
})
export class ShowGroupWorkStudentModule { }
