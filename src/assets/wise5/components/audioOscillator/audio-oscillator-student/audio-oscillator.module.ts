import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { AudioOscillatorStudent } from './audio-oscillator-student.component';

@NgModule({
  declarations: [AudioOscillatorStudent],
  imports: [AngularJSModule, StudentComponentModule],
  exports: [AudioOscillatorStudent]
})
export class AudioOscillatorStudentModule {}
