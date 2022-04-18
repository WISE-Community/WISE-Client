import { Component } from '@angular/core';
import { DialogWithoutCloseComponent } from '../dialog-without-close/dialog-without-close.component';

@Component({
  selector: 'dialog-with-close',
  templateUrl: './dialog-with-close.component.html'
})
export class DialogWithCloseComponent extends DialogWithoutCloseComponent {}
