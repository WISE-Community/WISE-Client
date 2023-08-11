import { NgModule } from '@angular/core';
import { StepToolsComponent } from '../../../../common/stepTools/step-tools.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudentTeacherCommonModule } from '../../../../../../app/student-teacher-common.module';

@NgModule({
  declarations: [StepToolsComponent],
  exports: [StepToolsComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    StudentTeacherCommonModule
  ]
})
export class StepToolsModule {}
