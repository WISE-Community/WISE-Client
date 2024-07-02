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
  protected mergeStepTitle: string;
  private node: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
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
    const mergeStepId = branch.endPoint;
    this.setMergeStep(mergeStepId);
    this.mergeStepTitle = this.projectService.getNodePositionAndTitle(mergeStepId);
    this.node = this.projectService.getNodeById(this.targetId);
  }

  ngAfterViewInit(): void {
    this.populateBranchAuthoring();
  }

  private populateBranchAuthoring(): void {
    this.branchPaths = [];
    let createBranchCriterion: string;
    let createBranchNodeId: string;
    let createBranchComponentId: string;
    const scores: any[] = [];
    const choices: string[] = [];
    for (let t = 0; t < this.node.transitionLogic.transitions.length; t++) {
      const transition = this.node.transitionLogic.transitions[t];
      const branch: any = {
        number: t + 1,
        items: this.getBranchItems(),
        checkedItemsInBranchPath: [],
        transition: transition
      };
      this.branchPaths.push(branch);
      const criteria = transition.criteria;
      if (criteria != null) {
        for (let criterion of transition.criteria) {
          let name = criterion.name;
          let params = criterion.params;
          if (params != null) {
            createBranchNodeId = params.nodeId;
            createBranchComponentId = params.componentId;
          }
          if (name === 'score') {
            createBranchCriterion = 'score';
            if (params != null && params.scores != null) {
              branch.scores = params.scores;
              scores.push(params.scores);
            }
          } else if (name === 'choiceChosen') {
            createBranchCriterion = 'choiceChosen';
            if (params != null && params.choiceIds != null && params.choiceIds.length > 0) {
              branch.choiceId = params.choiceIds[0];
              choices.push(params.choiceIds[0]);
            }

            if (createBranchNodeId && createBranchComponentId) {
              const choices = this.projectService.getChoices(
                createBranchNodeId,
                createBranchComponentId
              );
              if (choices != null) {
                branch.choices = copy(choices);
              }
            }
          }
        }
      }

      const nodeIdsInBranch = this.projectService.getNodeIdsInBranch(this.targetId, transition.to);
      for (const nodeId of nodeIdsInBranch) {
        const item = branch.items[nodeId];
        if (item != null) {
          item.checked = true;
          branch.checkedItemsInBranchPath.push(item);
        }
      }
    }

    if (createBranchCriterion == null) {
      if (this.node.transitionLogic.howToChooseAmongAvailablePaths === 'workgroupId') {
        createBranchCriterion = 'workgroupId';
      } else if (this.node.transitionLogic.howToChooseAmongAvailablePaths === 'random') {
        createBranchCriterion = 'random';
      } else if (this.node.transitionLogic.howToChooseAmongAvailablePaths === 'tag') {
        createBranchCriterion = 'tag';
      }
    }
    this.setCriteria(createBranchCriterion);
    if (createBranchNodeId != null) {
      this.setNodeId(createBranchNodeId);
    }
    if (createBranchComponentId) {
      this.setComponentId(createBranchComponentId);
    }

    // use set timeout to give the form to populate the path form group controls
    setTimeout(() => {
      if (scores.length > 0) {
        for (let i = 0; i < scores.length; i++) {
          this.pathFormGroup.controls[`path-${i + 1}`].setValue(scores[i].join(', '));
        }
      }
      if (choices.length > 0) {
        for (let i = 0; i < choices.length; i++) {
          this.pathFormGroup.controls[`path-${i + 1}`].setValue(choices[i]);
        }
      }
    });
    this.changeDetector.detectChanges();
  }

  removeBranchButtonClicked(): void {
    if (
      confirm(
        $localize`Are you sure you want to remove the branch?\n\nThe branch structure will be removed but the steps will not be deleted.`
      )
    ) {
      this.removeBranch();
    }
  }

  removeBranch(): void {
    for (let bp = 0; bp < this.branchPaths.length; bp++) {
      const branchPath = this.branchPaths[bp];
      this.removeBranchPath(branchPath);
      bp--; // shift the counter back one because we have just removed a branch path
    }

    const nodeId = this.targetId; // branch point node
    const nodeIdAfter = this.projectService.getNodeIdAfter(nodeId);

    /*
     * update the transition of this step to point to the next step
     * in the project. this may be different than the next step
     * if it was still the branch point.
     */
    this.projectService.setTransition(nodeId, nodeIdAfter);

    this.projectService.setTransitionLogicField(nodeId, 'howToChooseAmongAvailablePaths', null);
    this.projectService.setTransitionLogicField(nodeId, 'whenToChoosePath', null);
    this.projectService.setTransitionLogicField(nodeId, 'canChangePath', null);
    this.projectService.setTransitionLogicField(nodeId, 'maxPathsVisitable', null);

    /*
     * branch paths are determined by the transitions. since there is now
     * just one transition, we will create a single branch object to
     * represent it.
     */

    // create a branch object to hold all the related information for that branch
    const branch: any = {
      number: 1
    };

    /*
     * set the mapping of all the ids to order for use when choosing which items are
     * in the branch path
     */
    branch.items = this.getBranchItems();
    branch.checkedItemsInBranchPath = [];
    let transition = null;
    const transitions = this.projectService.getTransitionsByFromNodeId(nodeId);
    if (transitions != null && transitions.length > 0) {
      transition = transitions[0];
    }
    branch.transition = transition;
    this.branchPaths.push(branch);
    this.projectService.calculateNodeNumbers();
    this.saveProject();
  }

  /**
   * Remove a branch path by removing all the branch path taken constraints
   * from the steps in the branch path, resetting the transitions in the
   * steps in the branch path, and removing the transition corresponding to
   * the branch path in this branch point node.
   * @param branch the branch object
   */
  protected removeBranchPath(branch: any) {
    const checkedItemsInBranchPath = branch.checkedItemsInBranchPath;
    if (checkedItemsInBranchPath != null) {
      for (const checkedItem of checkedItemsInBranchPath) {
        const nodeId = checkedItem.$key;
        this.projectService.removeBranchPathTakenNodeConstraintsIfAny(nodeId);
        /*
         * update the transition of the step to point to the next step
         * in the project. this may be different than the next step
         * if it was still in the branch path.
         */
        const nodeIdAfter = this.projectService.getNodeIdAfter(nodeId);
        this.projectService.setTransition(nodeId, nodeIdAfter);
      }
    }
    const branchPathIndex = this.branchPaths.indexOf(branch);
    this.branchPaths.splice(branchPathIndex, 1);
    this.node.transitionLogic.transitions.splice(branchPathIndex, 1);
  }

  protected getBranchItems(): any {
    const items = copy(this.projectService.idToOrder);
    for (const nodeId of Object.keys(items)) {
      items[nodeId]['$key'] = nodeId;
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
