import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { EmbeddedStudent } from './embedded-student.component';

@NgModule({
  declarations: [EmbeddedStudent],
  imports: [AngularJSModule, StudentComponentModule],
  exports: [EmbeddedStudent]
})
export class EmbeddedStudentModule {}
