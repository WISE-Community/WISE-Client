import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonModule } from '../../../app/student-teacher-common.module';
import { DialogWithCloseComponent } from './dialog-with-close/dialog-with-close.component';
import { DialogWithConfirmComponent } from './dialog-with-confirm/dialog-with-confirm.component';
import { DialogWithOpenInNewWindowComponent } from './dialog-with-open-in-new-window/dialog-with-open-in-new-window.component';
import { DialogWithSpinnerComponent } from './dialog-with-spinner/dialog-with-spinner.component';
import { DialogWithoutCloseComponent } from './dialog-without-close/dialog-without-close.component';

@NgModule({
  declarations: [
    DialogWithCloseComponent,
    DialogWithConfirmComponent,
    DialogWithOpenInNewWindowComponent,
    DialogWithoutCloseComponent,
    DialogWithSpinnerComponent
  ],
  imports: [StudentTeacherCommonModule, MatButtonModule, MatDialogModule],
  exports: [
    DialogWithCloseComponent,
    DialogWithConfirmComponent,
    DialogWithOpenInNewWindowComponent,
    DialogWithoutCloseComponent,
    DialogWithSpinnerComponent
  ]
})
export class SimpleDialogModule {}
