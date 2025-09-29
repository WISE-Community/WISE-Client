import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { DiscussionShowWorkComponent } from './discussion-show-work.component';
import { ClassResponse } from '../class-response/class-response.component';

@NgModule({
  declarations: [DiscussionShowWorkComponent],
  imports: [CommonModule, ClassResponse, StudentComponentModule],
  exports: [DiscussionShowWorkComponent]
})
export class DiscussionShowWorkModule {}
