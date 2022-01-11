import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { HtmlStudent } from './html-student.component';

@NgModule({
  declarations: [HtmlStudent],
  imports: [AngularJSModule, StudentComponentModule],
  exports: [HtmlStudent]
})
export class HtmlStudentModule {}
