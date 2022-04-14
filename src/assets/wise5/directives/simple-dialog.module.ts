import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularJSModule } from '../../../app/common-hybrid-angular.module';
import { DialogWithCloseComponent } from './dialog-with-close/dialog-with-close.component';
import { DialogWithConfirmComponent } from './dialog-with-confirm/dialog-with-confirm.component';
import { DialogWithoutCloseComponent } from './dialog-without-close/dialog-without-close.component';
import { TitleAndContentComponent } from './title-and-content/title-and-content.component';

@NgModule({
  declarations: [
    DialogWithCloseComponent,
    DialogWithConfirmComponent,
    DialogWithoutCloseComponent,
    TitleAndContentComponent
  ],
  imports: [AngularJSModule, MatButtonModule, MatDialogModule],
  exports: [DialogWithCloseComponent, DialogWithConfirmComponent, DialogWithoutCloseComponent]
})
export class SimpleDialogModule {}
