import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DisplayBranchPathStepsComponent } from '../display-branch-path-steps/display-branch-path-steps.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateBranchPathsComponent } from '../create-branch-paths/create-branch-paths.component';

@Component({
  imports: [
    CommonModule,
    DisplayBranchPathStepsComponent,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  selector: 'edit-branch-paths',
  standalone: true,
  styleUrl: '../create-branch-paths/create-branch-paths.component.scss',
  templateUrl: './edit-branch-paths.component.html'
})
export class EditBranchPathsComponent extends CreateBranchPathsComponent {
  private pathsFormArray: FormArray = new FormArray([]);

  ngOnInit(): void {
    this.pathFormGroup.addControl('paths', this.pathsFormArray);
  }

  ngOnChanges(): void {
    if (this.criteriaRequiresAdditionalParams(this.criteria)) {
      this.initializeFormControls();
      this.initializePathValues();
    }
  }

  protected initializeFormControls(): void {
    this.branchPaths.forEach((branchPath) => {
      const formControl = this.createPathFormControl();
      this.setPathFormControlValue(branchPath, formControl);
      branchPath.formControl = formControl;
    });
  }

  protected autoFillChoiceChosenValues(): void {}

  private createPathFormControl(): FormControl {
    const formControl = new FormControl('', [Validators.required]);
    this.pathsFormArray.push(formControl);
    return formControl;
  }

  private setPathFormControlValue(branchPath: any, formControl: FormControl): void {
    if (this.criteria === this.CHOICE_CHOSEN_VALUE && branchPath.choiceId != null) {
      formControl.setValue(branchPath.choiceId);
    } else if (this.criteria === this.SCORE_VALUE && branchPath.scores != null) {
      formControl.setValue(branchPath.scores.toString());
    }
  }

  protected addPath(): void {
    const branchPath: any = {
      new: true,
      nodesInBranchPath: []
    };
    if (this.criteria === this.CHOICE_CHOSEN_VALUE || this.criteria === this.SCORE_VALUE) {
      branchPath.formControl = this.createPathFormControl();
    }
    this.branchPaths.push(branchPath);
  }

  protected deletePath(index: number): void {
    const branchPath = this.branchPaths[index];
    if (branchPath.new) {
      this.branchPaths.splice(index, 1);
      if (branchPath.formControl != null) {
        this.pathsFormArray.removeAt(index);
      }
    } else {
      branchPath.delete = true;
      if (branchPath.formControl != null) {
        branchPath.formControl.disable();
        branchPath.formControl.clearValidators();
      }
    }
  }
}
