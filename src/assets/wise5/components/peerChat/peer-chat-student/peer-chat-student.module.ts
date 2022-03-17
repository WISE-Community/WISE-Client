import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { PeerChatModule } from '../peer-chat.module';
import { PeerChatStudentComponent } from './peer-chat-student.component';

@NgModule({
  declarations: [PeerChatStudentComponent],
  imports: [CommonModule, FlexLayoutModule, PeerChatModule, StudentComponentModule],
  exports: [PeerChatStudentComponent]
})
export class PeerChatStudentModule {}
