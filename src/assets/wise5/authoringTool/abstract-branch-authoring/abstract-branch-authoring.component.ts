import { Directive } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CHOICE_CHOSEN_VALUE,
  RANDOM_VALUE,
  SCORE_VALUE,
  WORKGROUP_ID_VALUE
} from '../../../../app/domain/branchCriteria';
import { AuthorBranchParams } from '../../common/AuthorBranchParams';

@Directive()
export abstract class AbstractBranchAuthoringComponent {
  protected readonly CHOICE_CHOSEN_VALUE: string = CHOICE_CHOSEN_VALUE;
  protected readonly RANDOM_VALUE: string = RANDOM_VALUE;
  protected readonly SCORE_VALUE: string = SCORE_VALUE;
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
    protected fb: FormBuilder,
    protected projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
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

  protected criteriaRequiresAdditionalParams(criteria: string): boolean {
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

  protected setPathCount(pathCount: number): void {
    this.formGroup.get('pathCount').setValue(pathCount);
  }

  protected setCriteria(criteria: string): void {
    this.formGroup.get('criteria').setValue(criteria);
  }

  private getCriteria(): string {
    return this.formGroup.get('criteria').value;
  }

  protected setNodeId(nodeId: string): void {
    this.formGroup.get('nodeId').setValue(nodeId);
  }

  private getNodeId(): string {
    return this.formGroup.get('nodeId')?.value;
  }

  protected setComponentId(componentId: string): void {
    this.formGroup.get('componentId').setValue(componentId);
  }

  private getComponentId(): string {
    return this.formGroup.get('componentId')?.value;
  }

  protected setMergeStep(nodeId: string): void {
    this.formGroup.get('mergeStep').setValue(nodeId);
  }

  protected getBranchParams(): AuthorBranchParams {
    const params: AuthorBranchParams = {
      branchStepId: this.targetId,
      componentId: this.getComponentId(),
      criteria: this.getCriteria(),
      mergeStepId: this.formGroup.get('mergeStep').value,
      nodeId: this.getNodeId(),
      pathCount: this.formGroup.get('pathCount').value
    };
    if (this.criteriaRequiresAdditionalParams(params.criteria)) {
      params.paths = [];
      this.pathFormGroup.get('paths').value.forEach((value: string) => {
        params.paths.push(value);
      });
    }
    return params;
  }
}
