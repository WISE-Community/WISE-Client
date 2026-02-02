import { Component, OnInit, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { StudentService } from '../student.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  imports: [
    MatDialogTitle,
    FormsModule,
    ReactiveFormsModule,
    CdkScrollable,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatProgressBar
  ],
  templateUrl: './add-project-dialog.component.html'
})
export class AddProjectDialogComponent implements OnInit {
  dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);

  validRunCodeSyntaxRegEx: any = /^[a-zA-Z]*\d{3,4}$/;
  registerRunRunCode: string = '';
  registerRunPeriods: string[] = [];
  selectedPeriod: string = '';
  accessCode: string = null;
  runCodeFormControl = new FormControl('', [runCodeValidator(this.validRunCodeSyntaxRegEx)]);
  addProjectForm: FormGroup = new FormGroup({
    runCode: this.runCodeFormControl,
    period: new FormControl({ value: '', disabled: true }, Validators.required)
  });
  isAdding = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['accessCode'] != null) {
        this.accessCode = params['accessCode'];
        this.addProjectForm.controls['runCode'].setValue(params['accessCode']);
        this.checkRunCode();
      }
    });
  }

  submit(): void {
    this.isAdding = true;
    this.studentService
      .addRun(this.registerRunRunCode, this.selectedPeriod)
      .subscribe((studentRun) => {
        if (studentRun.status === 'error') {
          if (studentRun.messageCode === 'alreadyAddedRun') {
            this.addProjectForm.controls['runCode'].setErrors({ alreadyAddedRun: true });
          } else if (studentRun.messageCode === 'runHasEnded') {
            this.addProjectForm.controls['runCode'].setErrors({ runHasEnded: true });
          } else if (studentRun.messageCode === 'runCodeNotFound') {
            this.addProjectForm.controls['runCode'].setErrors({ invalidRunCode: true });
          }
          this.isAdding = false;
        } else {
          this.studentService.addNewProject(studentRun);
          this.dialog.closeAll();
          this.isAdding = false;
        }
      });
  }

  clearPeriods(): void {
    this.selectedPeriod = '';
    this.registerRunPeriods = [];
    this.addProjectForm.controls['period'].disable();
  }

  checkRunCode(): void {
    const runCode = this.addProjectForm.controls['runCode'].value;
    this.registerRunRunCode = runCode;
    if (this.isValidRunCodeSyntax(runCode)) {
      this.studentService.getRunInfo(runCode).subscribe((runInfo) => {
        this.handleRunCodeResponse(runInfo);
      });
    } else {
      this.clearPeriods();
    }
  }

  handleRunCodeResponse(runInfo): void {
    if (runInfo.error) {
      this.clearPeriods();
      this.setInvalidRunCode();
    } else {
      if (runInfo.wiseVersion === 4) {
        this.setInvalidRunCode();
      } else {
        this.addProjectForm.controls['runCode'].setErrors(null);
        this.registerRunPeriods = runInfo.periods;
        this.addProjectForm.controls['period'].enable();
      }
    }
  }

  setInvalidRunCode(): void {
    this.addProjectForm.controls['runCode'].setErrors({ invalidRunCode: true });
  }

  isValidRunCodeSyntax(runCode: string): any {
    return this.validRunCodeSyntaxRegEx.test(runCode);
  }
}

export function runCodeValidator(validRunCodeSyntaxRegEx: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = validRunCodeSyntaxRegEx.test(control.value);
    return valid ? null : { invalidRunCodeSyntax: true };
  };
}
