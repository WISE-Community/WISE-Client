import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { OutsideUrlStudent } from './outside-url-student.component';

@NgModule({
  declarations: [OutsideUrlStudent],
  imports: [AngularJSModule, StudentComponentModule],
  exports: [OutsideUrlStudent]
})
export class OutsideUrlStudentModule {}
