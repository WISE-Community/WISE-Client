import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { DrawStudent } from './draw-student.component';

@NgModule({
  declarations: [DrawStudent],
  imports: [AngularJSModule, StudentComponentModule],
  exports: [DrawStudent]
})
export class DrawStudentModule {}
