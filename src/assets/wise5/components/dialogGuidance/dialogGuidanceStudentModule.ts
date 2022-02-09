import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { ComputerAvatarSelectorComponent } from '../../vle/computer-avatar-selector/computer-avatar-selector.component';
import { DialogGuidanceStudentComponent } from './dialog-guidance-student/dialog-guidance-student.component';

@NgModule({
  declarations: [ComputerAvatarSelectorComponent, DialogGuidanceStudentComponent],
  imports: [AngularJSModule, StudentComponentModule],
  exports: [DialogGuidanceStudentComponent]
})
export class DialogGuidanceStudentModule {}
