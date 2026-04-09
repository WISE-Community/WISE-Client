import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './idea-summary-dialog.component.html'
})
export class IdeaSummaryDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { idea: any; responses: any[] }) {}
}
