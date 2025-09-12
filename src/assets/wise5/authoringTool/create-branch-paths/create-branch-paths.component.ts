import { Component, Input, SimpleChanges } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CHOICE_CHOSEN_VALUE, SCORE_VALUE } from '../../../../app/domain/branchCriteria';
import { ComponentContent } from '../../common/ComponentContent';
import { Choice } from '../../components/multipleChoice/Choice';
import { MultipleChoiceContent } from '../../components/multipleChoice/MultipleChoiceContent';
import { TeacherProjectService } from '../../services/teacherProjectService';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  selector: 'create-branch-paths',
  styleUrl: './create-branch-paths.component.scss',
  templateUrl: './create-branch-paths.component.html'
})
export class CreateBranchPathsComponent {
  protected readonly CHOICE_CHOSEN_VALUE: string = CHOICE_CHOSEN_VALUE;
  protected readonly SCORE_VALUE: string = SCORE_VALUE;

  protected choices: Choice[] = [];
  @Input() componentId: string = '';
  @Input() criteria: string = '';
  @Input() nodeId: string = '';
  @Input() pathCount: number;
  protected pathsFormArray: FormArray = new FormArray([]);
  @Input() pathFormGroup: FormGroup;

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.pathFormGroup.addControl('paths', this.pathsFormArray);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pathCount) {
      this.updateNumPathFormControls();
    } else {
      this.clearPathFormControlValues();
      if (this.pathsFormArray.length === 0) {
        this.initializeFormControls();
      }
      if (this.criteria === this.CHOICE_CHOSEN_VALUE) {
        this.initializeChoiceChosenOptions();
      }
    }
  }

  protected clearPathFormControlValues(): void {
    this.pathsFormArray.controls.forEach((formControl) => formControl.setValue(''));
  }

  protected initializeFormControls(): void {
    this.increasePaths();
  }

  protected updateNumPathFormControls(): void {
    if (this.criteriaRequiresAdditionalParams(this.criteria)) {
      if (this.pathsFormArray.length < this.pathCount) {
        this.increasePaths();
      } else if (this.pathsFormArray.length > this.pathCount) {
        this.decreasePaths();
      }
    }
  }

  protected criteriaRequiresAdditionalParams(criteria: string): boolean {
    return criteria === this.SCORE_VALUE || criteria === this.CHOICE_CHOSEN_VALUE;
  }

  private increasePaths(): void {
    for (let i = this.pathsFormArray.length; i < this.pathCount; i++) {
      this.createPathFormControl();
    }
  }

  private decreasePaths(): void {
    for (let i = this.pathsFormArray.length - 1; i >= this.pathCount; i--) {
      this.pathsFormArray.removeAt(i);
    }
  }

  protected createPathFormControl(): FormControl {
    const formControl = new FormControl('', [Validators.required]);
    this.pathsFormArray.push(formControl);
    return formControl;
  }

  protected initializeChoiceChosenOptions(): void {
    if (this.getComponent()?.type === 'MultipleChoice') {
      this.populateChoices();
      this.autoFillChoiceChosenValues();
    } else {
      this.choices = [];
    }
  }

  protected populateChoices(): void {
    const component: MultipleChoiceContent = this.getComponent() as MultipleChoiceContent;
    this.choices = component.choices;
  }

  protected autoFillChoiceChosenValues(): void {
    const component: MultipleChoiceContent = this.getComponent() as MultipleChoiceContent;
    const choiceIds = component.choices.map((choice: Choice) => choice.id);
    this.pathsFormArray.controls.forEach((formControl, index) => {
      formControl.setValue(choiceIds[index]);
    });
  }

  protected getComponent(): ComponentContent {
    return this.projectService.getNode(this.nodeId).getComponent(this.componentId);
  }
}
