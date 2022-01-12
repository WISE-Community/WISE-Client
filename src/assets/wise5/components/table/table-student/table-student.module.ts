import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { TableStudent } from './table-student.component';

@NgModule({
  declarations: [TableStudent],
  imports: [AngularJSModule, StudentComponentModule],
  exports: [TableStudent]
})
export class TableStudentModule {}
