import { HttpClient } from '@angular/common/http';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';

@Component({
  selector: 'change-team-period-dialog',
  templateUrl: './change-team-period-dialog.component.html',
  styleUrls: ['./change-team-period-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangeTeamPeriodDialogComponent {
  selectPeriodForm: FormGroup = new FormGroup({
    period: new FormControl('', Validators.required)
  });
  isChangingPeriod: boolean;
  periods: any[];
  selectedPeriod: any;

  constructor(
    protected dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public team: any,
    protected http: HttpClient,
    protected ConfigService: ConfigService
  ) {}

  ngOnInit(): void {
    this.periods = this.ConfigService.getPeriods().filter((period) => {
      return period.periodId != -1 && period.periodId != this.team.periodId;
    });
  }

  changePeriod() {
    this.isChangingPeriod = true;
    this.http
      .post(
        `/api/teacher/run/${this.ConfigService.getRunId()}/team/${
          this.team.workgroupId
        }/change-period`,
        this.selectedPeriod.periodId
      )
      .subscribe(() => {
        this.isChangingPeriod = false;
        this.ConfigService.retrieveConfig(
          `/api/config/classroomMonitor/${this.ConfigService.getRunId()}`
        );
        this.dialog.closeAll();
      });
  }
}
