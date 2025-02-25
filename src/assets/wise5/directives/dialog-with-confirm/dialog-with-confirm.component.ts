import { Component } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
    selector: 'dialog-with-confirm',
    templateUrl: './dialog-with-confirm.component.html',
    standalone: false
})
export class DialogWithConfirmComponent extends DialogComponent {}
