import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { AddTeamDialogComponent } from '../add-team-dialog/add-team-dialog.component';

@Component({
  selector: 'add-team-button',
  templateUrl: './add-team-button.component.html',
  styleUrls: ['./add-team-button.component.scss']
})
export class AddTeamButtonComponent {
  isDisabled: boolean;

  constructor(
    private dialog: MatDialog,
    private ConfigService: ConfigService,
    private TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.isDisabled =
      this.ConfigService.getAllUsersInPeriod(this.TeacherDataService.getCurrentPeriodId()).length ==
      0;
  }

  openAddTeamDialog(): void {
    this.dialog.open(AddTeamDialogComponent, {
      panelClass: 'mat-dialog--md'
    });
  }
}
