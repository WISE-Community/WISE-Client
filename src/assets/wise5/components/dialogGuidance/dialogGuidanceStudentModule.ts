import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { DialogGuidanceStudentComponent } from './dialog-guidance-student/dialog-guidance-student.component';
import { DialogResponseComponent } from './dialog-response/dialog-response.component';

@NgModule({
  declarations: [DialogGuidanceStudentComponent, DialogResponseComponent],
  imports: [AngularJSModule, StudentComponentModule]
})
export class DialogGuidanceStudentModule {}
