import { Component, OnInit } from '@angular/core';
import { copy } from '../../../../common/object/object';
import { ConfigService } from '../../../../services/configService';
import { TagService } from '../../../../services/tagService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'node-advanced-branch-authoring',
  templateUrl: 'node-advanced-branch-authoring.component.html',
  styleUrls: ['node-advanced-branch-authoring.component.scss']
})
export class NodeAdvancedBranchAuthoringComponent implements OnInit {
  protected branchCriteria: any = [
    {
      value: 'workgroupId',
      text: $localize`Workgroup ID`
    },
    {
      value: 'score',
      text: $localize`Score`
    },
    {
      value: 'choiceChosen',
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
  protected createBranchBranches = [];
  protected createBranchComponentId: string;
  protected createBranchMergePointNodeId: string;
  protected createBranchNodeId: string;
  protected createBranchNumberOfBranches: any;
  protected createBranchCriterion: any;
  protected items: any[];
  protected node: any;
  protected nodeId: string;
  protected nodeIds: string[];
  protected scoreId: string;

  constructor(
    private configService: ConfigService,
    private tagService: TagService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.parent.parent.params.subscribe((params) => {
      this.nodeId = params.nodeId;
      this.node = this.projectService.getNodeById(this.nodeId);
      this.nodeIds = this.projectService.getFlattenedProjectAsNodeIds(true);
      this.populateBranchAuthoring();
      this.populateScoreId();
    });
  }

  protected populateBranchAuthoring() {
    if (this.node.transitionLogic != null) {
      this.createBranchBranches = [];
      if (this.node.transitionLogic.transitions != null) {
        this.createBranchNumberOfBranches = this.node.transitionLogic.transitions.length;
      } else {
        this.createBranchNumberOfBranches = 0;
      }
      for (let t = 0; t < this.node.transitionLogic.transitions.length; t++) {
        const transition = this.node.transitionLogic.transitions[t];
        const branch: any = {
          number: t + 1,
          items: this.getBranchItems(),
          checkedItemsInBranchPath: [],
          transition: transition
        };
        this.createBranchBranches.push(branch);
        const criteria = transition.criteria;
        if (criteria != null) {
          for (let criterion of transition.criteria) {
            let name = criterion.name;
            let params = criterion.params;
            if (params != null) {
              this.createBranchNodeId = params.nodeId;
              this.createBranchComponentId = params.componentId;
            }
            if (name === 'score') {
              this.createBranchCriterion = 'score';
              if (params != null && params.scores != null) {
                branch.scores = params.scores;
              }
            } else if (name === 'choiceChosen') {
              this.createBranchCriterion = 'choiceChosen';
              if (params != null && params.choiceIds != null && params.choiceIds.length > 0) {
                branch.choiceId = params.choiceIds[0];
              }

              if (this.createBranchNodeId && this.createBranchComponentId) {
                const choices = this.projectService.getChoices(
                  this.createBranchNodeId,
                  this.createBranchComponentId
                );
                if (choices != null) {
                  branch.choices = copy(choices);
                }
              }
            }
          }
        }

        const nodeIdsInBranch = this.projectService.getNodeIdsInBranch(this.nodeId, transition.to);
        for (const nodeId of nodeIdsInBranch) {
          const item = branch.items[nodeId];
          if (item != null) {
            item.checked = true;
            branch.checkedItemsInBranchPath.push(item);
          }
        }

        branch.nodeIdsInBranch = nodeIdsInBranch;
        if (nodeIdsInBranch.length > 0) {
          const lastNodeIdInBranch = nodeIdsInBranch[nodeIdsInBranch.length - 1];
          const transitionsFromLastNode = this.projectService.getTransitionsByFromNodeId(
            lastNodeIdInBranch
          );
          if (transitionsFromLastNode != null && transitionsFromLastNode.length > 0) {
            const transition = transitionsFromLastNode[0];
            this.createBranchMergePointNodeId = transition.to;
          }
        }
      }

      if (this.createBranchCriterion == null) {
        if (this.node.transitionLogic.howToChooseAmongAvailablePaths === 'workgroupId') {
          this.createBranchCriterion = 'workgroupId';
        } else if (this.node.transitionLogic.howToChooseAmongAvailablePaths === 'random') {
          this.createBranchCriterion = 'random';
        } else if (this.node.transitionLogic.howToChooseAmongAvailablePaths === 'tag') {
          this.createBranchCriterion = 'tag';
        }
      }
    }
  }

  protected populateScoreId(): void {
    for (const transition of this.node.transitionLogic.transitions) {
      if (transition.criteria != null) {
        const scoreId = this.getScoreId(transition.criteria[0]);
        if (scoreId != null) {
          this.scoreId = scoreId;
        }
      }
    }
  }

  protected getScoreId(transitionCriteria: any): string {
    if (transitionCriteria != null) {
      return transitionCriteria?.params?.scoreId;
    } else {
      return null;
    }
  }

  protected createBranchNumberOfBranchesChanged() {
    if (this.createBranchNumberOfBranches === 0) {
      alert($localize`Error: You can't have 0 branch paths`);
      this.createBranchNumberOfBranches = this.createBranchBranches.length;
    } else if (this.createBranchNumberOfBranches < this.createBranchBranches.length) {
      const answer = confirm(
        $localize`Are you sure you want to reduce the number of branches to ${this.createBranchNumberOfBranches}?`
      );
      if (answer) {
        if (this.createBranchNumberOfBranches === 1) {
          // the author has removed all the branch paths so we will remove the branch
          this.removeBranch();
        } else {
          // the author is reducing the number of branch paths but not removing all of them
          for (let bp = 0; bp < this.createBranchBranches.length; bp++) {
            if (bp >= this.createBranchNumberOfBranches) {
              const branch = this.createBranchBranches[bp];
              this.removeBranchPath(branch);
              // decrement the counter back one because we have just removed a branch path
              bp--;
            }
          }
        }
      } else {
        this.createBranchNumberOfBranches = this.createBranchBranches.length;
      }
    } else if (this.createBranchNumberOfBranches > this.createBranchBranches.length) {
      if (this.createBranchCriterion == null) {
        /*
         * we will default the branching to be based on workgroup id
         * since that is what our researchers use most often
         */
        this.createBranchCriterion = 'workgroupId';
        this.createBranchCriterionChanged();
      }

      for (let b = 0; b < this.createBranchNumberOfBranches; b++) {
        if (b >= this.createBranchBranches.length) {
          // we do not have a branch object for this branch number so we will create it
          const branch: any = {
            number: b + 1
          };

          /*
           * set the mapping of all the ids to order for use when choosing which items are
           * in the branch path
           */
          branch.items = this.getBranchItems();
          this.createBranchBranches.push(branch);
          const transition: any = {};
          if (this.createBranchCriterion === 'score') {
            const criterion: any = {
              name: this.createBranchCriterion,
              params: {
                scores: []
              }
            };
            if (this.createBranchNodeId != null) {
              criterion.params.nodeId = this.createBranchNodeId;
            }
            if (this.createBranchComponentId != null) {
              criterion.params.componentId = this.createBranchComponentId;
            }
            transition.criteria = [criterion];
          } else if (this.createBranchCriterion === 'choiceChosen') {
            const criterion: any = {
              name: this.createBranchCriterion,
              params: {
                choiceIds: []
              }
            };

            if (this.createBranchNodeId != null) {
              criterion.params.nodeId = this.createBranchNodeId;
            }

            if (this.createBranchComponentId != null) {
              criterion.params.componentId = this.createBranchComponentId;
            }
            transition.criteria = [criterion];
          } else if (this.createBranchCriterion === 'workgroupId') {
            // workgroup id branching does not require a transition criterion
          } else if (this.createBranchCriterion === 'random') {
            // random branching does not require a transition criterion
          }
          this.node.transitionLogic.transitions.push(transition);
          branch.transition = transition;
        }
      }
    }
    this.saveProject();
  }

  protected createBranchCriterionChanged() {
    if (this.createBranchCriterion != null) {
      let nodeId = this.node.id;
      if (this.createBranchCriterion === 'workgroupId') {
        this.projectService.setTransitionLogicField(
          nodeId,
          'howToChooseAmongAvailablePaths',
          'workgroupId'
        );
        this.projectService.setTransitionLogicField(nodeId, 'whenToChoosePath', 'enterNode');
        this.projectService.setTransitionLogicField(nodeId, 'canChangePath', false);
        this.projectService.setTransitionLogicField(nodeId, 'maxPathsVisitable', 1);
      } else if (this.createBranchCriterion === 'score') {
        this.projectService.setTransitionLogicField(
          nodeId,
          'howToChooseAmongAvailablePaths',
          'random'
        );
        this.projectService.setTransitionLogicField(
          nodeId,
          'whenToChoosePath',
          'studentDataChanged'
        );
        this.projectService.setTransitionLogicField(nodeId, 'canChangePath', false);
        this.projectService.setTransitionLogicField(nodeId, 'maxPathsVisitable', 1);
      } else if (this.createBranchCriterion === 'choiceChosen') {
        this.projectService.setTransitionLogicField(
          nodeId,
          'howToChooseAmongAvailablePaths',
          'random'
        );
        this.projectService.setTransitionLogicField(
          nodeId,
          'whenToChoosePath',
          'studentDataChanged'
        );
        this.projectService.setTransitionLogicField(nodeId, 'canChangePath', false);
        this.projectService.setTransitionLogicField(nodeId, 'maxPathsVisitable', 1);
      } else if (this.createBranchCriterion === 'random') {
        this.projectService.setTransitionLogicField(
          nodeId,
          'howToChooseAmongAvailablePaths',
          'random'
        );
        this.projectService.setTransitionLogicField(nodeId, 'whenToChoosePath', 'enterNode');
        this.projectService.setTransitionLogicField(nodeId, 'canChangePath', false);
        this.projectService.setTransitionLogicField(nodeId, 'maxPathsVisitable', 1);
      } else if (this.createBranchCriterion === 'tag') {
        this.projectService.setTransitionLogicField(
          nodeId,
          'howToChooseAmongAvailablePaths',
          'tag'
        );
        this.projectService.setTransitionLogicField(nodeId, 'whenToChoosePath', 'enterNode');
        this.projectService.setTransitionLogicField(nodeId, 'canChangePath', false);
        this.projectService.setTransitionLogicField(nodeId, 'maxPathsVisitable', 1);
      }
    }
    this.createBranchUpdateTransitions();
    this.saveProject();
  }

  protected createBranchNodeIdChanged() {
    this.createBranchComponentId = null;
    let selectedNode = this.projectService.getNodeById(this.createBranchNodeId);
    if (selectedNode != null) {
      let components = selectedNode.components;
      if (components != null) {
        if (components.length == 1) {
          this.createBranchComponentId = components[0].id;
        }
      }
    }
    this.createBranchUpdateTransitions();
    this.saveProject();
  }

  protected createBranchComponentIdChanged() {
    this.createBranchUpdateTransitions();
    this.saveProject();
  }

  protected async createBranchUpdateTransitions() {
    for (let b = 0; b < this.createBranchBranches.length; b++) {
      let branch = this.createBranchBranches[b];
      if (branch != null) {
        let transition = branch.transition;
        if (transition != null) {
          if (this.createBranchCriterion === 'choiceChosen') {
            transition.criteria = [];
            const criterion = {
              name: 'choiceChosen',
              params: {
                nodeId: this.createBranchNodeId,
                componentId: this.createBranchComponentId,
                choiceIds: []
              }
            };
            transition.criteria.push(criterion);
            branch.choiceId = null;
            branch.scores = null;
          } else if (this.createBranchCriterion === 'score') {
            transition.criteria = [];
            const criterion: any = {
              name: 'score',
              params: {
                nodeId: this.createBranchNodeId,
                componentId: this.createBranchComponentId,
                scores: []
              }
            };
            if (this.scoreId != null && this.scoreId !== '') {
              criterion.params.scoreId = this.scoreId;
            }
            transition.criteria.push(criterion);
            branch.choiceId = null;
            branch.scores = criterion.params.scores;
          } else if (this.createBranchCriterion === 'workgroupId') {
            /*
             * remove the criteria array since it is not used for
             * branching based on workgroup id
             */
            delete transition['criteria'];
            this.createBranchNodeId = null;
            this.createBranchComponentId = null;

            /*
             * clear the choice id and scores fields since we don't
             * need them in workgroup id branching
             */
            branch.choiceId = null;
            branch.scores = null;
          } else if (this.createBranchCriterion == 'random') {
            /*
             * remove the criteria array since it is not used for
             * branching based on random assignment
             */
            delete transition['criteria'];
            this.createBranchNodeId = null;
            this.createBranchComponentId = null;

            // clear the choice id and scores fields since we don't need them in random branching
            branch.choiceId = null;
            branch.scores = null;
          } else if (this.createBranchCriterion === 'tag') {
            const runId = this.configService.getRunId();
            if (runId != null) {
              await this.tagService.retrieveRunTags().subscribe(() => {});
            }
            transition.criteria = [];
            const criterion = {
              name: 'hasTag',
              params: {
                tag: this.tagService.getNextAvailableTag()
              }
            };
            transition.criteria.push(criterion);
          }
        }
      }
    }

    if (this.createBranchCriterion === 'choiceChosen') {
      this.createBranchUpdateChoiceChosenIds();
    }
  }

  protected createBranchUpdateChoiceChosenIds() {
    const component = this.projectService.getComponent(
      this.createBranchNodeId,
      this.createBranchComponentId
    );
    if (component != null) {
      if (component.type === 'MultipleChoice') {
        this.createBranchUpdateChoiceChosenIdsHelper(component);
      }
    }
  }

  /**
   * We are creating a branch that is based on which choice the student chooses
   * in a multiple choice component. We will populate the drop down with the
   * choices.
   * @param component we are branching based on the choice chosen in this
   * component
   */
  createBranchUpdateChoiceChosenIdsHelper(component) {
    const choices = component.choices;
    if (choices != null) {
      for (let c = 0; c < choices.length; c++) {
        const branch = this.createBranchBranches[c];
        if (branch != null) {
          const id = choices[c].id;
          branch.choiceId = id;
          branch.choices = copy(choices);
          const transition = branch.transition;
          if (transition != null) {
            // get the first transition criterion. Assume there is only one transition criterion
            const criterion = transition.criteria[0];
            if (criterion != null) {
              const params = criterion.params;
              if (params != null) {
                params.nodeId = this.createBranchNodeId;
                params.componentId = this.createBranchComponentId;
                if (this.createBranchCriterion === 'choiceChosen') {
                  params.choiceIds = [];
                  params.choiceIds.push(id);
                }
              }
            }
          }
        }
      }
    }
  }

  protected createBranchStepClicked(branch, item) {
    const items = branch.items;
    branch.checkedItemsInBranchPath = [];
    const checkedItemsInBranchPath = branch.checkedItemsInBranchPath;
    branch.nodeIdsInBranch = [];
    let previousCheckedNodeId = null;
    let nodeIdAfter = null;

    /*
     * loop through all the items in order and set the transitions so that
     * the steps in a branch path transition to one after the other
     */

    for (let i = 0; i < this.nodeIds.length; i++) {
      const nodeId = this.nodeIds[i];
      const orderedItem = items[nodeId];
      if (orderedItem != null && orderedItem.checked) {
        if (previousCheckedNodeId != null) {
          const previousCheckedNode = this.projectService.getNodeById(previousCheckedNodeId);
          if (previousCheckedNode != null) {
            const transitionLogic = previousCheckedNode.transitionLogic;
            if (transitionLogic != null) {
              if (transitionLogic.transitions != null) {
                transitionLogic.transitions = [];
                const transition = {
                  to: orderedItem.$key
                };
                transitionLogic.transitions.push(transition);
              }
            }
          }
        }
        checkedItemsInBranchPath.push(orderedItem);
        branch.nodeIdsInBranch.push(orderedItem.$key);
        previousCheckedNodeId = orderedItem.$key;
      }
      let previousOrderedItem = items[this.nodeIds[i - 1]];
      if (previousOrderedItem != null) {
        if (previousOrderedItem.$key == item.$key) {
          /*
           * the previous item was the node that was checked/unchecked
           * so we will remember this item because it is the node
           * that comes after the node that was checked/unchecked
           */
          nodeIdAfter = orderedItem.$key;
        }
      }
    }

    if (this.createBranchMergePointNodeId != null) {
      /*
       * the merge point is specified so we will make the last checked
       * node in this branch path point to the merge point
       */

      // this is the last node in the branch path so we will make it transition to the merge point
      let node = this.projectService.getNodeById(previousCheckedNodeId);
      if (node != null) {
        let transitionLogic = node.transitionLogic;
        if (transitionLogic != null) {
          if (transitionLogic.transitions != null) {
            transitionLogic.transitions = [];
            const transition = {
              to: this.createBranchMergePointNodeId
            };
            transitionLogic.transitions.push(transition);
          }
        }
      }
    }

    let branchNumber = branch.number;
    let nodeId = item.$key;
    let transition = this.node.transitionLogic.transitions[branchNumber - 1];
    let firstNodeId = null;

    // update the branch point transition in case the first step in the branch path has changed
    if (transition != null) {
      if (checkedItemsInBranchPath.length === 0) {
        transition.to = null;
      } else {
        let firstCheckedItem = checkedItemsInBranchPath[0];
        if (firstCheckedItem != null) {
          firstNodeId = firstCheckedItem.$key;
          transition.to = firstNodeId;
        }
      }
    }

    let node = this.projectService.getNodeById(nodeId);
    if (node != null) {
      this.projectService.removeBranchPathTakenNodeConstraintsIfAny(nodeId);
      if (item.checked) {
        let fromNodeId = this.nodeId;
        let toNodeId = firstNodeId;
        this.projectService.addBranchPathTakenConstraints(nodeId, fromNodeId, toNodeId);
      } else {
        this.projectService.setTransition(nodeId, nodeIdAfter);
      }
    }

    // update the constraints of other steps in the branch path if necessary.
    for (const item of checkedItemsInBranchPath) {
      const itemNodeId = item.$key;
      this.projectService.removeBranchPathTakenNodeConstraintsIfAny(itemNodeId);

      // the branch path taken constraints will be from this node to the first node in the branch path
      const fromNodeId = this.nodeId;
      const toNodeId = firstNodeId;
      this.projectService.addBranchPathTakenConstraints(itemNodeId, fromNodeId, toNodeId);
    }
    this.projectService.calculateNodeNumbers();
    this.saveProject();
  }

  protected createBranchScoreChanged(branch) {
    branch.scores = branch.scores.split(',');
    let transition = branch.transition;
    if (transition != null) {
      let scores = branch.scores;
      if (scores != null) {
        let criteria = transition.criteria;
        if (criteria != null) {
          let criterion = criteria[0];
          if (criterion != null) {
            let params = criterion.params;
            if (params != null) {
              params.scores = scores;
            }
          }
        }
      }
    }
    this.saveProject();
  }

  createBranchMergePointNodeIdChanged() {
    let createBranchMergePointNodeId = this.createBranchMergePointNodeId;
    let branches = this.createBranchBranches;
    for (let branch of branches) {
      if (branch != null) {
        let nodeIdsInBranch = branch.nodeIdsInBranch;
        if (nodeIdsInBranch != null && nodeIdsInBranch.length > 0) {
          let lastNodeIdInBranchPath = nodeIdsInBranch[nodeIdsInBranch.length - 1];
          if (lastNodeIdInBranchPath != null) {
            let lastNodeInBranchPath = this.projectService.getNodeById(lastNodeIdInBranchPath);
            if (lastNodeInBranchPath != null) {
              let transitionLogic = lastNodeInBranchPath.transitionLogic;
              if (transitionLogic != null) {
                if (transitionLogic.transitions != null) {
                  transitionLogic.transitions = [];
                  let transition = {
                    to: createBranchMergePointNodeId
                  };
                  transitionLogic.transitions.push(transition);
                }
              }
            }
          }
        }
      }
    }
    this.projectService.calculateNodeNumbers();
    const parseProject = true;
    this.saveProject(parseProject);
  }

  removeBranchButtonClicked() {
    if (confirm($localize`Are you sure you want to remove the branch?`)) {
      this.removeBranch();
    }
  }

  removeBranch() {
    for (let bp = 0; bp < this.createBranchBranches.length; bp++) {
      const branchPath = this.createBranchBranches[bp];
      this.removeBranchPath(branchPath);
      bp--; // shift the counter back one because we have just removed a branch path
    }

    const nodeId = this.node.id; // branch point node
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

    this.createBranchNumberOfBranches = 1;
    this.createBranchCriterion = null;
    this.createBranchNodeId = null;
    this.createBranchComponentId = null;
    this.createBranchMergePointNodeId = null;

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
    this.createBranchBranches.push(branch);
    this.projectService.calculateNodeNumbers();
    const parseProject = true;
    this.saveProject(parseProject);
  }

  /**
   * Remove a branch path by removing all the branch path taken constraints
   * from the steps in the branch path, resetting the transitions in the
   * steps in the branch path, and removing the transition corresponding to
   * the branch path in this branch point node.
   * @param branch the branch object
   */
  protected removeBranchPath(branch) {
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
    const branchPathIndex = this.createBranchBranches.indexOf(branch);
    this.createBranchBranches.splice(branchPathIndex, 1);
    this.node.transitionLogic.transitions.splice(branchPathIndex, 1);
  }

  protected getBranchItems() {
    const items = copy(this.projectService.idToOrder);
    for (const nodeId of Object.keys(items)) {
      items[nodeId]['$key'] = nodeId;
    }
    return items;
  }

  protected saveProject(parseProject = false) {
    if (parseProject) {
      this.projectService.parseProject();
    }
    return this.projectService.saveProject();
  }

  protected isGroupNode(nodeId) {
    return this.projectService.isGroupNode(nodeId);
  }

  protected getComponents(nodeId: string): any[] {
    return this.projectService.getComponents(nodeId);
  }

  protected getNodeTitle(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  protected getNodePositionById(nodeId) {
    return this.projectService.getNodePositionById(nodeId);
  }

  protected scoreIdChanged(): void {
    for (const branch of this.createBranchBranches) {
      if (this.scoreId === '') {
        delete branch.transition.criteria[0].params.scoreId;
      } else {
        branch.transition.criteria[0].params.scoreId = this.scoreId;
      }
    }
    this.saveProject();
  }
}
