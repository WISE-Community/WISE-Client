import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { PeerChatModule } from '../peer-chat.module';
import { PeerChatStudentComponent } from './peer-chat-student.component';

@NgModule({
  imports: [CommonModule, PeerChatModule, StudentComponentModule, PeerChatStudentComponent],
  exports: [PeerChatStudentComponent]
})
export class PeerChatStudentModule {}
