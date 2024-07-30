import { ChangeDetectorRef, Component } from '@angular/core';
import { SelectBranchCriteriaComponent } from '../select-branch-criteria/select-branch-criteria.component';
import { copy } from '../../common/object/object';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SelectComponentComponent } from '../../../../app/authoring-tool/select-component/select-component.component';
import { SelectStepComponent } from '../../../../app/authoring-tool/select-step/select-step.component';
import { AbstractBranchAuthoringComponent } from '../abstract-branch-authoring/abstract-branch-authoring.component';
import { BranchPathAuthoringComponent } from '../branch-path-authoring/branch-path-authoring.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { DeleteBranchService } from '../../services/deleteBranchService';

@Component({
  imports: [
    BranchPathAuthoringComponent,
    FlexLayoutModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    SelectBranchCriteriaComponent,
    SelectComponentComponent,
    SelectStepComponent
  ],
  selector: 'edit-branch',
  standalone: true,
  styleUrl: './edit-branch.component.scss',
  templateUrl: './edit-branch.component.html'
})
export class EditBranchComponent extends AbstractBranchAuthoringComponent {
  private branchPaths: any[] = [];
  private items: any;
  protected mergeStepTitle: string;
  private node: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private deleteBranchService: DeleteBranchService,
    protected fb: FormBuilder,
    protected projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(fb, projectService, route, router);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const branch = this.projectService.getBranchesByBranchStartPointNodeId(this.targetId)[0];
    this.setPathCount(branch.paths.length);
    this.setMergeStep(branch.endPoint);
    this.mergeStepTitle = this.projectService.getNodePositionAndTitle(branch.endPoint);
    this.node = this.projectService.getNodeById(this.targetId);
    this.items = this.getItems();
  }

  ngAfterViewInit(): void {
    this.populateBranchAuthoring();
  }

  private populateBranchAuthoring(): void {
    this.branchPaths = this.getBranchPaths();
    const criteria = this.getBranchCriteria();
    this.setCriteria(criteria);
    const branchParamNodeId = this.getBranchParamByField('nodeId');
    if (branchParamNodeId != null) {
      this.setNodeId(branchParamNodeId);
    }
    const branchParamComponentId = this.getBranchParamByField('componentId');
    if (branchParamComponentId != null) {
      this.setComponentId(branchParamComponentId);
    }
    this.updateParamFormControls(criteria);
    this.changeDetector.detectChanges();
  }

  private getBranchPaths(): any[] {
    const branchPaths = [];
    for (const transition of this.node.transitionLogic.transitions) {
      const branchPath: any = {
        nodesInBranchPath: [],
        transition: transition
      };
      branchPaths.push(branchPath);
      this.populateBranchParams(branchPath, transition);
    }
    return branchPaths;
  }

  private populateBranchParams(branch: any, transition: any): void {
    if (transition.criteria != null) {
      for (const criterion of transition.criteria) {
        if (criterion.name === this.SCORE_VALUE) {
          branch.scores = criterion.params.scores;
        } else if (criterion.name === this.CHOICE_CHOSEN_VALUE) {
          this.populateChoiceBranchParam(branch, criterion);
        }
      }
    }
    for (const nodeId of this.projectService.getNodeIdsInBranch(this.targetId, transition.to)) {
      branch.nodesInBranchPath.push(this.items[nodeId]);
    }
  }

  private populateChoiceBranchParam(branch: any, criterion: any): void {
    const params = criterion.params;
    if (params.choiceIds.length > 0) {
      branch.choiceId = params.choiceIds[0];
    }
    if (params.nodeId && params.componentId) {
      const choices = this.projectService.getChoices(params.nodeId, params.componentId);
      branch.choices = copy(choices);
    }
  }

  private getBranchCriteria(): string {
    const criteria = this.getCriteriaFromTransitions();
    return criteria == null ? this.node.transitionLogic.howToChooseAmongAvailablePaths : criteria;
  }

  private getCriteriaFromTransitions(): string {
    for (const transition of this.node.transitionLogic.transitions) {
      const criteria = transition.criteria;
      if (criteria != null) {
        for (const criterion of transition.criteria) {
          if (criterion.name === this.SCORE_VALUE) {
            return this.SCORE_VALUE;
          } else if (criterion.name === this.CHOICE_CHOSEN_VALUE) {
            return this.CHOICE_CHOSEN_VALUE;
          }
        }
      }
    }
    return null;
  }

  private getBranchParamByField(fieldName: string): string {
    for (const transition of this.node.transitionLogic.transitions) {
      const criteria = transition.criteria;
      if (criteria != null) {
        for (const criterion of transition.criteria) {
          if (criterion.params != null) {
            return criterion.params[fieldName];
          }
        }
      }
    }
    return null;
  }

  private updateParamFormControls(criteria: string): void {
    if (criteria === this.SCORE_VALUE) {
      this.updateScoreFormControls();
    } else if (criteria === this.CHOICE_CHOSEN_VALUE) {
      this.updateChoiceFormControls();
    }
  }

  private updateScoreFormControls(): void {
    // use set timeout to give the form time to populate the path form group controls
    setTimeout(() => {
      const scores = this.branchPaths.map((branchPath) => branchPath.scores);
      if (scores.length > 0) {
        for (let i = 0; i < scores.length; i++) {
          this.pathFormGroup.controls[`path-${i + 1}`].setValue(scores[i].join(', '));
        }
      }
    });
  }

  private updateChoiceFormControls(): void {
    // use set timeout to give the form time to populate the path form group controls
    setTimeout(() => {
      const choices = this.branchPaths.map((branchPath) => branchPath.choiceId);
      if (choices.length > 0) {
        for (let i = 0; i < choices.length; i++) {
          this.pathFormGroup.controls[`path-${i + 1}`].setValue(choices[i]);
        }
      }
    });
  }

  protected removeBranch(): void {
    if (
      confirm(
        $localize`Are you sure you want to remove this branch?\n\nThe branch structure will be removed but the steps will not be deleted.`
      )
    ) {
      this.deleteBranchService.deleteBranch(this.branchPaths, this.targetId);
      this.saveProject();
    }
  }

  private getItems(): any {
    const items = copy(this.projectService.idToOrder);
    for (const nodeId of Object.keys(items)) {
      items[nodeId].nodeId = nodeId;
    }
    return items;
  }

  protected saveProject(): void {
    this.projectService.parseProject();
    this.projectService.saveProject().then(() => {
      this.router.navigate(['..'], { relativeTo: this.route });
    });
  }

  protected async submit(): Promise<void> {
    alert(JSON.stringify(this.getBranchParams(), null, 2));
    // TODO: update branch
    // this.router.navigate(['..'], { relativeTo: this.route });
  }
}
