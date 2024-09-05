import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  @Input() branchPaths: any[] = [];

  ngOnChanges(): void {
    if (this.criteriaRequiresAdditionalParams(this.criteria)) {
      this.clearPathFormControlValues();
      if (this.pathsFormArray.length === 0) {
        this.initializeFormControls();
      }
      if (this.criteria === this.CHOICE_CHOSEN_VALUE) {
        this.initializeChoiceChosenOptions();
      }
      if (this.isComponentSet()) {
        this.enablePathFormControls();
      } else {
        this.disablePathFormControls();
      }
    } else {
      this.deletePathFormControls();
    }
  }

  protected initializeFormControls(): void {
    this.branchPaths.forEach((branchPath) => {
      const formControl = this.createPathFormControl();
      this.setPathFormControlValue(branchPath, formControl);
      branchPath.formControl = formControl;
    });
  }

  protected initializeChoiceChosenOptions(): void {
    if (this.getComponent()?.type === 'MultipleChoice') {
      this.populateChoices();
    } else {
      this.choices = [];
    }
  }

  protected isComponentSet(): boolean {
    return (
      this.nodeId != null &&
      this.nodeId !== '' &&
      this.componentId != null &&
      this.componentId !== ''
    );
  }

  private enablePathFormControls(): void {
    this.pathsFormArray.controls.forEach((formControl) => formControl.enable());
  }

  private disablePathFormControls(): void {
    this.pathsFormArray.controls.forEach((formControl) => formControl.disable());
  }

  private deletePathFormControls(): void {
    this.pathsFormArray.clear();
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
    if (this.branchPaths.filter((branchPath) => !branchPath.delete).length <= 2) {
      alert($localize`You are not allowed to have fewer than 2 paths.`);
    } else {
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
}
