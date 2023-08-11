import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTeamDialogComponent } from '../add-team-dialog/add-team-dialog.component';

@Component({
  selector: 'add-team-button',
  templateUrl: './add-team-button.component.html',
  styleUrls: ['./add-team-button.component.scss']
})
export class AddTeamButtonComponent {
  isDisabled: boolean;
  @Input() period: any;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  protected openAddTeamDialog(): void {
    this.dialog.open(AddTeamDialogComponent, {
      panelClass: 'dialog-md',
      data: this.period
    });
  }
}
