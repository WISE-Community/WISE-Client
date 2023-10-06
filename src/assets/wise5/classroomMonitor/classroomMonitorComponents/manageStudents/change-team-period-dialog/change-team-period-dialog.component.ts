import { HttpClient } from '@angular/common/http';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'change-team-period-dialog',
  templateUrl: './change-team-period-dialog.component.html',
  styleUrls: ['./change-team-period-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangeTeamPeriodDialogComponent {
  canViewStudentNames: boolean;
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
    protected configService: ConfigService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
    this.periods = this.configService.getPeriods().filter((period) => {
      return period.periodId != -1 && period.periodId != this.team.periodId;
    });
  }

  changePeriod() {
    this.isChangingPeriod = true;
    this.http
      .post(
        `/api/teacher/run/${this.configService.getRunId()}/team/${
          this.team.workgroupId
        }/change-period`,
        this.selectedPeriod.periodId
      )
      .subscribe({
        next: () => {
          this.isChangingPeriod = false;
          this.configService
            .retrieveConfig(`/api/config/classroomMonitor/${this.configService.getRunId()}`)
            .subscribe({
              next: () => {
                this.snackBar.open(
                  $localize`Moved Team ${this.team.workgroupId} to Period ${this.selectedPeriod.periodName}.`
                );
                this.dialog.closeAll();
              }
            });
        },
        error: () => {
          this.isChangingPeriod = false;
        }
      });
  }
}
