import { Component } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
    selector: 'dialog-without-close',
    templateUrl: './dialog-without-close.component.html',
    standalone: false
})
export class DialogWithoutCloseComponent extends DialogComponent {}
