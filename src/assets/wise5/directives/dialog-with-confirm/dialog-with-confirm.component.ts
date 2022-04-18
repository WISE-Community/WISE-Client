import { Component } from '@angular/core';
import { DialogWithoutCloseComponent } from '../dialog-without-close/dialog-without-close.component';

@Component({
  selector: 'dialog-with-confirm',
  templateUrl: './dialog-with-confirm.component.html'
})
export class DialogWithConfirmComponent extends DialogWithoutCloseComponent {}
