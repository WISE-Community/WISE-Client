import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { AudioRecorderComponent } from '../audio-recorder/audio-recorder.component';
import { OpenResponseStudent } from './open-response-student.component';
import { SpeechToTextComponent } from '../speech-to-text/speech-to-text.component';
import { TranscribeService } from '../../../../wise5/services/transcribeService';
import { PingEndpointService } from '../../../services/pingEndpointService';

@NgModule({
  declarations: [AudioRecorderComponent, OpenResponseStudent],
  imports: [StudentTeacherCommonModule, StudentComponentModule, SpeechToTextComponent],
  providers: [PingEndpointService, TranscribeService],
  exports: [OpenResponseStudent]
})
export class OpenResponseStudentModule {}
