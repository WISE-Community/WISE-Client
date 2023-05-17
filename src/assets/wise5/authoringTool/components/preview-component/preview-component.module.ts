import { NgModule } from '@angular/core';
import { PreviewComponentButtonComponent } from '../preview-component-button/preview-component-button.component';
import { PreviewComponentDialogComponent } from '../preview-component-dialog/preview-component-dialog.component';
import { SaveStarterStateComponent } from '../save-starter-state/save-starter-state.component';
import { ComponentStudentModule } from '../../../../../assets/wise5/components/component/component-student.module';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';

@NgModule({
  declarations: [
    PreviewComponentButtonComponent,
    PreviewComponentDialogComponent,
    SaveStarterStateComponent
  ],
  exports: [PreviewComponentButtonComponent],
  imports: [StudentTeacherCommonModule, ComponentStudentModule]
})
export class PreviewComponentModule {}
