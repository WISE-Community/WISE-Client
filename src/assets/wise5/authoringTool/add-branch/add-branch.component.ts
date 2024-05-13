import { Component } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SelectStepComponent } from '../../../../app/authoring-tool/select-step/select-step.component';
import { SelectComponentComponent } from '../../../../app/authoring-tool/select-component/select-component.component';
import { BranchPathAuthoringComponent } from '../branch-path-authoring/branch-path-authoring.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  BranchCriteria,
  BRANCH_CRITERIA,
  CHOICE_CHOSEN_VALUE,
  SCORE_VALUE,
  WORKGROUP_ID_VALUE,
  RANDOM_VALUE,
  TAG_VALUE
} from '../../../../app/domain/branchCriteria';
import { SelectMergeStepComponent } from '../select-merge-step/select-merge-step.component';
import { CreateBranchService } from '../../services/createBranchService';
import { CreateBranchParams } from '../../common/CreateBranchParams';

@Component({
  selector: 'add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss'],
  standalone: true,
  imports: [
    BranchPathAuthoringComponent,
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
    SelectComponentComponent,
    SelectMergeStepComponent,
    SelectStepComponent
  ]
})
export class AddBranchComponent {
  protected readonly BRANCH_CRITERIA: BranchCriteria[] = BRANCH_CRITERIA;
  protected readonly CHOICE_CHOSEN_VALUE: string = CHOICE_CHOSEN_VALUE;
  protected readonly RANDOM_VALUE: string = RANDOM_VALUE;
  protected readonly SCORE_VALUE: string = SCORE_VALUE;
  protected readonly TAG_VALUE: string = TAG_VALUE;
  protected readonly WORKGROUP_ID_VALUE: string = WORKGROUP_ID_VALUE;

  protected allowedComponentTypes: string[] = [];
  private components: any[];
  protected pathFormGroup: FormGroup = this.fb.group({});
  protected targetId: string;
  protected targetTitle: string;

  protected formGroup: FormGroup = this.fb.group({
    pathCount: new FormControl('', [Validators.required]),
    criteria: new FormControl('', [Validators.required]),
    pathFormGroup: this.pathFormGroup,
    mergeStep: new FormControl('')
  });

  constructor(
    private createBranchService: CreateBranchService,
    private fb: FormBuilder,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.targetId = history.state.targetId;
    this.targetTitle = this.projectService.getNodePositionAndTitle(this.targetId);
    this.formGroup.controls['criteria'].valueChanges.subscribe((criteria: string) => {
      if (this.criteriaRequiresAdditionalParams(criteria)) {
        this.updateAllowedComponentTypes();
        this.updateStepAndComponentParams();
      } else {
        this.removeAdditionalParams();
      }
    });
  }

  private criteriaRequiresAdditionalParams(criteria: string): boolean {
    return criteria === this.SCORE_VALUE || criteria === this.CHOICE_CHOSEN_VALUE;
  }

  private updateAllowedComponentTypes(): void {
    const criteria = this.getCriteria();
    if (criteria === this.SCORE_VALUE) {
      this.allowedComponentTypes = [
        'AiChat',
        'Animation',
        'AudioOscillator',
        'ConceptMap',
        'DialogGuidance',
        'Discussion',
        'Draw',
        'Embedded',
        'Graph',
        'Label',
        'Match',
        'MultipleChoice',
        'OpenResponse',
        'PeerChat',
        'Table'
      ];
    } else if (criteria === this.CHOICE_CHOSEN_VALUE) {
      this.allowedComponentTypes = ['MultipleChoice'];
    }
  }

  private updateStepAndComponentParams(): void {
    this.initializeComponentIdSelector();
    this.initializeNodeIdSelector();
    this.updateComponentIdSelector();
  }

  private initializeNodeIdSelector(): void {
    if (this.formGroup.controls['nodeId'] == null) {
      this.formGroup.addControl('nodeId', new FormControl('', [Validators.required]));
      this.formGroup.controls['nodeId'].valueChanges.subscribe((nodeId: string) => {
        this.components = this.projectService.getComponents(nodeId);
        this.setComponentId('');
        this.tryAutoSelectComponentId();
      });
      if (this.getNodeId() === '') {
        this.setNodeId(this.targetId);
      }
    }
  }

  private initializeComponentIdSelector(): void {
    if (this.formGroup.controls['componentId'] == null) {
      this.formGroup.addControl('componentId', new FormControl('', [Validators.required]));
    }
  }

  private updateComponentIdSelector(): void {
    const selectedComponent = this.components.find(
      (component) => component.id === this.getComponentId()
    );
    if (selectedComponent == null || !this.allowedComponentTypes.includes(selectedComponent.type)) {
      this.setComponentId('');
    }
    this.tryAutoSelectComponentId();
  }

  private tryAutoSelectComponentId(): void {
    const criteria = this.getCriteria();
    if (criteria === this.SCORE_VALUE) {
      this.tryAutoSelectScoreComponent();
    } else if (criteria === this.CHOICE_CHOSEN_VALUE) {
      this.tryAutoSelectChoiceChosenComponent();
    }
  }

  private tryAutoSelectScoreComponent(): void {
    const numWorkComponents = this.components.filter((component) =>
      this.projectService.componentHasWork(component)
    ).length;
    if (numWorkComponents === 1) {
      this.setComponentId(
        this.components.find((component) => this.projectService.componentHasWork(component)).id
      );
    }
  }

  private tryAutoSelectChoiceChosenComponent(): void {
    const numMultipleChoice = this.components.filter(
      (component) => component.type === 'MultipleChoice'
    ).length;
    if (numMultipleChoice === 1) {
      this.setComponentId(
        this.components.find((component) => component.type === 'MultipleChoice').id
      );
    }
  }

  private removeAdditionalParams(): void {
    this.formGroup.removeControl('nodeId');
    this.formGroup.removeControl('componentId');
  }

  protected showSelectMergeStep(): boolean {
    return this.criteriaRequiresAdditionalParams(this.getCriteria())
      ? this.formGroup.controls['nodeId'].valid &&
          this.formGroup.controls['componentId'].valid &&
          this.formGroup.controls['pathFormGroup'].valid
      : this.formGroup.controls['criteria'].valid;
  }

  private getPathCount(): number {
    return this.formGroup.get('pathCount').value;
  }

  private getCriteria(): string {
    return this.formGroup.get('criteria').value;
  }

  private getNodeId(): string {
    return this.formGroup.get('nodeId')?.value;
  }

  private setNodeId(nodeId: string): void {
    this.formGroup.get('nodeId').setValue(nodeId);
  }

  private getComponentId(): string {
    return this.formGroup.get('componentId')?.value;
  }

  private setComponentId(componentId: string): void {
    this.formGroup.get('componentId').setValue(componentId);
  }

  protected setMergeStep(nodeId: string): void {
    this.formGroup.get('mergeStep').setValue(nodeId);
  }

  private getMergeStepId(): string {
    return this.formGroup.get('mergeStep').value;
  }

  private getBranchParams(): CreateBranchParams {
    const params: CreateBranchParams = {
      branchStepId: this.targetId,
      componentId: this.getComponentId(),
      criteria: this.getCriteria(),
      mergeStepId: this.getMergeStepId(),
      nodeId: this.getNodeId(),
      pathCount: this.getPathCount()
    };
    const pathKeys = Object.keys(this.pathFormGroup.controls);
    if (pathKeys.length > 0) {
      params.paths = [];
      pathKeys.forEach((key) => {
        params.paths.push(this.pathFormGroup.controls[key].value);
      });
    }
    return params;
  }

  protected async submit(): Promise<void> {
    await this.createBranchService.createBranch(this.getBranchParams());
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
