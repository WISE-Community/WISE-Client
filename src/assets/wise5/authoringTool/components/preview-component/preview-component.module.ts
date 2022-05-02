import { NgModule } from '@angular/core';
import { PreviewComponentButtonComponent } from '../preview-component-button/preview-component-button.component';
import { PreviewComponentDialogComponent } from '../preview-component-dialog/preview-component-dialog.component';
import { SaveStarterStateComponent } from '../save-starter-state/save-starter-state.component';
import { ComponentStudentModule } from '../../../../../assets/wise5/components/component/component-student.module';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';

@NgModule({
  declarations: [
    PreviewComponentButtonComponent,
    PreviewComponentDialogComponent,
    SaveStarterStateComponent
  ],
  imports: [AngularJSModule, ComponentStudentModule]
})
export class PreviewComponentModule {}
