import { NgModule } from '@angular/core';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { ClassResponse } from './class-response/class-response.component';
import { SaveTimeMessageComponent } from '../../common/save-time-message/save-time-message.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ClassResponse],
  imports: [
    CdkTextareaAutosize,
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    SaveTimeMessageComponent,
    StudentComponentModule,
    TextFieldModule
  ],
  exports: [ClassResponse]
})
export class DiscussionCommonModule {}
