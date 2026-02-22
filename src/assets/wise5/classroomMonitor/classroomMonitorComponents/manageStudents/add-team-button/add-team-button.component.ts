import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTeamDialogComponent } from '../add-team-dialog/add-team-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [MatButton, MatIcon],
  selector: 'add-team-button',
  styleUrl: './add-team-button.component.scss',
  templateUrl: './add-team-button.component.html'
})
export class AddTeamButtonComponent {
  @Input() period: any;

  constructor(private dialog: MatDialog) {}

  protected openAddTeamDialog(): void {
    this.dialog.open(AddTeamDialogComponent, {
      panelClass: 'dialog-md',
      data: this.period
    });
  }
}
