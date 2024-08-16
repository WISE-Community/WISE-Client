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
import { MultipleChoiceContent } from '../../components/multipleChoice/MultipleChoiceContent';
import { CHOICE_CHOSEN_VALUE, SCORE_VALUE } from '../../../../app/domain/branchCriteria';
import { ComponentContent } from '../../common/ComponentContent';
import { MatSelectModule } from '@angular/material/select';
import { DisplayBranchPathStepsComponent } from '../display-branch-path-steps/display-branch-path-steps.component';

@Component({
  selector: 'branch-path-authoring',
  standalone: true,
  imports: [
    CommonModule,
    DisplayBranchPathStepsComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  styleUrl: './branch-path-authoring.component.scss',
  templateUrl: './branch-path-authoring.component.html'
})
export class BranchPathAuthoringComponent {
  protected readonly CHOICE_CHOSEN_VALUE: string = CHOICE_CHOSEN_VALUE;
  protected readonly SCORE_VALUE: string = SCORE_VALUE;

  @Input() branchPaths: any[] = [];
  protected choices: Choice[] = [];
  @Input() componentId: string = '';
  @Input() criteria: string = '';
  protected formControls: FormControl[] = [];
  @Input() nodeId: string = '';
  @Input() pathCount: number;
  @Input() pathFormGroup: FormGroup;

  constructor(private projectService: TeacherProjectService) {}

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
        this.initializeFormControls();
        this.initializePathValues();
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
    return criteria === this.SCORE_VALUE || criteria === this.CHOICE_CHOSEN_VALUE;
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

  private initializeFormControls(): void {
    for (let i = 0; i < this.pathCount; i++) {
      const pathFormControl = new FormControl('', [Validators.required]);
      this.pathFormGroup.addControl(this.getFormControlName(i), pathFormControl);
      this.formControls.push(pathFormControl);
    }
  }

  private initializePathValues(): void {
    if (this.criteria === this.CHOICE_CHOSEN_VALUE) {
      this.populateChoices();
      this.autoFillChoiceChosenValues();
    } else {
      this.choices = [];
    }
  }

  private populateChoices(): void {
    const component: MultipleChoiceContent = this.getComponent() as MultipleChoiceContent;
    this.choices = component.choices;
  }

  private autoFillChoiceChosenValues(): void {
    const component: MultipleChoiceContent = this.getComponent() as MultipleChoiceContent;
    const choiceIds = component.choices.map((choice: Choice) => choice.id);
    for (let i = 0; i < this.pathCount; i++) {
      if (choiceIds[i] != null) {
        this.pathFormGroup.controls[this.getFormControlName(i)].setValue(choiceIds[i]);
      }
    }
  }

  private getComponent(): ComponentContent {
    const components = this.projectService.getComponents(this.nodeId);
    return components.find((component) => component.id === this.componentId);
  }

  private getFormControlName(index: number): string {
    return `path-${index + 1}`;
  }
}
