import { Component } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent {
  protected readonly CHOICE_CHOSEN: string = 'choiceChosen';
  protected readonly SCORE: string = 'score';

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
  protected componentIdToSelectable: any = {};
  protected components: any[];
  protected formGroup: FormGroup = this.fb.group({
    pathCount: new FormControl('', [Validators.required]),
    criteria: new FormControl('', [Validators.required])
  });
  protected nodeIds: string[];
  protected nodeIdToSelectable: any = {};
  private targetId: string;

  constructor(private fb: FormBuilder, private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.targetId = history.state.targetId;
    this.nodeIds = this.projectService.getFlattenedProjectAsNodeIds(true);
    this.formGroup.controls['criteria'].valueChanges.subscribe((criteria: string) => {
      if (this.criteriaRequiresAdditionalParams(criteria)) {
        this.updateAdditionalParams();
      } else {
        this.removeAdditionalParams();
      }
    });
  }

  private criteriaRequiresAdditionalParams(criteria: string): boolean {
    return criteria === this.SCORE || criteria === this.CHOICE_CHOSEN;
  }

  private updateAdditionalParams(): void {
    this.initializeNodeIdSelector();
    this.initializeComponentIdSelector();
    this.updateNodeIdSelector();
    this.updateComponentIdSelector();
  }

  private initializeNodeIdSelector(): void {
    if (this.formGroup.controls['nodeId'] == null) {
      this.formGroup.addControl('nodeId', new FormControl('', [Validators.required]));
      this.formGroup.controls['nodeId'].valueChanges.subscribe((nodeId: string) => {
        this.updateSelectableComponents(nodeId);
        this.autoSelectComponentIdIfPossible();
      });
      if (this.getNodeId() === '') {
        this.formGroup.controls['nodeId'].setValue(this.targetId);
      }
    }
  }

  private initializeComponentIdSelector(): void {
    if (this.formGroup.controls['componentId'] == null) {
      this.formGroup.addControl('componentId', new FormControl('', [Validators.required]));
    }
  }

  private updateNodeIdSelector(): void {
    this.nodeIdToSelectable = {};
    for (const nodeId of this.nodeIds) {
      this.nodeIdToSelectable[nodeId] = this.stepContainsSelectableComponent(nodeId);
    }
  }

  private updateComponentIdSelector(): void {
    this.updateSelectableComponents(this.getNodeId());
    const componentId = this.getComponentId();
    if (
      !this.components?.some((component) => component.id === componentId) ||
      !this.componentIdToSelectable[componentId]
    ) {
      this.formGroup.controls['componentId'].setValue('');
    }
    this.autoSelectComponentIdIfPossible();
  }

  private updateSelectableComponents(nodeId: string): void {
    this.components = this.getComponents(nodeId);
    this.componentIdToSelectable = {};
    for (const component of this.components) {
      this.componentIdToSelectable[component.id] = this.isComponentSelectable(component);
    }
  }

  private stepContainsSelectableComponent(nodeId: string): boolean {
    const components = this.getComponents(nodeId);
    return components.some((component) => this.isComponentSelectable(component));
  }

  private isComponentSelectable(component: any): boolean {
    const criteria = this.getCriteria();
    if (criteria === this.SCORE) {
      return this.projectService.componentHasWork(component);
    } else if (criteria === this.CHOICE_CHOSEN) {
      return component.type === 'MultipleChoice';
    }
    return true;
  }

  private autoSelectComponentIdIfPossible(): void {
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
      this.formGroup.controls['componentId'].setValue(
        this.components.find((component) => this.projectService.componentHasWork(component)).id
      );
    }
  }

  private tryAutoSelectChoiceChosenComponent(): void {
    const numMultipleChoice = this.components.filter(
      (component) => component.type === 'MultipleChoice'
    ).length;
    if (numMultipleChoice === 1) {
      this.formGroup.controls['componentId'].setValue(
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

  private getComponentId(): string {
    return this.formGroup.get('componentId')?.value;
  }

  protected getNodePositionById(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  protected getNodeTitle(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  protected getComponents(nodeId: string): any[] {
    return this.projectService.getComponents(nodeId);
  }

  protected submit(): void {
    const data: any = {};
    data.pathCount = this.getPathCount();
    data.criteria = this.getCriteria();
    data.nodeId = this.getNodeId();
    data.componentId = this.getComponentId();
    alert(JSON.stringify(data, null, 2));
  }
}
