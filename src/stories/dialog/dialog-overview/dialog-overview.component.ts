import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  selector: 'dialog-overview',
  styleUrls: ['./dialog-overview.component.scss'],
  templateUrl: './dialog-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogOverviewComponent {
  readonly animal = signal('');
  readonly dialog = inject(MatDialog);
  protected dialogWidth: string = 'default';
  readonly name = model('');
  protected widths = [
    { value: 'default', label: 'Default' },
    { value: 'dialog-sm', label: 'Small' },
    { value: 'dialog-md', label: 'Medium' },
    { value: 'dialog-lg', label: 'Large' }
  ];

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewDialog, {
      data: { name: this.name(), animal: this.animal() },
      panelClass: this.dialogWidth === 'default' ? '' : this.dialogWidth
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.animal.set(result);
      }
    });
  }
}

@Component({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
  selector: 'dialog-overview-dialog',
  templateUrl: './dialog-overview-dialog.html'
})
export class DialogOverviewDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly animal = model(this.data.animal);

  cancel(): void {
    this.dialogRef.close();
  }
}
