import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { AudioRecorderComponent } from '../audio-recorder/audio-recorder.component';
import { OpenResponseStudent } from './open-response-student.component';

@NgModule({
  declarations: [AudioRecorderComponent, OpenResponseStudent],
  imports: [StudentTeacherCommonModule, StudentComponentModule],
  exports: [OpenResponseStudent]
})
export class OpenResponseStudentModule {}
