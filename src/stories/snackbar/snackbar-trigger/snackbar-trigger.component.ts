import { Component, inject, model } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarHorizontalPosition,
  MatSnackBarLabel,
  MatSnackBarRef,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

export interface SnackbarData {
  message: string;
  action: string;
}

@Component({
  selector: 'snackbar-trigger',
  templateUrl: './snackbar-trigger.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class SnackbarTriggerComponent {
  protected message: string = 'Hello world!';
  protected action: string = 'Close';
  protected duration: number = 10;
  protected horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  protected verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  protected useCustomComponent: boolean = false;

  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar() {
    if (this.useCustomComponent) {
      this._snackBar.openFromComponent(CustomSnackbarComponent, {
        duration: this.duration * 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        data: { message: this.message, action: this.action }
      });
    } else {
      this._snackBar.open(this.message, this.action, {
        duration: this.duration * 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      });
    }
  }
}

@Component({
  selector: 'custom-snackbar',
  templateUrl: './custom-snackbar.html',
  styles: `
    :host {
      display: flex;

      .mat-icon {
        color: var(--mat-sys-error-container);
      }
    }
  `,
  imports: [MatButtonModule, MatIconModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction]
})
export class CustomSnackbarComponent {
  readonly snackBarRef = inject(MatSnackBarRef);
  readonly data = inject<SnackbarData>(MAT_SNACK_BAR_DATA);
  readonly message = model(this.data.message);
  readonly action = model(this.data.action);
}
