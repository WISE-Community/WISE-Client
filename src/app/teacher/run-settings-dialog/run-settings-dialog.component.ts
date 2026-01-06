import { Component, LOCALE_ID, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { LibraryProjectDetailsComponent } from '../../modules/library/library-project-details/library-project-details.component';
import { TeacherService } from '../teacher.service';
import { formatDate } from '@angular/common';
import { TeacherRun } from '../teacher-run';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatDividerModule
  ],
  styleUrl: './run-settings-dialog.component.scss',
  templateUrl: './run-settings-dialog.component.html'
})
export class RunSettingsDialogComponent {
  dialog = inject(MatDialog);
  dialogRef = inject<MatDialogRef<LibraryProjectDetailsComponent>>(MatDialogRef);
  private localeID = inject(LOCALE_ID);
  run = inject<TeacherRun>(MAT_DIALOG_DATA);
  snackBar = inject(MatSnackBar);
  private teacherService = inject(TeacherService);

  newPeriodName: string;
  maxStudentsPerTeam: string;
  startDate: Date;
  previousStartDate: Date;
  endDate: Date;
  isLockedAfterEndDateCheckboxEnabled: boolean = false;
  isLockedAfterEndDate: boolean;
  previousEndDate: Date;
  deletePeriodMessage: string = '';
  addPeriodMessage: string = '';
  maxStudentsPerTeamMessage: string = '';
  startDateMessage: string = '';
  endDateMessage: string = '';
  isLockedAfterEndDateMessage: string = '';
  protected isDefaultRun: boolean = true;
  maxStartDate: Date;
  minEndDate: Date;
  targetEndDate: Date;
  messageCodeToMessage: any;

  constructor() {
    this.maxStudentsPerTeam = this.run.maxStudentsPerTeam + '';
    this.startDate = new Date(this.run.startTime);
    this.endDate = this.run.endTime ? new Date(this.run.endTime) : null;
    this.isLockedAfterEndDate = this.run.isLockedAfterEndDate;
    this.rememberPreviousStartDate();
    this.rememberPreviousEndDate();
    this.setDateRange();
    if (this.endDate != null) {
      this.isLockedAfterEndDateCheckboxEnabled = true;
    }
    this.initializeMessageCodeToMessage();
    this.isDefaultRun = !this.run.isSurveyRun();
  }

  initializeMessageCodeToMessage() {
    this.messageCodeToMessage = {
      periodNameAlreadyExists: $localize`There is already a period with that name.`,
      noPermissionToAddPeriod: $localize`You do not have permission to add periods to this unit.`,
      notAllowedToDeletePeriodWithStudents: $localize`You are not allowed to delete a period that contains students.`,
      noPermissionToDeletePeriod: $localize`You do not have permission to delete periods from this unit.`,
      noPermissionToChangeMaxStudentsPerTeam: $localize`You do not have permission to change the number of students per team for this unit.`,
      notAllowedToDecreaseMaxStudentsPerTeam: $localize`You are not allowed to decrease the number of students per team because this unit already has teams with more than 1 student.`,
      noPermissionToChangeDate: $localize`You do not have permission to change the dates for this unit.`,
      endDateBeforeStartDate: $localize`End date can't be before start date.`,
      startDateAfterEndDate: $localize`Start date can't be after end date.`,
      noPermissionToChangeIsLockedAfterEndDate: $localize`You do not have permission to change whether unit is locked after end date.`
    };
  }

  newPeriodNameKeyUp(event) {
    if (this.isEnterKeyWithNewPeriodName(event)) {
      this.addPeriod();
    }
  }

  isEnterKeyWithNewPeriodName(event) {
    return event.keyCode === 13 && this.newPeriodName != '';
  }

  addPeriod() {
    this.clearErrorMessages();
    const periodName = this.newPeriodName;
    if (periodName == null || periodName === '') {
      this.addPeriodMessage = $localize`Please enter a new period name.`;
    } else {
      this.teacherService.addPeriodToRun(this.run.id, periodName).subscribe((response: any) => {
        if (response.status === 'success') {
          this.run = response.run;
          this.updateDataRun(this.run);
          this.clearNewPeriodInput();
          this.clearErrorMessages();
          this.showConfirmMessage();
          this.teacherService.broadcastRunChanges(new TeacherRun(this.run));
        } else {
          this.addPeriodMessage = this.translateMessageCode(response.messageCode);
        }
      });
    }
  }

  deletePeriod(periodName) {
    this.clearErrorMessages();
    if (confirm(`Are you sure you want to delete this period: ${periodName}?`)) {
      this.teacherService
        .deletePeriodFromRun(this.run.id, periodName)
        .subscribe((response: any) => {
          if (response.status === 'success') {
            this.run = response.run;
            this.updateDataRun(this.run);
            this.clearErrorMessages();
            this.showConfirmMessage();
            this.teacherService.broadcastRunChanges(new TeacherRun(this.run));
          } else {
            this.deletePeriodMessage = this.translateMessageCode(response.messageCode);
            alert(this.deletePeriodMessage);
          }
        });
    }
  }

  changeMaxStudentsPerTeam(maxStudentsPerTeam) {
    this.clearErrorMessages();
    let maxStudentsPerTeamText = maxStudentsPerTeam;
    if (maxStudentsPerTeam === 3) {
      maxStudentsPerTeamText = $localize`1-3`;
    }
    if (
      confirm(
        $localize`Are you sure you want to change the students per team to ${maxStudentsPerTeamText}:maxStudentsPerTeam:?`
      )
    ) {
      this.teacherService
        .updateRunStudentsPerTeam(this.run.id, maxStudentsPerTeam)
        .subscribe((response: any) => {
          if (response.status === 'success') {
            this.run = response.run;
            this.updateDataRun(this.run);
            this.clearErrorMessages();
            this.showConfirmMessage();
          } else {
            this.rollbackMaxStudentsPerTeam();
            this.maxStudentsPerTeamMessage = this.translateMessageCode(response.messageCode);
            alert(this.maxStudentsPerTeamMessage);
          }
        });
      return true;
    } else {
      this.rollbackMaxStudentsPerTeam();
      return false;
    }
  }

  updateStartTime() {
    this.clearErrorMessages();
    if (this.startDate) {
      const startDate = this.startDate;
      const formattedStartDate = formatDate(startDate, 'fullDate', this.localeID);
      if (
        confirm(
          $localize`Are you sure you want to change the start date to ${formattedStartDate}:startDate:?`
        )
      ) {
        this.teacherService
          .updateRunStartTime(this.run.id, startDate.getTime())
          .subscribe((response: any) => {
            if (response.status === 'success') {
              this.run = response.run;
              this.updateDataRun(this.run);
              this.rememberPreviousStartDate();
              this.clearErrorMessages();
              this.showConfirmMessage();
              this.setDateRange();
            } else {
              this.startDateMessage = this.translateMessageCode(response.messageCode);
            }
          });
      } else {
        this.rollbackStartDate();
      }
    } else {
      this.rollbackStartDate();
    }
  }

  updateEndTime() {
    this.clearErrorMessages();
    if (confirm(this.getEndDateChangeConfirmationMessage())) {
      this.updateRunEndTime(this.run.id, this.getEndTime());
    } else {
      this.rollbackEndDate();
    }
  }

  updateRunEndTime(runId, endTime) {
    this.teacherService.updateRunEndTime(runId, endTime).subscribe((response: any) => {
      if (response.status === 'success') {
        this.run = response.run;
        this.updateDataRun(this.run);
        this.rememberPreviousEndDate();
        this.clearErrorMessages();
        this.showConfirmMessage();
        this.setDateRange();
        this.updateLockedAfterEndDateCheckbox();
      } else {
        this.endDateMessage = this.translateMessageCode(response.messageCode);
      }
    });
  }

  getEndDateChangeConfirmationMessage() {
    let message = '';
    if (this.endDate) {
      const endDate = this.endDate;
      endDate.setHours(23, 59, 59);
      const formattedEndDate = formatDate(endDate, 'fullDate', this.localeID);
      message = $localize`Are you sure you want to change the end date to ${formattedEndDate}:endDate:?`;
    } else {
      message = $localize`Are you sure you want to remove the end date?`;
    }
    return message;
  }

  getEndTime() {
    if (this.endDate == null) {
      return null;
    } else {
      return this.endDate.getTime();
    }
  }

  setDateRange() {
    this.minEndDate = this.startDate;
    this.maxStartDate = this.endDate;
    this.targetEndDate = null;
    if (this.run.lastRun && !this.run.endTime) {
      this.targetEndDate = new Date(this.run.lastRun);
    }
  }

  updateLockedAfterEndDateCheckbox() {
    if (this.endDate == null) {
      const previousIsLockedAfterEndDateValue = this.isLockedAfterEndDate;
      this.isLockedAfterEndDateCheckboxEnabled = false;
      this.isLockedAfterEndDate = false;
      if (previousIsLockedAfterEndDateValue != this.isLockedAfterEndDate) {
        this.updateIsLockedAfterEndDate();
      }
    } else {
      this.isLockedAfterEndDateCheckboxEnabled = true;
    }
  }

  updateIsLockedAfterEndDate() {
    this.teacherService
      .updateIsLockedAfterEndDate(this.run.id, this.isLockedAfterEndDate)
      .subscribe((response: any) => {
        if (response.status === 'success') {
          this.run = response.run;
          this.updateDataRun(this.run);
          this.clearErrorMessages();
        } else {
          this.isLockedAfterEndDateMessage = this.translateMessageCode(response.messageCode);
        }
      });
  }

  rollbackMaxStudentsPerTeam() {
    this.maxStudentsPerTeam = this.run.maxStudentsPerTeam + '';
  }

  rollbackStartDate() {
    this.startDate = this.previousStartDate;
  }

  rollbackEndDate() {
    this.endDate = this.previousEndDate;
  }

  rememberPreviousStartDate() {
    this.previousStartDate = new Date(this.run.startTime);
  }

  rememberPreviousEndDate() {
    this.previousEndDate = new Date(this.run.endTime);
  }

  clearNewPeriodInput() {
    this.newPeriodName = '';
  }

  clearErrorMessages() {
    this.deletePeriodMessage = '';
    this.addPeriodMessage = '';
    this.maxStudentsPerTeamMessage = '';
    this.startDateMessage = '';
    this.endDateMessage = '';
    this.isLockedAfterEndDateMessage = '';
  }

  showConfirmMessage() {
    this.snackBar.open($localize`Unit settings updated.`);
  }

  translateMessageCode(messageCode: string): string {
    return this.messageCodeToMessage[messageCode];
  }

  updateDataRun(run) {
    this.run.periods = run.periods;
    this.run.maxStudentsPerTeam = run.maxStudentsPerTeam;
    this.run.startTime = run.startTime;
    this.run.endTime = run.endTime;
    this.run.isLockedAfterEndDate = run.isLockedAfterEndDate;
    this.run.lastRun = run.lastRun;
  }
}
