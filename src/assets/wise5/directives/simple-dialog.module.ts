import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonModule } from '../../../app/student-teacher-common.module';
import { DialogWithCloseComponent } from './dialog-with-close/dialog-with-close.component';
import { DialogWithConfirmComponent } from './dialog-with-confirm/dialog-with-confirm.component';
import { DialogWithoutCloseComponent } from './dialog-without-close/dialog-without-close.component';

@NgModule({
  declarations: [DialogWithCloseComponent, DialogWithConfirmComponent, DialogWithoutCloseComponent],
  imports: [StudentTeacherCommonModule, MatButtonModule, MatDialogModule],
  exports: [DialogWithCloseComponent, DialogWithConfirmComponent, DialogWithoutCloseComponent]
})
export class SimpleDialogModule {}
