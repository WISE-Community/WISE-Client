import { NgModule } from '@angular/core';
import { ComputerAvatarSelectorComponent } from './computer-avatar-selector.component';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';

@NgModule({
  declarations: [ComputerAvatarSelectorComponent],
  exports: [ComputerAvatarSelectorComponent],
  imports: [StudentTeacherCommonModule]
})
export class ComputerAvatarSelectorModule {}
