import { NgModule } from '@angular/core';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { DiscussionStudent } from './discussion-student.component';
import { CommonModule } from '@angular/common';
import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';
import { MatCardModule } from '@angular/material/card';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClassResponse } from '../class-response/class-response.component';

@NgModule({
  declarations: [DiscussionStudent],
  imports: [
    ClassResponse,
    CommonModule,
    ComponentHeaderComponent,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    StudentComponentModule,
    TextFieldModule
  ],
  exports: [DiscussionStudent]
})
export class DiscussionStudentModule {}
