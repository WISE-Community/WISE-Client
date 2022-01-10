import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { AnimationStudent } from './animation-student.component';

@NgModule({
  declarations: [AnimationStudent],
  imports: [AngularJSModule, StudentComponentModule],
  exports: [AnimationStudent]
})
export class AnimationStudentModule {}
