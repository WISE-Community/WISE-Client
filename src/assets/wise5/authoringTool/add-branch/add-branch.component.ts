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
import { RouterModule } from '@angular/router';
import { BranchService } from '../../services/branchService';

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
    SelectStepComponent
  ]
})
export class AddBranchComponent {
  protected readonly CHOICE_CHOSEN: string = this.branchService.CHOICE_CHOSEN;
  protected readonly SCORE: string = this.branchService.SCORE;

  protected allowedComponentTypes: string[] = [];
  protected branchCriteria: any = [
    {
      value: 'workgroupId',
      text: $localize`Workgroup ID`
    },
    {
      value: this.SCORE,
      text: $localize`Score`
    },
    {
      value: this.CHOICE_CHOSEN,
      text: $localize`Choice Chosen`
    },
    {
      value: 'random',
      text: $localize`Random`
    },
    {
      value: 'tag',
      text: $localize`Tag`
    }
  ];
  private components: any[];
  protected pathFormGroup: FormGroup = this.fb.group({});
  private targetId: string;

  protected formGroup: FormGroup = this.fb.group({
    pathCount: new FormControl('', [Validators.required]),
    criteria: new FormControl('', [Validators.required]),
    pathFormGroup: this.pathFormGroup
  });

  constructor(
    private branchService: BranchService,
    private fb: FormBuilder,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.targetId = history.state.targetId;
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
    return criteria === this.SCORE || criteria === this.CHOICE_CHOSEN;
  }

  private updateAllowedComponentTypes(): void {
    const criteria = this.getCriteria();
    if (criteria === this.SCORE) {
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
    } else if (criteria === this.CHOICE_CHOSEN) {
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
    if (criteria === this.SCORE) {
      this.tryAutoSelectScoreComponent();
    } else if (criteria === this.CHOICE_CHOSEN) {
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

  protected submit(): void {
    const data: any = {};
    data.pathCount = this.getPathCount();
    data.criteria = this.getCriteria();
    data.nodeId = this.getNodeId();
    data.componentId = this.getComponentId();
    const pathKeys = Object.keys(this.pathFormGroup.controls);
    if (pathKeys.length > 0) {
      data.paths = [];
      pathKeys.forEach((key) => {
        data.paths.push(this.pathFormGroup.controls[key].value);
      });
    }
    alert(JSON.stringify(data, null, 2));
  }
}
