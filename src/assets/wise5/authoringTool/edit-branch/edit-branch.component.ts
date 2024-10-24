import { ChangeDetectorRef, Component } from '@angular/core';
import { SelectBranchCriteriaComponent } from '../select-branch-criteria/select-branch-criteria.component';
import { copy } from '../../common/object/object';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SelectComponentComponent } from '../../../../app/authoring-tool/select-component/select-component.component';
import { SelectStepComponent } from '../../../../app/authoring-tool/select-step/select-step.component';
import { AbstractBranchAuthoringComponent } from '../abstract-branch-authoring/abstract-branch-authoring.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { DeleteBranchService } from '../../services/deleteBranchService';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { EditBranchService } from '../../services/editBranchService';
import { EditBranchPathsComponent } from '../edit-branch-paths/edit-branch-paths.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  imports: [
    CommonModule,
    EditBranchPathsComponent,
    FlexLayoutModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    RouterModule,
    SelectBranchCriteriaComponent,
    SelectComponentComponent,
    SelectStepComponent
  ],
  standalone: true,
  styleUrl: './edit-branch.component.scss',
  templateUrl: './edit-branch.component.html'
})
export class EditBranchComponent extends AbstractBranchAuthoringComponent {
  protected branchPaths: any[] = [];
  private items: any;
  protected mergeStepTitle: string;
  private node: any;
  protected submitting: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private deleteBranchService: DeleteBranchService,
    private editBranchService: EditBranchService,
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

  protected removeBranch(): void {
    if (
      confirm(
        $localize`Are you sure you want to remove this branching structure?\n\nThe branches will be removed but the steps will remain in the unit.`
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

  protected submit(): void {
    this.submitting = true;
    this.editBranchService
      .editBranch(this.node, this.branchPaths, this.getBranchParams())
      .then(() => {
        this.router.navigate(['..'], { relativeTo: this.route });
      });
  }
}
