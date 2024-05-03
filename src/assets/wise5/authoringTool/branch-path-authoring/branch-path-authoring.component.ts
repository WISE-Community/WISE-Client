import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { Choice } from '../../components/multipleChoice/Choice';
import { BranchService } from '../../services/branchService';
import { MultipleChoiceContent } from '../../components/multipleChoice/MultipleChoiceContent';

@Component({
  selector: 'branch-path-authoring',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './branch-path-authoring.component.html'
})
export class BranchPathAuthoringComponent {
  protected readonly CHOICE_CHOSEN: string = this.branchService.CHOICE_CHOSEN;
  protected readonly SCORE: string = this.branchService.SCORE;

  @Input() componentId: string = '';
  @Input() criteria: string = '';
  protected formControls: FormControl[] = [];
  @Input() nodeId: string = '';
  @Input() pathCount: number;
  @Input() pathFormGroup: FormGroup;

  constructor(
    private branchService: BranchService,
    private projectService: TeacherProjectService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pathCount) {
      this.updateNumPathFormControls();
    } else {
      this.removePathFormControls();
      if (
        this.nodeId !== '' &&
        this.componentId !== '' &&
        this.criteriaRequiresAdditionalParams(this.criteria)
      ) {
        for (let i = 0; i < this.pathCount; i++) {
          const pathFormControl = new FormControl('', [Validators.required]);
          this.pathFormGroup.addControl(this.getFormControlName(i), pathFormControl);
          this.formControls.push(pathFormControl);
        }
        this.tryAutoSelectPathParamValues();
      }
    }
  }

  private updateNumPathFormControls(): void {
    if (this.criteriaRequiresAdditionalParams(this.criteria)) {
      if (this.formControls.length < this.pathCount) {
        this.increasePaths();
      } else if (this.formControls.length > this.pathCount) {
        this.decreasePaths();
      }
    }
  }

  private criteriaRequiresAdditionalParams(criteria: string): boolean {
    return criteria === this.SCORE || criteria === this.CHOICE_CHOSEN;
  }

  private increasePaths(): void {
    for (let i = this.formControls.length; i < this.pathCount; i++) {
      const pathFormControl = new FormControl('', [Validators.required]);
      this.pathFormGroup.addControl(this.getFormControlName(i), pathFormControl);
      this.formControls.push(pathFormControl);
    }
  }

  private decreasePaths(): void {
    for (let i = this.formControls.length - 1; i >= this.pathCount; i--) {
      this.pathFormGroup.removeControl(this.getFormControlName(i));
      this.formControls.pop();
    }
  }

  private removePathFormControls(): void {
    for (let i = 0; i < this.pathCount; i++) {
      this.pathFormGroup.removeControl(this.getFormControlName(i));
    }
    this.formControls = [];
  }

  private tryAutoSelectPathParamValues(): void {
    if (this.criteria === this.CHOICE_CHOSEN) {
      this.autoFillChoiceChosenValues();
    }
  }

  private autoFillChoiceChosenValues(): void {
    const components = this.projectService.getComponents(this.nodeId);
    const component = components.find(
      (component) => component.id === this.componentId
    ) as MultipleChoiceContent;
    const choiceIds = component.choices.map((choice: Choice) => choice.id);
    for (let i = 0; i < this.pathCount; i++) {
      if (choiceIds[i] != null) {
        this.pathFormGroup.controls[this.getFormControlName(i)].setValue(choiceIds[i]);
      }
    }
  }

  private getFormControlName(index: number): string {
    return `path-${index + 1}`;
  }
}
