import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, inject } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { finalize } from 'rxjs/operators';
import {
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ListClassroomCoursesDialogComponent } from '../list-classroom-courses-dialog/list-classroom-courses-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Project } from '../../domain/project';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { TeacherRun } from '../teacher-run';
import { TeacherService } from '../teacher.service';
import { UserService } from '../../services/user.service';
import { AccessLinkService } from '../../services/accessLinkService';

@Component({
  imports: [
    ClipboardModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatRadioModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  providers: [AccessLinkService, provideNativeDateAdapter()],
  selector: 'create-run-dialog',
  styleUrl: './create-run-dialog.component.scss',
  templateUrl: './create-run-dialog.component.html'
})
export class CreateRunDialogComponent {
  private accessLinkService = inject(AccessLinkService);
  private configService = inject(ConfigService);
  data = inject(MAT_DIALOG_DATA);
  dialog = inject(MatDialog);
  dialogRef = inject<MatDialogRef<CreateRunDialogComponent>>(MatDialogRef);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private teacherService = inject(TeacherService);
  private userService = inject(UserService);

  protected accessLinks: string[] = [];
  protected customPeriods: FormControl;
  private endDateControl: FormControl;
  form: FormGroup;
  protected isCreated: boolean = false;
  protected isCreating: boolean = false;
  protected maxStartDate: Date;
  protected minEndDate: Date;
  private periodOptions: string[] = [];
  periodsGroup: FormArray;
  project: Project;
  run: TeacherRun = null;

  ngOnInit(): void {
    this.project = this.data.project;
    this.setPeriodOptions();
    let hiddenControl = new FormControl('', Validators.required);
    this.periodsGroup = new FormArray(
      this.periodOptions.map(
        (period) =>
          new FormGroup({
            name: new FormControl(period),
            checkbox: new FormControl(false)
          })
      )
    );
    this.periodsGroup.valueChanges.subscribe((v) => {
      hiddenControl.setValue(this.getPeriodsString());
    });
    this.customPeriods = new FormControl('');
    this.customPeriods.valueChanges.subscribe((v) => {
      hiddenControl.setValue(this.getPeriodsString());
    });
    this.endDateControl = new FormControl();
    this.endDateControl.valueChanges.subscribe((v) => {
      this.updateLockedAfterEndDateCheckbox();
    });
    this.form = this.fb.group({
      selectedPeriods: this.periodsGroup,
      customPeriods: this.customPeriods,
      periods: hiddenControl,
      runType: new FormControl('default', Validators.required),
      maxStudentsPerTeam: new FormControl(3, Validators.required),
      startDate: new FormControl(new Date(), Validators.required),
      endDate: this.endDateControl,
      isLockedAfterEndDate: new FormControl({ value: false, disabled: true })
    });
    this.setDateRange();
  }

  protected isGoogleUser(): boolean {
    return this.userService.isGoogleUser();
  }

  protected isGoogleClassroomEnabled(): boolean {
    return this.configService.isGoogleClassroomEnabled();
  }

  private setPeriodOptions(): void {
    for (let i = 1; i < 9; i++) {
      this.periodOptions.push(i.toString());
    }
  }

  get selectedPeriodsControl() {
    return <FormArray>this.form.get('selectedPeriods');
  }

  private mapPeriods(items: any[]): string[] {
    const selectedPeriods = items.filter((item) => item.checkbox).map((item) => item.name);
    return selectedPeriods.length ? selectedPeriods : [];
  }

  create(): void {
    this.isCreating = true;
    const isSurvey: boolean = this.getFormControlValue('runType') === 'survey';
    const combinedPeriods = isSurvey
      ? this.mapPeriods(this.periodsGroup.value).toString()
      : this.getPeriodsString();
    const startDate: number = this.getFormControlValue('startDate').getTime();
    let endDateValue: Date = this.getFormControlValue('endDate');
    let endDate: number = null;
    if (endDateValue) {
      endDateValue.setHours(23, 59, 59);
      endDate = endDateValue.getTime();
    }
    const isLockedAfterEndDate: boolean = this.getFormControlValue('isLockedAfterEndDate');
    const maxStudentsPerTeam: number = isSurvey
      ? 1
      : this.getFormControlValue('maxStudentsPerTeam');
    this.teacherService
      .createRun(
        this.project.id,
        combinedPeriods,
        isSurvey,
        maxStudentsPerTeam,
        startDate,
        endDate,
        isLockedAfterEndDate
      )
      .pipe(
        finalize(() => {
          this.isCreating = false;
        })
      )
      .subscribe((newRun: TeacherRun) => {
        this.run = new TeacherRun(newRun);
        if (this.run.isSurveyRun()) {
          this.accessLinks = this.accessLinkService.getAccessLinks(
            this.run.runCode,
            this.run.periods
          );
        }
        this.dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/teacher/home/schedule'], {
            queryParams: { newRunId: newRun.id }
          });
        });
        this.isCreated = true;
      });
  }

  getPeriodsString(): string {
    const periods = this.mapPeriods(this.periodsGroup.value);
    const customPeriods = this.customPeriods.value.split(',');
    for (let i = 0; i < customPeriods.length; i++) {
      customPeriods[i] = customPeriods[i].trim();
    }
    if (periods.length > 0) {
      return periods.toString() + ',' + customPeriods.toString();
    } else {
      return customPeriods.toString();
    }
  }

  protected setDateRange(): void {
    this.minEndDate = this.getFormControlValue('startDate');
    this.maxStartDate = this.getFormControlValue('endDate');
  }

  protected closeAll(): void {
    this.dialog.closeAll();
  }

  protected checkClassroomAuthorization(): void {
    this.teacherService
      .getClassroomAuthorizationUrl(this.userService.getUser().getValue().username)
      .subscribe(({ authorizationUrl }) => {
        if (authorizationUrl == null) {
          this.getClassroomCourses();
        } else {
          const authWindow = window.open(authorizationUrl, 'authorize', 'width=600,height=800');
          const timer = setInterval(() => {
            if (authWindow.closed) {
              clearInterval(timer);
              this.checkClassroomAuthorization();
            }
          }, 1000);
        }
      });
  }

  private getClassroomCourses(): void {
    this.teacherService
      .getClassroomCourses(this.userService.getUser().getValue().username)
      .subscribe((courses) => {
        this.dialog.open(ListClassroomCoursesDialogComponent, {
          data: { run: this.run, courses },
          panelClass: 'mat-dialog-md'
        });
      });
  }

  updateLockedAfterEndDateCheckbox(): void {
    if (this.endDateControl.value == null) {
      this.form.controls['isLockedAfterEndDate'].setValue(false);
      this.form.controls['isLockedAfterEndDate'].disable();
    } else {
      this.form.controls['isLockedAfterEndDate'].enable();
    }
  }

  protected isDefaultRun(): boolean {
    return this.getFormControlValue('runType') === 'default';
  }

  private getFormControlValue(control: string): any {
    return this.form.controls[control].value;
  }

  protected copyMsg(): void {
    this.snackBar.open($localize`Copied to clipboard.`);
  }

  protected getPeriodFromAccessLink(link: string): string {
    return this.accessLinkService.getPeriodFromAccessLink(link);
  }

  protected setAsSurveyUnit(): void {
    this.customPeriods.setValue('');
    this.periodsGroup.controls.forEach((control, index) => {
      index === 0
        ? control.get('checkbox').setValue(true)
        : control.get('checkbox').setValue(false);
    });
  }
}
