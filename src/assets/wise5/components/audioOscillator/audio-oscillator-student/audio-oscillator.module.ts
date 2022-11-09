import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { AudioOscillatorStudent } from './audio-oscillator-student.component';

@NgModule({
  declarations: [AudioOscillatorStudent],
  imports: [StudentTeacherCommonModule, StudentComponentModule],
  exports: [AudioOscillatorStudent]
})
export class AudioOscillatorStudentModule {}
