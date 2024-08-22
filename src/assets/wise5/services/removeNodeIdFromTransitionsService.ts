import { Injectable } from '@angular/core';
import { TeacherProjectService } from './teacherProjectService';
import { copy } from '../common/object/object';

@Injectable()
export class RemoveNodeIdFromTransitionsService {
  constructor(private projectService: TeacherProjectService) {}

  /**
   * Update the transitions to handle removing a node
   * @param nodeId the node id to remove
   */
  remove(nodeId: string): void {
    const nodeToRemove = this.projectService.getNodeById(nodeId);
    const nodesByToNodeId = this.projectService.getNodesByToNodeId(nodeId);

    const nodeToRemoveTransitionLogic = nodeToRemove.transitionLogic;
    let nodeToRemoveTransitions = [];

    if (nodeToRemoveTransitionLogic != null && nodeToRemoveTransitionLogic.transitions != null) {
      nodeToRemoveTransitions = nodeToRemoveTransitionLogic.transitions;
    }

    const parentIdOfNodeToRemove = this.projectService.getParentGroupId(nodeId);
    this.updateParentGroupStartId(nodeId);

    for (let n = 0; n < nodesByToNodeId.length; n++) {
      const node = nodesByToNodeId[n];
      if (node != null) {
        const parentIdOfFromNode = this.projectService.getParentGroupId(node.id);
        const transitionLogic = node.transitionLogic;

        if (transitionLogic != null) {
          const transitions = transitionLogic.transitions;
          for (let t = 0; t < transitions.length; t++) {
            const transition = transitions[t];
            if (nodeId === transition.to) {
              // we have found the transition to the node we are removing

              // copy the transitions from the node we are removing
              let transitionsCopy = copy(nodeToRemoveTransitions);

              /*
               * if the parent from group is different than the parent removing group
               * remove transitions that are to a node in a different group than
               * the parent removing group
               */

              if (parentIdOfFromNode != parentIdOfNodeToRemove) {
                for (let tc = 0; tc < transitionsCopy.length; tc++) {
                  const tempTransition = transitionsCopy[tc];
                  if (tempTransition != null) {
                    const tempToNodeId = tempTransition.to;
                    if (tempToNodeId != null) {
                      const parentIdOfToNode = this.projectService.getParentGroupId(tempToNodeId);
                      if (parentIdOfNodeToRemove != parentIdOfToNode) {
                        // remove the transition
                        transitionsCopy.splice(tc, 1);
                        tc--;
                      }
                    }
                  }
                }
              }

              if (this.isFirstNodeInBranchPath(nodeId)) {
                /*
                 * Get the node ids that have a branchPathTaken
                 * constraint from the before node and to the node
                 * we are removing. If there are any, we need to
                 * update the branchPathTaken constraint with the
                 * next nodeId that comes after the node we are
                 * removing.
                 */
                const nodeIdsInBranch = this.projectService.getNodeIdsInBranch(node.id, nodeId);

                if (nodeIdsInBranch != null) {
                  for (let nodeIdInBranch of nodeIdsInBranch) {
                    const nodeInBranch = this.projectService.getNodeById(nodeIdInBranch);
                    for (let transitionCopy of transitionsCopy) {
                      if (transitionCopy != null) {
                        const currentFromNodeId = node.id;
                        const currentToNodeId = nodeId;
                        const newFromNodeId = node.id;
                        const newToNodeId = transitionCopy.to;

                        /*
                         * change the branch path taken constraint by changing
                         * the toNodeId
                         */
                        this.updateBranchPathTakenConstraint(
                          nodeInBranch,
                          currentFromNodeId,
                          currentToNodeId,
                          newFromNodeId,
                          newToNodeId
                        );
                      }
                    }
                  }
                }
              } else if (this.projectService.isBranchPoint(nodeId)) {
                /*
                 * get all the branches that have the node we
                 * are removing as the start point
                 */
                const branches = this.projectService.getBranchesByBranchStartPointNodeId(nodeId);

                for (let branch of branches) {
                  if (branch != null) {
                    /*
                     * get the branch paths. these paths do not
                     * contain the start point or merge point.
                     */
                    const branchPaths = branch.paths;

                    if (branchPaths != null) {
                      for (let branchPath of branchPaths) {
                        if (branchPath != null) {
                          const currentFromNodeId = nodeId;
                          const currentToNodeId = branchPath[0];
                          const newFromNodeId = node.id;
                          const newToNodeId = branchPath[0];
                          for (let branchPathNodeId of branchPath) {
                            const branchPathNode =
                              this.projectService.getNodeById(branchPathNodeId);
                            this.updateBranchPathTakenConstraint(
                              branchPathNode,
                              currentFromNodeId,
                              currentToNodeId,
                              newFromNodeId,
                              newToNodeId
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }

              // remove the transition to the node we are removing
              const transitionRemoved = transitions.splice(t, 1)[0];

              if (transitionsCopy != null) {
                let insertIndex = t;

                /*
                 * loop through all the transitions from the node we are removing
                 * and insert them into the transitions of the from node
                 * e.g.
                 * the node that comes before the node we are removing has these transitions
                 * "transitions": [
                 *     {
                 *         "to": "node4"
                 *     },
                 *     {
                 *         "to": "node6"
                 *     }
                 * ]
                 *
                 * we are removing node4. node4 has a transition to node5.
                 *
                 * the node that comes before the node we are removing now has these transitions
                 * "transitions": [
                 *     {
                 *         "to": "node5"
                 *     },
                 *     {
                 *         "to": "node6"
                 *     }
                 * ]
                 */
                for (let transitionCopy of transitionsCopy) {
                  if (!this.isTransitionExist(transitions, transitionCopy)) {
                    const toNodeId = transitionCopy.to;
                    if (
                      this.projectService.isApplicationNode(node.id) &&
                      this.projectService.isGroupNode(toNodeId) &&
                      this.hasGroupStartId(toNodeId)
                    ) {
                      this.projectService.addToTransition(
                        node,
                        this.projectService.getGroupStartId(toNodeId)
                      );
                    } else {
                      if (transitionRemoved.criteria != null) {
                        transitionCopy.criteria = transitionRemoved.criteria;
                      }
                      transitions.splice(insertIndex, 0, transitionCopy);
                      insertIndex++;
                    }
                  }
                }
              }
              t--;

              // check if the node we are moving is a group
              if (this.projectService.isGroupNode(nodeId)) {
                /*
                 * we are moving a group so we need to update transitions that
                 * go into the group
                 */
                const groupIdWeAreMoving = nodeId;
                const groupThatTransitionsToGroupWeAreMoving = node;
                this.updateChildrenTransitionsIntoGroupWeAreMoving(
                  groupThatTransitionsToGroupWeAreMoving,
                  groupIdWeAreMoving
                );
              }
            }
          }

          if (
            transitions.length === 0 &&
            parentIdOfNodeToRemove != 'group0' &&
            parentIdOfNodeToRemove != this.projectService.getParentGroupId(node.id)
          ) {
            /*
             * the from node no longer has any transitions so we will make it transition to the
             * parent of the node we are removing
             */
            this.projectService.addToTransition(node, parentIdOfNodeToRemove);
          }

          if (this.projectService.isBranchPoint(nodeId)) {
            /*
             * the node we are deleting is a branch point so we to
             * copy the transition logic to the node that comes
             * before it
             */
            node.transitionLogic = copy(nodeToRemoveTransitionLogic);

            /*
             * set the transitions for the node that comes before
             * the one we are removing
             */
            node.transitionLogic.transitions = transitions;
          }
        }
      }
    }

    if (nodeToRemoveTransitionLogic != null) {
      nodeToRemoveTransitionLogic.transitions = [];
    }

    if (this.projectService.isGroupNode(nodeId)) {
      this.removeTransitionsOutOfGroup(nodeId);
    }
  }

  /**
   * Update the parent group start id if the node we are removing is the start id
   * @param nodeId The node we are removing
   */
  private updateParentGroupStartId(nodeId: string): void {
    const parentGroup = this.projectService.getParentGroup(nodeId);
    if (parentGroup != null && parentGroup.startId === nodeId) {
      const transitions = this.projectService.getTransitionsFromNode(
        this.projectService.getNodeById(nodeId)
      );
      if (transitions.length > 0) {
        for (const transition of transitions) {
          const toNodeId = transition.to;
          // Make sure the to node id is in the same group because a step can transition to a step
          // in a different group. If the to node id is in a different group, we would not want to
          // use it as the start id of this group.
          if (this.projectService.getParentGroupId(toNodeId) === parentGroup.id) {
            parentGroup.startId = toNodeId;
          }
        }
      } else {
        parentGroup.startId = '';
      }
    }
  }

  /**
   * Check if a node is the first node in a branch path
   * @param nodeId the node id
   * @return whether the node is the first node in a branch path
   */
  private isFirstNodeInBranchPath(nodeId: string): boolean {
    for (const node of this.projectService.getNodes()) {
      if (node.transitionLogic?.transitions?.length > 1) {
        for (const transition of node.transitionLogic.transitions) {
          if (transition.to === nodeId) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Update a node's branchPathTaken constraint's fromNodeId and toNodeId
   * @param node update the branch path taken constraints in this node
   * @param currentFromNodeId the current from node id
   * @param currentToNodeId the current to node id
   * @param newFromNodeId the new from node id
   * @param newToNodeId the new to node id
   */
  private updateBranchPathTakenConstraint(
    node: any,
    currentFromNodeId: string,
    currentToNodeId: string,
    newFromNodeId: string,
    newToNodeId: string
  ): void {
    for (let constraint of node.constraints) {
      for (let removalCriterion of constraint.removalCriteria) {
        if (removalCriterion.name === 'branchPathTaken') {
          const params = removalCriterion.params;
          if (params.fromNodeId === currentFromNodeId && params.toNodeId === currentToNodeId) {
            params.fromNodeId = newFromNodeId;
            params.toNodeId = newToNodeId;
          }
        }
      }
    }
  }

  private isTransitionExist(transitions: any[], transition: any): boolean {
    for (const tempTransition of transitions) {
      if (tempTransition.from === transition.from && tempTransition.to === transition.to) {
        return true;
      }
    }
    return false;
  }

  private hasGroupStartId(nodeId: string): boolean {
    const startId = this.projectService.getGroupStartId(nodeId);
    return startId != null && startId != '';
  }

  /*
   * Update the step transitions that point into the group we are moving
   * For example
   * group1 has children node1 and node2 (node2 transitions to node3)
   * group2 has children node3 and node4 (node4 transitions to node5)
   * group3 has children node5 and node6
   * if we move group2 after group3 we will need to change the
   * transition from node2 to node3 and make node2 transition to node5
   * the result will be
   * group1 has children node1 and node2 (node2 transitions to node5)
   * group3 has children node5 and node6
   * group2 has children node3 and node4 (node4 transitions to node5)
   * note: the (node4 transition to node5) will be removed later
   * when is called removeTransitionsOutOfGroup
   * note: when group2 is added in a later function call, we will add
   * the node6 to node3 transition
   * @param groupThatTransitionsToGroupWeAreMoving the group object
   * that transitions to the group we are moving. we may need to update
   * the transitions of this group's children.
   * @param groupIdWeAreMoving the group id of the group we are moving
   */
  private updateChildrenTransitionsIntoGroupWeAreMoving(
    groupThatTransitionsToGroupWeAreMoving: any,
    groupIdWeAreMoving: string
  ): void {
    if (groupThatTransitionsToGroupWeAreMoving != null && groupIdWeAreMoving != null) {
      const group = this.projectService.getNodeById(groupIdWeAreMoving);
      if (group != null) {
        // get all the nodes that have a transition to the node we are removing
        const nodesByToNodeId = this.projectService.getNodesByToNodeId(groupIdWeAreMoving);

        // get the transitions of the node we are removing
        const nodeToRemoveTransitionLogic = group.transitionLogic;
        let nodeToRemoveTransitions = [];

        if (
          nodeToRemoveTransitionLogic != null &&
          nodeToRemoveTransitionLogic.transitions != null
        ) {
          nodeToRemoveTransitions = nodeToRemoveTransitionLogic.transitions;
        }

        if (nodeToRemoveTransitions.length == 0) {
          /*
           * The group we are moving is the last group in the project
           * and does not have any transitions. We will loop through
           * all the nodes that transition into this group and remove
           * those transitions.
           */

          // get child ids of the group that comes before the group we are moving
          const childIds = groupThatTransitionsToGroupWeAreMoving.ids;

          if (childIds != null) {
            for (let childId of childIds) {
              const transitionsFromChild = this.projectService.getTransitionsByFromNodeId(childId);
              if (transitionsFromChild != null) {
                for (let tfc = 0; tfc < transitionsFromChild.length; tfc++) {
                  const transitionFromChild = transitionsFromChild[tfc];
                  if (transitionFromChild != null) {
                    const toNodeId = transitionFromChild.to;
                    const toNodeIdParentGroupId = this.projectService.getParentGroupId(toNodeId);

                    if (groupIdWeAreMoving === toNodeIdParentGroupId) {
                      // the transition is to a child in the group we are moving
                      transitionsFromChild.splice(tfc, 1);

                      /*
                       * move the counter back one because we have just removed an
                       * element from the array
                       */
                      tfc--;
                    }
                  }
                }
              }
            }
          }
        } else if (nodeToRemoveTransitions.length > 0) {
          // get the first group that comes after the group we are removing
          const firstNodeToRemoveTransition = nodeToRemoveTransitions[0];
          const firstNodeToRemoveTransitionToNodeId = firstNodeToRemoveTransition.to;

          if (this.projectService.isGroupNode(firstNodeToRemoveTransitionToNodeId)) {
            // get the group that comes after the group we are moving
            const groupNode = this.projectService.getNodeById(firstNodeToRemoveTransitionToNodeId);

            // get child ids of the group that comes before the group we are moving
            const childIds = groupThatTransitionsToGroupWeAreMoving.ids;

            if (childIds != null) {
              for (let childId of childIds) {
                const transitionsFromChild =
                  this.projectService.getTransitionsByFromNodeId(childId);
                if (transitionsFromChild != null) {
                  for (let transitionFromChild of transitionsFromChild) {
                    if (transitionFromChild != null) {
                      const toNodeId = transitionFromChild.to;

                      // get the parent group id of the toNodeId
                      const toNodeIdParentGroupId = this.projectService.getParentGroupId(toNodeId);

                      if (groupIdWeAreMoving === toNodeIdParentGroupId) {
                        // the transition is to a child in the group we are moving

                        if (groupNode.startId == null || groupNode.startId === '') {
                          // change the transition to point to the after group
                          transitionFromChild.to = firstNodeToRemoveTransitionToNodeId;
                        } else {
                          // change the transition to point to the start id of the after group
                          transitionFromChild.to = groupNode.startId;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Remove transition from nodes in the specified group that go out of the group
   * @param nodeId the group id
   */
  removeTransitionsOutOfGroup(groupId: string): void {
    const group = this.projectService.getNodeById(groupId);
    for (const childId of group.ids) {
      const transitions = this.projectService.getTransitionsByFromNodeId(childId);
      for (let t = 0; t < transitions.length; t++) {
        const transition = transitions[t];
        const parentGroupId = this.projectService.getParentGroupId(transition.to);
        if (parentGroupId != groupId) {
          // this is a transition that goes out of the specified group
          transitions.splice(t, 1);
          t--; // so it won't skip the next element
        }
      }
    }
  }
}
