import { Component } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
    selector: 'app-dialog-with-spinner',
    templateUrl: './dialog-with-spinner.component.html',
    styleUrls: ['./dialog-with-spinner.component.scss'],
    standalone: false
})
export class DialogWithSpinnerComponent extends DialogComponent {}
