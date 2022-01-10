import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { OpenResponseStudent } from './open-response-student.component';

@NgModule({
  declarations: [OpenResponseStudent],
  imports: [AngularJSModule, StudentComponentModule],
  exports: [OpenResponseStudent]
})
export class OpenResponseStudentModule {}
