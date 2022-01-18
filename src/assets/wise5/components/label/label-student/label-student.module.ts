import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { LabelStudent } from './label-student.component';

@NgModule({
  declarations: [LabelStudent],
  imports: [AngularJSModule, StudentComponentModule],
  exports: [LabelStudent]
})
export class LabelStudentModule {}
