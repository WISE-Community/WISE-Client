import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { ChangeTeamPeriodDialogComponent } from '../change-team-period-dialog/change-team-period-dialog.component';

@Component({
  selector: 'manage-team',
  styleUrls: ['manage-team.component.scss'],
  templateUrl: 'manage-team.component.html'
})
export class ManageTeamComponent {
  @Input() team: any;

  canChangePeriod: boolean;

  constructor(private dialog: MatDialog, private ConfigService: ConfigService) {}

  ngOnInit() {
    this.canChangePeriod = this.ConfigService.getPermissions().canGradeStudentWork;
  }

  changePeriod() {
    this.dialog.open(ChangeTeamPeriodDialogComponent, {
      data: this.team,
      panelClass: 'mat-dialog--md'
    });
  }
}
