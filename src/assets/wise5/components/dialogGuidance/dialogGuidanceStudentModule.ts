import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { DialogGuidanceStudentComponent } from './dialog-guidance-student/dialog-guidance-student.component';

@NgModule({
  declarations: [DialogGuidanceStudentComponent],
  imports: [AngularJSModule, StudentComponentModule],
  exports: [DialogGuidanceStudentComponent]
})
export class DialogGuidanceStudentModule {}
