import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatProgressBar
  ],
  selector: 'change-team-period-dialog',
  styleUrl: './change-team-period-dialog.component.scss',
  templateUrl: './change-team-period-dialog.component.html'
})
export class ChangeTeamPeriodDialogComponent {
  protected configService = inject(ConfigService);
  protected dialog = inject(MatDialog);
  protected http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  team = inject(MAT_DIALOG_DATA);

  canViewStudentNames: boolean;
  selectPeriodForm: FormGroup = new FormGroup({
    period: new FormControl('', Validators.required)
  });
  isChangingPeriod: boolean;
  periods: any[];
  selectedPeriod: any;

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
