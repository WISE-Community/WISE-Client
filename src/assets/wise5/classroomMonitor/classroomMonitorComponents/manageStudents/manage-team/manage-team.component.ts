import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChangeTeamPeriodDialogComponent } from '../change-team-period-dialog/change-team-period-dialog.component';

@Component({
  selector: 'manage-team',
  styleUrls: ['manage-team.component.scss'],
  templateUrl: 'manage-team.component.html'
})
export class ManageTeamComponent {
  @Input() team: any;

  constructor(private dialog: MatDialog) {}

  changePeriod() {
    this.dialog.open(ChangeTeamPeriodDialogComponent, {
      data: this.team,
      panelClass: 'mat-dialog--md'
    });
  }
}
