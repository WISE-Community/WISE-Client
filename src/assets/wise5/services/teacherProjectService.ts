'use strict';
import { ProjectService } from './projectService';
import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BranchService } from './branchService';
import { ComponentServiceLookupService } from './componentServiceLookupService';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './configService';
import { PathService } from './pathService';
import { copy } from '../common/object/object';
import { generateRandomKey } from '../common/string/string';
import { branchPathBackgroundColors } from '../common/color/color';
import { reduceByUniqueId } from '../common/array/array';
import { NodeTypeSelected } from '../authoringTool/domain/node-type-selected';
import { ComponentContent } from '../common/ComponentContent';

@Injectable()
export class TeacherProjectService extends ProjectService {
  private componentChangedSource: Subject<void> = new Subject<void>();
  public componentChanged$: Observable<void> = this.componentChangedSource.asObservable();
  private nodeChangedSource: Subject<boolean> = new Subject<boolean>();
  public nodeChanged$: Observable<boolean> = this.nodeChangedSource.asObservable();
  private refreshProjectSource: Subject<void> = new Subject<void>();
  public refreshProject$ = this.refreshProjectSource.asObservable();
  private errorSavingProjectSource: Subject<void> = new Subject<void>();
  public errorSavingProject$: Observable<void> = this.errorSavingProjectSource.asObservable();
  private nodeTypeSelected: WritableSignal<NodeTypeSelected> = signal(null);
  private notAllowedToEditThisProjectSource: Subject<void> = new Subject<void>();
  public notAllowedToEditThisProject$: Observable<void> =
    this.notAllowedToEditThisProjectSource.asObservable();
  private projectSavedSource: Subject<void> = new Subject<void>();
  public projectSaved$: Observable<void> = this.projectSavedSource.asObservable();
  private savingProjectSource: Subject<void> = new Subject<void>();
  public savingProject$: Observable<void> = this.savingProjectSource.asObservable();
  private uiChangedSource: Subject<void> = new Subject<void>();
  public uiChanged$: Observable<void> = this.uiChangedSource.asObservable();

  constructor(
    protected branchService: BranchService,
    protected componentServiceLookupService: ComponentServiceLookupService,
    protected http: HttpClient,
    protected configService: ConfigService,
    protected pathService: PathService
  ) {
    super(branchService, componentServiceLookupService, http, configService, pathService);
  }

  /**
   * Retrieve the project JSON
   * @param projectId retrieve the project JSON with this id
   * @return a promise to return the project JSON
   */
  retrieveProjectById(projectId: number): any {
    return this.http
      .get(`/api/author/config/${projectId}`)
      .toPromise()
      .then((configJSON: any) => {
        return this.http
          .get(configJSON.projectURL)
          .toPromise()
          .then((projectJSON: any) => {
            projectJSON.previewProjectURL = configJSON.previewProjectURL;
            return projectJSON;
          });
      });
  }

  /**
   * Create a new group
   * @param title the title of the group
   * @returns the group object
   */
  createGroup(title: string): any {
    return {
      id: this.getNextAvailableGroupId(),
      type: 'group',
      title: title,
      startId: '',
      constraints: [],
      transitionLogic: {
        transitions: []
      },
      ids: []
    };
  }

  /**
   * Create a new node
   * @param title the title of the node
   * @returns the node object
   */
  createNode(title) {
    return {
      id: this.getNextAvailableNodeId(),
      title: title,
      type: 'node',
      constraints: [],
      transitionLogic: {
        transitions: []
      },
      showSaveButton: false,
      showSubmitButton: false,
      components: []
    };
  }

  getNodesWithNewIds(nodes: any[]): any[] {
    const oldToNewIds = this.getOldToNewIds(nodes);
    return nodes.map((node: any) => {
      return this.replaceOldIds(node, oldToNewIds);
    });
  }

  getOldToNewIds(nodes: any[]): Map<string, string> {
    const newNodeIds = [];
    const newComponentIds = [];
    const oldToNewIds = new Map();
    for (const node of nodes) {
      const newNodeId = this.getNextAvailableNodeId(newNodeIds);
      oldToNewIds.set(node.id, newNodeId);
      newNodeIds.push(newNodeId);
      for (const component of node.components) {
        const newComponentId = this.getUnusedComponentId(newComponentIds);
        oldToNewIds.set(component.id, newComponentId);
        newComponentIds.push(newComponentId);
      }
    }
    return oldToNewIds;
  }

  replaceOldIds(node: any, oldToNewIds: Map<string, string>): any {
    let nodeString = JSON.stringify(node);
    for (const oldId of Array.from(oldToNewIds.keys()).reverse()) {
      const newId = oldToNewIds.get(oldId);
      nodeString = this.replaceIds(nodeString, oldId, newId);
    }
    return JSON.parse(nodeString);
  }

  replaceIds(nodeString: string, oldId: string, newId: string): string {
    nodeString = nodeString.replace(new RegExp(`\"${oldId}\"`, 'g'), `"${newId}"`);
    nodeString = nodeString.replace(new RegExp(`${oldId}Constraint`, 'g'), `${newId}Constraint`);
    return nodeString;
  }

  /**
   * Create a node inside the group
   * @param node the new node
   * @param nodeId the node id of the group to create the node in
   */
  createNodeInside(node, nodeId) {
    if (nodeId === 'inactiveNodes' || nodeId === 'inactiveGroups') {
      this.addInactiveNodeInsertAfter(node);
      this.setIdToNode(node.id, node);
    } else {
      this.setIdToNode(node.id, node);
      if (this.isInactive(nodeId)) {
        this.addInactiveNodeInsertInside(node, nodeId);
      } else {
        this.addNode(node);
        this.insertNodeInsideOnlyUpdateTransitions(node.id, nodeId);
        this.insertNodeInsideInGroups(node.id, nodeId);
      }
    }
  }

  /**
   * Create a node after the given node id
   * @param node the new node
   * @param nodeId the node to add after
   */
  createNodeAfter(newNode, nodeId) {
    if (this.isInactive(nodeId)) {
      this.setIdToNode(newNode.id, newNode);
      this.addInactiveNodeInsertAfter(newNode, nodeId);
    } else {
      this.addNode(newNode);
      this.setIdToNode(newNode.id, newNode);
      this.insertNodeAfterInGroups(newNode.id, nodeId);
      this.insertNodeAfterInTransitions(newNode, nodeId);
    }
  }

  isInactive(nodeId) {
    for (const inactiveNode of this.getInactiveNodes()) {
      if (inactiveNode.id === nodeId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Set a field in the transition logic of a node
   */
  setTransitionLogicField(nodeId, field, value) {
    const node = this.getNodeById(nodeId);
    const transitionLogic = node.transitionLogic;
    if (transitionLogic != null) {
      transitionLogic[field] = value;
    }
  }

  /**
   * Set the transition to value of a node
   * @param fromNodeId the from node
   * @param toNodeId the to node
   */
  setTransition(fromNodeId, toNodeId) {
    const node = this.getNodeById(fromNodeId);
    const transitionLogic = node.transitionLogic;
    if (transitionLogic != null) {
      let transitions = transitionLogic.transitions;
      if (transitions == null || transitions.length == 0) {
        transitionLogic.transitions = [];
        const transition = {};
        transitionLogic.transitions.push(transition);
        transitions = transitionLogic.transitions;
      }

      if (transitions != null && transitions.length > 0) {
        // get the first transition. we will assume there is only one transition.
        const transition = transitions[0];
        if (transition != null) {
          transition.to = toNodeId;
        }
      }
    }
  }

  /**
   * Get the node id that comes after a given node id
   * @param nodeId get the node id that comes after this node id
   * @return the node id that comes after the one that is passed in as a parameter, or null
   * if this is the last node in the sequence
   */
  getNodeIdAfter(nodeId) {
    const order = this.getOrderById(nodeId);
    if (order != null) {
      return this.getNodeIdByOrder(order + 1);
    } else {
      return null;
    }
  }

  /**
   * Add branch path taken constraints to the node
   * @param targetNodeId the node to add the constraints to
   * @param fromNodeId the from node id of the branch path taken constraint
   * @param toNodeId the to node id of the branch path taken constraint
   */
  addBranchPathTakenConstraints(targetNodeId, fromNodeId, toNodeId) {
    const node = this.getNodeById(targetNodeId);
    const makeThisNodeNotVisibleConstraint = {
      id: this.getNextAvailableConstraintIdForNodeId(targetNodeId),
      action: 'makeThisNodeNotVisible',
      targetId: targetNodeId,
      removalConditional: 'all',
      removalCriteria: [
        {
          name: 'branchPathTaken',
          params: {
            fromNodeId: fromNodeId,
            toNodeId: toNodeId
          }
        }
      ]
    };
    node.constraints.push(makeThisNodeNotVisibleConstraint);
    const makeThisNodeNotVisitableConstraint = {
      id: this.getNextAvailableConstraintIdForNodeId(targetNodeId),
      action: 'makeThisNodeNotVisitable',
      targetId: targetNodeId,
      removalConditional: 'all',
      removalCriteria: [
        {
          name: 'branchPathTaken',
          params: {
            fromNodeId: fromNodeId,
            toNodeId: toNodeId
          }
        }
      ]
    };
    node.constraints.push(makeThisNodeNotVisitableConstraint);
  }

  getProjectRubric(): any {
    return this.project.rubric;
  }

  setProjectRubric(html) {
    this.project.rubric = html;
  }

  setProjectScriptFilename(scriptFilename) {
    this.project.script = scriptFilename;
  }

  getProjectScriptFilename() {
    if (this.project != null && this.project.script != null) {
      return this.project.script;
    }
    return null;
  }

  getBackgroundColor(nodeId: string): string {
    const branchPathLetter = this.nodeIdToBranchPathLetter[nodeId];
    if (branchPathLetter != null) {
      const letterASCIICode = branchPathLetter.charCodeAt(0);
      const branchPathNumber = letterASCIICode - 65;
      return branchPathBackgroundColors[branchPathNumber];
    }
    return null;
  }

  /**
   * Set the node into the project by replacing the existing node with the
   * given node id
   * @param nodeId the node id of the node
   * @param node the node object
   */
  setNode(nodeId, node) {
    for (let n = 0; n < this.project.nodes.length; n++) {
      const tempNode = this.project.nodes[n];
      if (tempNode.id == nodeId) {
        this.project.nodes[n] = node;
      }
    }
    for (let i = 0; i < this.project.inactiveNodes.length; i++) {
      const tempNode = this.project.inactiveNodes[i];
      if (tempNode.id == nodeId) {
        this.project.inactiveNodes[i] = node;
      }
    }
    this.idToNode[nodeId] = node;
  }

  getIdToNode() {
    return this.idToNode;
  }

  checkPotentialStartNodeIdChangeThenSaveProject() {
    this.checkPotentialStartNodeIdChange();
    return this.saveProject();
  }

  checkPotentialStartNodeIdChange() {
    const firstLeafNodeId = this.getFirstLeafNodeId();
    if (firstLeafNodeId == null) {
      this.setStartNodeId('');
    } else {
      const currentStartNodeId = this.getStartNodeId();
      if (currentStartNodeId != firstLeafNodeId) {
        this.setStartNodeId(firstLeafNodeId);
      }
    }
  }

  /**
   * Get the first leaf node by traversing all the start ids
   * until a leaf node id is found
   */
  private getFirstLeafNodeId(): any {
    let firstLeafNodeId = null;
    const startGroupId = this.project.startGroupId;
    let node = this.getNodeById(startGroupId);
    let done = false;

    // loop until we have found a leaf node id or something went wrong
    while (!done) {
      if (node == null) {
        done = true;
      } else if (this.isGroupNode(node.id)) {
        firstLeafNodeId = node.id;
        node = this.getNodeById(node.startId);
      } else if (this.isApplicationNode(node.id)) {
        firstLeafNodeId = node.id;
        done = true;
      } else {
        done = true;
      }
    }
    return firstLeafNodeId;
  }

  /**
   * Add the node to the inactive nodes array.
   * @param node the node to move
   * @param nodeIdToInsertAfter place the node after this
   */
  addInactiveNodeInsertAfter(node, nodeIdToInsertAfter = null) {
    this.clearTransitionsFromNode(node);
    if (this.isNodeIdToInsertTargetNotSpecified(nodeIdToInsertAfter)) {
      this.insertNodeAtBeginningOfInactiveNodes(node);
    } else {
      this.insertNodeAfterInactiveNode(node, nodeIdToInsertAfter);
    }
    if (node.type === 'group') {
      this.inactiveGroupNodes.push(node);
      this.addGroupChildNodesToInactive(node);
    } else {
      this.inactiveStepNodes.push(node);
    }
  }

  clearTransitionsFromNode(node) {
    if (node.transitionLogic != null) {
      node.transitionLogic.transitions = [];
    }
  }

  insertNodeAtBeginningOfInactiveNodes(node) {
    this.project.inactiveNodes.splice(0, 0, node);
  }

  insertNodeAfterInactiveNode(node, nodeIdToInsertAfter) {
    const inactiveNodes = this.getInactiveNodes();
    for (let i = 0; i < inactiveNodes.length; i++) {
      if (inactiveNodes[i].id === nodeIdToInsertAfter) {
        const parentGroup = this.getParentGroup(nodeIdToInsertAfter);
        if (parentGroup != null) {
          this.insertNodeAfterInGroups(node.id, nodeIdToInsertAfter);
          this.insertNodeAfterInTransitions(node, nodeIdToInsertAfter);
        }
        inactiveNodes.splice(i + 1, 0, node);
      }
    }
  }

  isNodeIdToInsertTargetNotSpecified(nodeIdToInsertTarget) {
    return [null, 'inactiveNodes', 'inactiveSteps', 'inactiveGroups'].includes(
      nodeIdToInsertTarget
    );
  }

  addInactiveNodeInsertInside(node, nodeIdToInsertInside = null) {
    this.clearTransitionsFromNode(node);
    if (this.isNodeIdToInsertTargetNotSpecified(nodeIdToInsertInside)) {
      this.insertNodeAtBeginningOfInactiveNodes(node);
    } else {
      this.insertNodeInsideInactiveNode(node, nodeIdToInsertInside);
    }
    if (node.type === 'group') {
      this.inactiveGroupNodes.push(node);
      this.addGroupChildNodesToInactive(node);
    } else {
      this.inactiveStepNodes.push(node);
    }
  }

  insertNodeInsideInactiveNode(node, nodeIdToInsertInside) {
    const inactiveNodes = this.getInactiveNodes();
    const inactiveGroupNodes = this.getInactiveGroupNodes();
    for (const inactiveGroup of inactiveGroupNodes) {
      if (nodeIdToInsertInside === inactiveGroup.id) {
        this.insertNodeInsideOnlyUpdateTransitions(node.id, nodeIdToInsertInside);
        this.insertNodeInsideInGroups(node.id, nodeIdToInsertInside);
        for (let i = 0; i < inactiveNodes.length; i++) {
          if (inactiveNodes[i].id === nodeIdToInsertInside) {
            inactiveNodes.splice(i + 1, 0, node);
          }
        }
      }
    }
  }

  getAutomatedAssessmentProjectId(): number {
    return this.configService.getConfigParam('automatedAssessmentProjectId') || -1;
  }

  getSimulationProjectId(): number {
    return this.configService.getConfigParam('simulationProjectId') || -1;
  }

  /**
   * Get the branch letter in the node position string if the node is in a branch path
   * @param nodeId the node id we want the branch letter for
   * @return the branch letter in the node position if the node is in a branch path
   */
  getBranchLetter(nodeId) {
    const nodePosition = this.getNodePositionById(nodeId);
    const branchLetterRegex = /.*([A-Z])/;
    const match = branchLetterRegex.exec(nodePosition);
    if (match != null) {
      return match[1];
    }
    return null;
  }

  componentChanged(): void {
    this.componentChangedSource.next();
  }

  nodeChanged(doParseProject: boolean = false): void {
    this.nodeChangedSource.next(doParseProject);
  }

  refreshProject() {
    this.refreshProjectSource.next();
  }

  addTeacherRemovalConstraint(node: any, periodId: number) {
    const lockConstraint = {
      id: generateRandomKey(),
      action: 'makeThisNodeNotVisitable',
      targetId: node.id,
      removalConditional: 'any',
      removalCriteria: [
        {
          name: 'teacherRemoval',
          params: {
            periodId: periodId
          }
        }
      ]
    };
    this.addConstraintToNode(node, lockConstraint);
  }

  removeTeacherRemovalConstraint(node: any, periodId: number) {
    node.constraints = node.constraints.filter((constraint) => {
      return !(
        constraint.action === 'makeThisNodeNotVisitable' &&
        constraint.targetId === node.id &&
        constraint.removalCriteria[0].name === 'teacherRemoval' &&
        constraint.removalCriteria[0].params.periodId === periodId
      );
    });
  }

  /**
   * Saves the project to Config.saveProjectURL and returns commit history promise.
   * if Config.saveProjectURL or Config.projectId are undefined, does not save and returns null
   */
  saveProject(): Promise<any> {
    if (!this.configService.getConfigParam('canEditProject')) {
      this.broadcastNotAllowedToEditThisProject();
      return null;
    }
    this.broadcastSavingProject();
    this.cleanupBeforeSave();
    this.project.metadata.authors = reduceByUniqueId(
      this.addCurrentUserToAuthors(this.getAuthors())
    );
    return this.http
      .post(this.configService.getConfigParam('saveProjectURL'), JSON.stringify(this.project))
      .toPromise()
      .then((response: any) => {
        this.handleSaveProjectResponse(response);
      });
  }

  private getAuthors(): any[] {
    return this.project.metadata.authors ? this.project.metadata.authors : [];
  }

  addCurrentUserToAuthors(authors: any[]): any[] {
    let userInfo = this.configService.getMyUserInfo();
    if (this.configService.isClassroomMonitor()) {
      userInfo = {
        id: userInfo.userIds[0],
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        username: userInfo.username
      };
    }
    authors.push(userInfo);
    return authors;
  }

  handleSaveProjectResponse(response: any): any {
    if (response.status === 'error') {
      if (response.messageCode === 'notAllowedToEditThisProject') {
        this.broadcastNotAllowedToEditThisProject();
      } else if (response.messageCode === 'errorSavingProject') {
        this.broadcastErrorSavingProject();
      }
    } else {
      this.broadcastProjectSaved();
    }
    return response;
  }

  /**
   * Perform any necessary cleanup before we save the project.
   * For example we need to remove the checked field in the inactive node
   * objects.
   */
  cleanupBeforeSave() {
    this.project.nodes.forEach((activeNode) => {
      this.cleanupNode(activeNode);
    });
    this.getInactiveNodes().forEach((inactiveNode) => {
      this.cleanupNode(inactiveNode);
    });
  }

  /**
   * Remove any fields that are used temporarily for display purposes like when
   * the project is loaded in the authoring tool and grading tool
   * @param node The node object.
   */
  cleanupNode(node) {
    delete node.checked;
    delete node.hasWork;
    delete node.hasAlert;
    delete node.hasNewAlert;
    delete node.isVisible;
    delete node.completionStatus;
    delete node.score;
    delete node.hasScore;
    delete node.maxScore;
    delete node.hasMaxScore;
    delete node.scorePct;
    delete node.order;
    delete node.show;

    if (node.components != null) {
      // activity node does not have components but step node does
      node.components.forEach((component) => {
        this.cleanupComponent(component);
      });
    }
  }

  /**
   * Remove any fields that are used temporarily for display purposes like when
   * the project is loaded in the authoring tool and grading tool
   * @param component The component object.
   */
  cleanupComponent(component) {
    delete component.checked;
    delete component.isStudentWorkGenerated;
  }

  /**
   * Insert the node after the given node id in the group's array of children ids
   * @param nodeIdToInsert the node id we want to insert
   * @param nodeIdToInsertAfter the node id we want to insert after
   */
  insertNodeAfterInGroups(nodeIdToInsert, nodeIdToInsertAfter) {
    const groupNodes = this.getGroupNodes();
    if (groupNodes != null) {
      for (const group of groupNodes) {
        this.insertNodeAfterInGroup(group, nodeIdToInsert, nodeIdToInsertAfter);
      }
    }
    const inactiveGroupNodes = this.getInactiveGroupNodes();
    if (inactiveGroupNodes != null) {
      for (const inactiveGroup of inactiveGroupNodes) {
        this.insertNodeAfterInGroup(inactiveGroup, nodeIdToInsert, nodeIdToInsertAfter);
      }
    }
  }

  /**
   * Insert a node id in a group after another specific node id.
   * @param group A group object.
   * @param nodeIdToInsert The node id to insert.
   * @param nodeIdToInsertAfter The node id to insert after.
   * @returns {boolean} Whether we inserted the node id.
   */
  insertNodeAfterInGroup(group, nodeIdToInsert, nodeIdToInsertAfter) {
    const ids = group.ids;
    if (ids != null) {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        if (nodeIdToInsertAfter === id) {
          ids.splice(i + 1, 0, nodeIdToInsert);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Update the transitions to handle inserting a node after another node.
   * The two nodes must either both be steps or both be activities.
   * @param nodeToInsert the node to insert
   * @param nodeIdToInsertAfter the node id to insert after
   */
  insertNodeAfterInTransitions(nodeToInsert, nodeIdToInsertAfter) {
    const nodeToInsertAfter = this.getNodeById(nodeIdToInsertAfter);
    if (nodeToInsert.type != nodeToInsertAfter.type) {
      throw 'Error: insertNodeAfterInTransitions() nodes are not the same type';
    }
    if (nodeToInsertAfter.transitionLogic == null) {
      nodeToInsertAfter.transitionLogic = {
        transitions: []
      };
    }
    if (nodeToInsert.transitionLogic == null) {
      nodeToInsert.transitionLogic = {
        transitions: []
      };
    }
    if (this.isGroupNode(nodeToInsert.id)) {
      this.updateChildrenTransitionsInAndOutOfGroup(nodeToInsert, nodeIdToInsertAfter);
    }
    this.copyTransitions(nodeToInsertAfter, nodeToInsert);
    if (nodeToInsert.transitionLogic.transitions.length == 0) {
      this.copyParentTransitions(nodeIdToInsertAfter, nodeToInsert);
    }
    const transitionObject = {
      to: nodeToInsert.id
    };
    nodeToInsertAfter.transitionLogic.transitions = [transitionObject];
    this.updateBranchPathTakenConstraints(nodeToInsert, nodeIdToInsertAfter);
  }

  /*
   * Copy the transitions from nodeId's parent and add to node's transitions.
   * @param nodeId Copy the transition of this nodeId's parent.
   * @param node The node to add transitions to.
   */
  copyParentTransitions(nodeId, node) {
    const parentGroupId = this.getParentGroupId(nodeId);
    if (parentGroupId != 'group0') {
      const parentTransitions = this.getTransitionsByFromNodeId(parentGroupId);
      for (let parentTransition of parentTransitions) {
        const newTransition = {};
        const toNodeId = parentTransition.to;
        if (this.isGroupNode(toNodeId)) {
          const startId = this.getGroupStartId(toNodeId);
          if (startId == null || startId == '') {
            (<any>newTransition).to = toNodeId;
          } else {
            (<any>newTransition).to = startId;
          }
        }
        node.transitionLogic.transitions.push(newTransition);
      }
    }
  }

  copyTransitions(previousNode, node) {
    const transitionsJSONString = JSON.stringify(previousNode.transitionLogic.transitions);
    const transitionsCopy = JSON.parse(transitionsJSONString);
    node.transitionLogic.transitions = transitionsCopy;
  }

  /**
   * If the previous node was in a branch path, we will also put the
   * inserted node into the branch path.
   * @param node The node that is in the branch path.
   * @param nodeId The node we are adding to the branch path.
   */
  updateBranchPathTakenConstraints(node, nodeId) {
    this.removeBranchPathTakenNodeConstraintsIfAny(node.id);
    const branchPathTakenConstraints = this.getBranchPathTakenConstraintsByNodeId(nodeId);
    for (let branchPathTakenConstraint of branchPathTakenConstraints) {
      const newConstraint = {
        id: this.getNextAvailableConstraintIdForNodeId(node.id),
        action: branchPathTakenConstraint.action,
        targetId: node.id,
        removalCriteria: copy(branchPathTakenConstraint.removalCriteria)
      };
      this.addConstraintToNode(node, newConstraint);
    }
  }

  private addConstraintToNode(node: any, constraint: any): void {
    if (node.constraints == null) {
      node.constraints = [];
    }
    node.constraints.push(constraint);
  }

  /**
   * Insert a node into a group
   * @param nodeIdToInsert the node id to insert
   * @param nodeIdToInsertInside the node id of the group we will insert into
   */
  insertNodeInsideInGroups(nodeIdToInsert, nodeIdToInsertInside) {
    const group = this.getNodeById(nodeIdToInsertInside);
    if (group != null) {
      const ids = group.ids;
      if (ids != null) {
        ids.splice(0, 0, nodeIdToInsert);
        group.startId = nodeIdToInsert;
      }
    }
  }

  /**
   * Update the transitions to handle inserting a node as the first step in a group.
   * @param nodeIdToInsert node id that we will insert
   * @param nodeIdToInsertInside the node id of the group we are inserting into
   */
  insertNodeInsideOnlyUpdateTransitions(nodeIdToInsert, nodeIdToInsertInside) {
    if (!this.isGroupNode(nodeIdToInsertInside)) {
      throw 'Error: insertNodeInsideOnlyUpdateTransitions() second parameter must be a group';
    }

    const nodeToInsert = this.getNodeById(nodeIdToInsert);
    nodeToInsert.transitionLogic.transitions = [];
    this.removeBranchPathTakenNodeConstraintsIfAny(nodeIdToInsert);

    if (this.isGroupNode(nodeIdToInsert)) {
      this.updateChildrenTransitionsInAndOutOfGroup(nodeToInsert);
    }

    /*
     * the node will become the first node in the group. this means we need to update any nodes
     * that point to the old start id and make them point to the node we are inserting.
     */
    const group = this.getNodeById(nodeIdToInsertInside);
    const startId = group.startId;
    this.updateTransitionsToStartId(startId, nodeIdToInsert);
    this.updateStepTransitionsToGroup(nodeIdToInsertInside, nodeIdToInsert);
    this.createTransitionFromNodeToInsertToOldStartNode(startId, nodeToInsert);
    const transitions = this.getTransitionsByFromNodeId(nodeIdToInsert);
    if (transitions.length == 0) {
      this.inheritParentTransitions(nodeIdToInsertInside, nodeToInsert);
    }
  }

  /**
   * Copy the transitions from the parent to the node we are inserting.
   * @param nodeIdToInsertInside
   * @param nodeToInsert
   */
  inheritParentTransitions(nodeIdToInsertInside, nodeToInsert) {
    const parentTransitions = this.getTransitionsByFromNodeId(nodeIdToInsertInside);
    for (let parentTransition of parentTransitions) {
      const toNodeId = parentTransition.to;
      if (this.isGroupNode(toNodeId)) {
        const nextGroup = this.getNodeById(toNodeId);
        const startId = nextGroup.startId;
        if (startId == null || startId == '') {
          this.addToTransition(nodeToInsert, toNodeId);
        } else {
          this.addToTransition(nodeToInsert, startId);
        }
      } else {
        this.addToTransition(nodeToInsert, toNodeId);
      }
    }
  }

  /*
   * Create a transition from the node we are inserting to the node that
   * was the start node.
   * @param startId
   * @param nodeToInsert
   */
  createTransitionFromNodeToInsertToOldStartNode(startId, nodeToInsert) {
    const startNode = this.getNodeById(startId);
    if (startNode != null) {
      const transitions = this.getTransitionsByFromNodeId(nodeToInsert.id);
      const transitionObject = {
        to: startId
      };
      transitions.push(transitionObject);
    }
  }

  /*
   * Update all the transitions that point to the group and change
   * them to point to the new start id
   */
  updateStepTransitionsToGroup(nodeIdToInsertInside, nodeIdToInsert) {
    const nodesThatTransitionToGroup = this.getNodesByToNodeId(nodeIdToInsertInside);
    for (let nodeThatTransitionsToGroup of nodesThatTransitionToGroup) {
      if (!this.isGroupNode(nodeThatTransitionsToGroup.id)) {
        this.updateToTransition(nodeThatTransitionsToGroup, nodeIdToInsertInside, nodeIdToInsert);
      }
    }
  }

  updateTransitionsToStartId(startId, nodeIdToInsert) {
    const nodesThatTransitionToStartId = this.getNodesByToNodeId(startId);
    for (let nodeThatTransitionToStartId of nodesThatTransitionToStartId) {
      this.updateToTransition(nodeThatTransitionToStartId, startId, nodeIdToInsert);
    }
  }

  /**
   * Add a transition to a node
   * @param node the node we are adding a transition to
   * @param toNodeId the node id we going to transition to
   * @param criteria (optional) a criteria object specifying
   * what needs to be satisfied in order to use this transition
   */
  addToTransition(node, toNodeId, criteria = null) {
    if (node != null) {
      if (node.transitionLogic == null) {
        node.transitionLogic = {};
      }
      if (node.transitionLogic.transitions == null) {
        node.transitionLogic.transitions = [];
      }
      const transition = {};
      (<any>transition).to = toNodeId;
      if (criteria != null) {
        (<any>transition).criteria = criteria;
      }
      node.transitionLogic.transitions.push(transition);
    }
  }

  /**
   * Update the to value of aa transition
   * @param node the node to update
   * @param oldToNodeId the previous to node id
   * @param newToNodeId the new to node id
   */
  updateToTransition(node, oldToNodeId, newToNodeId) {
    if (node != null) {
      if (node.transitionLogic == null) {
        node.transitionLogic = {};
      }

      if (node.transitionLogic.transitions == null) {
        node.transitionLogic.transitions = [];
      }

      const transitions = node.transitionLogic.transitions;
      for (let transition of transitions) {
        if (transition != null) {
          const toNodeId = transition.to;
          if (oldToNodeId === toNodeId) {
            transition.to = newToNodeId;
          }
        }
      }
    }
  }

  /**
   * Get the next available group id
   * @returns the next available group id
   */
  getNextAvailableGroupId() {
    const groupIds = this.getGroupIds();
    let largestGroupIdNumber = null;
    for (let groupId of groupIds) {
      // get the number from the group id e.g. the number of 'group2' would be 2
      let groupIdNumber = groupId.replace('group', '');

      // make sure the number is an actual number
      if (!isNaN(groupIdNumber)) {
        groupIdNumber = parseInt(groupIdNumber);

        // update the largest group id number if necessary
        if (largestGroupIdNumber == null) {
          largestGroupIdNumber = groupIdNumber;
        } else if (groupIdNumber > largestGroupIdNumber) {
          largestGroupIdNumber = groupIdNumber;
        }
      }
    }

    const nextAvailableGroupId = 'group' + (largestGroupIdNumber + 1);
    return nextAvailableGroupId;
  }

  /**
   * Get all the group ids
   * @returns an array with all the group ids
   */
  getGroupIds() {
    const groupIds = [];
    const groupNodes = this.groupNodes;
    for (let group of groupNodes) {
      if (group != null) {
        const groupId = group.id;
        if (groupId != null) {
          groupIds.push(groupId);
        }
      }
    }

    const inactiveGroupNodes = this.getInactiveGroupNodes();
    for (let inactiveGroup of inactiveGroupNodes) {
      if (inactiveGroup != null) {
        const inactiveGroupId = inactiveGroup.id;
        if (inactiveGroupId != null) {
          groupIds.push(inactiveGroupId);
        }
      }
    }
    return groupIds;
  }

  /**
   * Get the next available node id
   * @param nodeIdsToSkip (optional) An array of additional node ids to not
   * use. This parameter is used in cases where we are creating multiple new
   * nodes at once.
   * Example
   * We ask for two new node ids by calling getNextAvailableNodeId() twice.
   * The first time it returns "node10".
   * If we ask the second time without actually creating and adding node10,
   * it will return "node10" again. If we provide "node10" in the
   * nodeIdsToSkip, then getNextAvailableNodeId() will properly return to us
   * "node11".
   * @returns the next available node id
   */
  getNextAvailableNodeId(nodeIdsToSkip = []) {
    let largestNodeIdNumber = 0;
    for (const nodeId of this.getNodeIds()
      .concat(this.getInactiveNodeIds())
      .concat(nodeIdsToSkip)) {
      const nodeIdNumber = parseInt(nodeId.replace('node', ''));
      if (nodeIdNumber > largestNodeIdNumber) {
        largestNodeIdNumber = nodeIdNumber;
      }
    }
    return 'node' + (largestNodeIdNumber + 1);
  }

  /**
   * Get all the node ids from inactive steps
   * @returns an array with all the inactive node ids
   */
  getInactiveNodeIds() {
    return this.project.inactiveNodes.map((node) => {
      return node.id;
    });
  }

  /**
   * Check if a node is a branch point. A branch point is a node with more
   * than one transition.
   * @param nodeId the node id
   * @return whether the node is a branch point
   */
  isBranchPoint(nodeId: string): boolean {
    const transitions = this.getTransitionsByFromNodeId(nodeId);
    return transitions != null && transitions.length > 1;
  }

  /**
   * Check if the node is in any branch path
   * @param nodeId the node id of the node
   * @return whether the node is in any branch path
   */
  isNodeInAnyBranchPath(nodeId: string): boolean {
    let result = false;
    if (this.nodeIdToIsInBranchPath[nodeId] == null) {
      /*
       * we have not calculated whether the node id is in a branch path
       * before so we will now
       */
      result = this.nodeIdsInAnyBranch.indexOf(nodeId) !== -1;

      // remember the result for this node id
      this.nodeIdToIsInBranchPath[nodeId] = result;
    } else {
      /*
       * we have calculated whether the node id is in a branch path
       * before
       */
      result = this.nodeIdToIsInBranchPath[nodeId];
    }
    return result;
  }

  /**
   * Remove the node id from all groups
   * @param nodeId the node id to remove
   */
  removeNodeIdFromGroups(nodeId) {
    for (const group of this.getGroupNodes()) {
      this.removeNodeIdFromGroup(group, nodeId);
    }
    for (const inactiveGroup of this.getInactiveGroupNodes()) {
      this.removeNodeIdFromGroup(inactiveGroup, nodeId);
    }
  }

  /**
   * Remove a node from a group.
   * If the node is a start node of the group, update the group's start node to
   * the next node in the group after removing.
   * @param group The group to remove from.
   * @param nodeId The node id to remove.
   */
  removeNodeIdFromGroup(group, nodeId) {
    const ids = group.ids;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (id === nodeId) {
        ids.splice(i, 1);
        if (id === group.startId) {
          this.shiftGroupStartNodeByOne(group);
        }
      }
    }
  }

  // TODO handle the case when the start node of the group is a branch point
  shiftGroupStartNodeByOne(group) {
    const transitionsFromStartNode = this.getTransitionsByFromNodeId(group.startId);
    if (transitionsFromStartNode.length > 0) {
      group.startId = transitionsFromStartNode[0].to;
    } else {
      group.startId = '';
    }
  }

  /**
   * Check if any of the components in the node are showing their submit button.
   * @param nodeId {string} The node id to check.
   * @return {boolean} Whether any of the components in the node show their submit button.
   */
  doesAnyComponentInNodeShowSubmitButton(nodeId) {
    const node = this.getNodeById(nodeId);
    for (const component of node.components) {
      if (component.showSubmitButton == true) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns the position of the component in the node by node id and
   * component id, 0-indexed.
   * @param nodeId the node id
   * @param componentId the component id
   * @returns the component's position or -1 if nodeId or componentId are null
   * or doesn't exist in the project.
   */
  getComponentPosition(nodeId: string, componentId: string): number {
    if (nodeId != null && componentId != null) {
      const components = this.getComponents(nodeId);
      for (let c = 0; c < components.length; c++) {
        const tempComponent = components[c];
        if (tempComponent != null) {
          const tempComponentId = tempComponent.id;
          if (componentId === tempComponentId) {
            return c;
          }
        }
      }
    }
    return -1;
  }

  /**
   * Update the transitions so that the fromGroup points to the newToGroup
   *
   * Before
   * fromGroup -> oldToGroup -> newToGroup
   *
   * After
   * fromGroup -> newToGroup
   * oldToGroup becomes dangling and has no transitions to or from it
   */
  updateTransitionsForExtractingGroup(fromGroupId, oldToGroupId, newToGroupId) {
    /*
     * make the transitions
     * fromGroup -> newToGroup
     */
    if (fromGroupId != null && oldToGroupId != null) {
      const fromGroup = this.getNodeById(fromGroupId);
      const oldToGroup = this.getNodeById(oldToGroupId);
      let newToGroup = null;
      let newToGroupStartId = null;

      if (newToGroupId != null) {
        newToGroup = this.getNodeById(newToGroupId);
      }

      if (newToGroup != null) {
        newToGroupStartId = newToGroup.startId;
      }

      if (fromGroup != null && oldToGroup != null) {
        const childIds = fromGroup.ids;

        // update the children of the from group to point to the new to group
        if (childIds != null) {
          for (let childId of childIds) {
            const child = this.getNodeById(childId);
            const transitions = this.getTransitionsByFromNodeId(childId);

            if (transitions != null) {
              for (let t = 0; t < transitions.length; t++) {
                const transition = transitions[t];
                if (transition != null) {
                  const toNodeId = transition.to;
                  if (toNodeId === oldToGroupId) {
                    // the transition is to the group
                    if (newToGroupId == null && newToGroupStartId == null) {
                      // there is no new to group so we will remove the transition
                      transitions.splice(t, 1);
                      t--;
                    } else {
                      // make the transition point to the new to group
                      transition.to = newToGroupId;
                    }
                  } else if (this.isNodeInGroup(toNodeId, oldToGroupId)) {
                    // the transition is to a node in the group
                    if (newToGroupId == null && newToGroupStartId == null) {
                      // there is no new to group so we will remove the transition
                      transitions.splice(t, 1);
                      t--;
                    } else if (newToGroupStartId == null || newToGroupStartId == '') {
                      // make the transition point to the new to group
                      transition.to = newToGroupId;
                    } else {
                      // make the transition point to the new group start id
                      transition.to = newToGroupStartId;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    /*
     * remove the transitions from the oldToGroup
     */
    if (oldToGroupId != null && newToGroupId != null) {
      const oldToGroup = this.getNodeById(oldToGroupId);
      if (oldToGroup != null) {
        const childIds = oldToGroup.ids;

        // remove the transitions from the old to group that point to the new to group
        if (childIds != null) {
          for (let childId of childIds) {
            const child = this.getNodeById(childId);
            const transitions = this.getTransitionsByFromNodeId(childId);
            if (transitions != null) {
              for (let t = 0; t < transitions.length; t++) {
                const transition = transitions[t];
                if (transition != null) {
                  const toNodeId = transition.to;
                  if (toNodeId === newToGroupId) {
                    // the transition is to the group so we will remove it
                    transitions.splice(t, 1);
                    t--;
                  } else if (this.isNodeInGroup(toNodeId, newToGroupId)) {
                    // the transition is to a node in the group so we will remove it
                    transitions.splice(t, 1);
                    t--;
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
   * Determine if a node id is a direct child of a group
   * @param nodeId the node id
   * @param groupId the group id
   */
  isNodeInGroup(nodeId: string, groupId: string): boolean {
    const group = this.getNodeById(groupId);
    return group.ids.indexOf(nodeId) != -1;
  }

  /**
   * Update the transitions so that the fromGroup points to the newToGroup
   *
   * Before
   * fromGroup -> oldToGroup
   * newToGroup is dangling and has no transitions to or from it
   *
   * After
   * fromGroup -> newToGroup -> oldToGroup
   */
  updateTransitionsForInsertingGroup(fromGroupId, oldToGroupIds, newToGroupId) {
    let fromGroup = null;
    let newToGroup = null;
    if (fromGroupId != null) {
      fromGroup = this.getNodeById(fromGroupId);
    }

    if (newToGroupId != null) {
      newToGroup = this.getNodeById(newToGroupId);
    }

    /*
     * make the transitions that point to the old group now point
     * to the new group
     * fromGroup -> newToGroup
     */
    if (fromGroup != null && newToGroup != null) {
      const childIds = fromGroup.ids;
      const newToGroupStartId = newToGroup.startId;
      if (childIds != null) {
        for (let childId of childIds) {
          const child = this.getNodeById(childId);

          // get the transitions from the child
          const transitions = this.getTransitionsByFromNodeId(childId);

          if (transitions == null || transitions.length == 0) {
            /*
             * the child does not have any transitions so we will make it
             * point to the new group
             */
            if (newToGroupStartId == null || newToGroupStartId == '') {
              this.addToTransition(child, newToGroupId);
            } else {
              this.addToTransition(child, newToGroupStartId);
            }
          } else if (transitions != null) {
            for (let transition of transitions) {
              if (transition != null) {
                const toNodeId = transition.to;
                if (oldToGroupIds != null) {
                  for (let oldToGroupId of oldToGroupIds) {
                    if (toNodeId === oldToGroupId) {
                      /*
                       * the transition is to the group so we will update the transition
                       * to the new group
                       */
                      transition.to = newToGroupId;
                    } else if (this.isNodeInGroup(toNodeId, oldToGroupId)) {
                      /*
                       * the transition is to a node in the old group so we will update
                       * the transition to point to the new group
                       */
                      if (newToGroupStartId == null || newToGroupStartId == '') {
                        transition.to = newToGroupId;
                      } else {
                        transition.to = newToGroupStartId;
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

    /*
     * make the steps that do not have a transition now point to the old
     * group
     * newToGroup -> oldToGroup
     */
    if (newToGroup != null) {
      const childIds = newToGroup.ids;
      if (childIds != null) {
        for (let childId of childIds) {
          const child = this.getNodeById(childId);
          const transitions = this.getTransitionsByFromNodeId(childId);

          if (transitions == null || transitions.length == 0) {
            if (oldToGroupIds != null) {
              for (let oldToGroupId of oldToGroupIds) {
                const oldToGroup = this.getNodeById(oldToGroupId);
                if (oldToGroup != null) {
                  const oldToGroupStartId = oldToGroup.startId;
                  if (oldToGroupStartId != null && oldToGroupStartId !== '') {
                    this.addToTransition(child, oldToGroupStartId);
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
   * Update the child transitions because we are moving a group. We will
   * update the transitions into and out of the group in the location
   * we are extracting the group from and also in the location we are
   * inserting the group into.
   * @param node the group we are moving
   * @param nodeId we will put the group after this node id
   */
  updateChildrenTransitionsInAndOutOfGroup(node, nodeId = null) {
    let transitionsBefore = null;

    // get the group nodes that point to the group we are moving
    const previousGroupNodes = this.getGroupNodesByToNodeId(node.id);

    // get all the transitions from the group we are moving
    const transitionsAfter = this.getTransitionsByFromNodeId(node.id);

    let extracted = false;

    /*
     * extract the group we are moving by updating the transitions of the
     * from group and the new to group. also remove the transitions from the
     * group we are moving.
     */

    for (let previousGroupNode of previousGroupNodes) {
      if (transitionsAfter == null || transitionsAfter.length == 0) {
        // the group we are moving does not have any transitions

        /*
         * remove the transitions to the group we are moving and make
         * new transitions from the from group to the new to group
         */
        this.updateTransitionsForExtractingGroup(previousGroupNode.id, node.id, null);
        extracted = true;
      } else {
        // the group we are moving has transitions

        // make the previous group point to the new to group
        for (let transitionAfter of transitionsAfter) {
          if (transitionAfter != null) {
            const toNodeId = transitionAfter.to;

            /*
             * remove the transitions to the group we are moving and make
             * new transitions from the from group to the new to group
             */
            this.updateTransitionsForExtractingGroup(previousGroupNode.id, node.id, toNodeId);
            extracted = true;
          }
        }
      }
    }

    if (!extracted) {
      /*
       * we have not removed the transitions yet because the group
       * we are moving does not have any groups before it
       */

      if (transitionsAfter != null) {
        // remove the transitions from the group we are moving
        for (let transitionAfter of transitionsAfter) {
          if (transitionAfter != null) {
            const toNodeId = transitionAfter.to;

            // remove the transitions to the group we are moving
            this.updateTransitionsForExtractingGroup(null, node.id, toNodeId);
            extracted = true;
          }
        }
      }
    }

    let inserted = false;

    /*
     * create the transitions from the from group to the group we are moving
     * and the transitions from the group we are moving to the old to group
     */
    if (nodeId != null) {
      // get the transitions from the previous group to the next group
      const transitionsAfter = this.getTransitionsByFromNodeId(nodeId);

      for (let transitionAfter of transitionsAfter) {
        if (transitionAfter != null) {
          const toNodeId = transitionAfter.to;

          /*
           * create the transitions that traverse from the from group
           * to the group we are moving. also create the transitions
           * that traverse from the group we are moving to the old
           * to group.
           */
          this.updateTransitionsForInsertingGroup(nodeId, [toNodeId], node.id);
          inserted = true;
        }
      }
    }

    if (!inserted) {
      /*
       * we have not inserted the transitions yet because there were no
       * previous group transitions
       */

      if (nodeId == null) {
        /*
         * the previous node id is null which means there was no previous
         * group. this means the group we are inserting will become the
         * first group. this happens when the group we are moving
         * is moved inside the root (group0).
         */

        const startGroupId = this.getStartGroupId();

        if (startGroupId != null) {
          // get the start group for the whole project (group0)
          const startGroup = this.getNodeById(startGroupId);

          if (startGroup != null) {
            const firstGroupId = startGroup.startId;

            /*
             * create the transitions that traverse from the group
             * we are moving to the previous first activity.
             */
            this.updateTransitionsForInsertingGroup(nodeId, [firstGroupId], node.id);
          }
        }
      } else {
        /*
         * we have not inserted the group yet because the from group doesn't
         * have a group after it
         */

        /*
         * create the transitions that traverse from the from group
         * to the group we are moving.
         */
        this.updateTransitionsForInsertingGroup(nodeId, null, node.id);
      }
    }
  }

  /**
   * Get the group nodes that point to a given node id
   * @param toNodeId
   */
  private getGroupNodesByToNodeId(toNodeId: string): any {
    const groupsThatPointToNodeId = [];
    if (toNodeId != null) {
      const groups = this.getGroups();
      for (let group of groups) {
        if (this.nodeHasTransitionToNodeId(group, toNodeId)) {
          groupsThatPointToNodeId.push(group);
        }
      }
    }
    return groupsThatPointToNodeId;
  }

  /**
   * Remove the child node from the parent group.
   * @param nodeId The child node to remove from the parent.
   */
  removeChildFromParent(nodeId) {
    let parentGroup = this.getParentGroup(nodeId);
    if (parentGroup != null) {
      // Remove the child from the parent
      for (let i = 0; i < parentGroup.ids.length; i++) {
        let childId = parentGroup.ids[i];
        if (nodeId == childId) {
          parentGroup.ids.splice(i, 1);
          break;
        }
      }
      if (nodeId == parentGroup.startId) {
        /*
         * The child we removed was the start id of the group so we
         * will update the start id.
         */
        let startIdUpdated = false;
        let transitions = this.getTransitionsByFromNodeId(nodeId);
        if (
          transitions != null &&
          transitions.length > 0 &&
          transitions[0] != null &&
          transitions[0].to != null
        ) {
          parentGroup.startId = transitions[0].to;
          startIdUpdated = true;
        }
        if (!startIdUpdated && parentGroup.ids.length > 0) {
          parentGroup.startId = parentGroup.ids[0];
          startIdUpdated = true;
        }
        if (!startIdUpdated) {
          parentGroup.startId = '';
        }
      }
    }
  }

  /**
   * Add a group's cthild nodes to the inactive nodes.
   * @param node The group node.
   */
  addGroupChildNodesToInactive(node) {
    for (const childId of node.ids) {
      if (!this.isInactive(childId)) {
        const childNode = this.getNodeById(childId);
        this.project.inactiveNodes.push(childNode);
        this.inactiveStepNodes.push(childNode);
      }
    }
  }

  /**
   * Get an unused component id
   * @param componentIdsToSkip (optional) An array of additional component ids
   * to skip. This is used when we are creating multiple new components. There
   * is avery small chance that we create duplicate component ids that aren't
   * already in the project. We avoid this problem by using this parameter.
   * Example
   * We want to create two new components. We first generate a new component
   * id for the first new component for example "1234567890". Then we generate
   * a new component id for the second new component and pass in
   * ["1234567890"] as componentIdsToSkip because the new "1234567890"
   * component hasn't actually been added to the project yet.
   * @return a component id that isn't already being used in the project
   */
  getUnusedComponentId(componentIdsToSkip = []) {
    let newComponentId = generateRandomKey();

    // check if the component id is already used in the project
    if (this.isComponentIdUsed(newComponentId)) {
      /*
       * the component id is already used in the project so we need to
       * try generating another one
       */
      let alreadyUsed = true;

      /*
       * keep trying to generate a new component id until we have found
       * one that isn't already being used
       */
      while (!alreadyUsed) {
        newComponentId = generateRandomKey();

        // check if the id is already being used in the project
        alreadyUsed = this.isComponentIdUsed(newComponentId);

        if (componentIdsToSkip != null && componentIdsToSkip.indexOf(newComponentId) != -1) {
          /*
           * the new component is in the componentIdsToSkip so it has
           * already been used
           */
          alreadyUsed = true;
        }
      }
    }
    return newComponentId;
  }

  /**
   * Check if the component id is already being used in the project
   * @param componentId check if this component id is already being used in
   * the project
   * @return whether the component id is already being used in the project
   */
  isComponentIdUsed(componentId) {
    for (const node of this.project.nodes.concat(this.project.inactiveNodes)) {
      if (node.components != null) {
        for (const component of node.components) {
          if (componentId === component.id) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Get the next available constraint id for a node
   * @param nodeId get the next available constraint id for this node
   * e.g. node8Constraint2
   * @return the next available constraint id for the node
   */
  getNextAvailableConstraintIdForNodeId(nodeId) {
    let nextAvailableConstraintId = null;
    if (nodeId != null) {
      const usedConstraintIds = [];
      const node = this.getNodeById(nodeId);
      if (node != null) {
        const constraints = node.constraints;
        if (constraints != null) {
          for (let constraint of constraints) {
            if (constraint != null) {
              const constraintId = constraint.id;
              usedConstraintIds.push(constraintId);
            }
          }
        }
      }

      let foundNextAvailableConstraintId = false;
      let counter = 1;

      while (!foundNextAvailableConstraintId) {
        const potentialConstraintId = nodeId + 'Constraint' + counter;
        if (usedConstraintIds.indexOf(potentialConstraintId) == -1) {
          nextAvailableConstraintId = potentialConstraintId;
          foundNextAvailableConstraintId = true;
        } else {
          counter++;
        }
      }
    }
    return nextAvailableConstraintId;
  }

  /**
   * Get all the node ids from steps (not groups)
   * @returns an array with all the node ids
   */
  getNodeIds(): string[] {
    return this.applicationNodes.map((node) => {
      return node.id;
    });
  }

  getApplicationNodes(): any[] {
    return this.applicationNodes;
  }

  /**
   * Get the node ids in the branch by looking for nodes that have branch
   * path taken constraints with the given fromNodeId and toNodeId
   * @param fromNodeId the from node id
   * @param toNodeId the to node id
   * @return an array of nodes that are in the branch path
   */
  getNodeIdsInBranch(fromNodeId, toNodeId) {
    const nodeIdsInBranch = [];
    for (const node of this.getNodes()) {
      if (this.hasBranchPathTakenConstraint(node, fromNodeId, toNodeId)) {
        nodeIdsInBranch.push(node.id);
      }
    }
    this.orderNodeIds(nodeIdsInBranch);
    return nodeIdsInBranch;
  }

  /**
   * Order the node ids so that they show up in the same order as in the
   * project.
   * @param constraints An array of node ids.
   * @return An array of ordered node ids.
   */
  orderNodeIds(nodeIds) {
    let orderedNodeIds = this.getFlattenedProjectAsNodeIds();
    return nodeIds.sort(this.nodeIdsComparatorGenerator(orderedNodeIds));
  }

  /**
   * Create the node ids comparator function that is used for sorting an
   * array of node ids.
   * @param orderedNodeIds An array of node ids in the order in which they
   * show up in the project.
   * @return A comparator that orders node ids in the order in which they show
   * up in the project.
   */
  nodeIdsComparatorGenerator(orderedNodeIds) {
    return function (nodeIdA, nodeIdB) {
      let nodeIdAIndex = orderedNodeIds.indexOf(nodeIdA);
      let nodeIdBIndex = orderedNodeIds.indexOf(nodeIdB);
      if (nodeIdAIndex < nodeIdBIndex) {
        return -1;
      } else if (nodeIdAIndex > nodeIdBIndex) {
        return 1;
      }
      return 0;
    };
  }

  /**
   * Check if a node has a branch path taken constraint
   * @param node the node to check
   * @param fromNodeId the from node id of the branch path taken
   * @param toNodeId the to node id of the branch path taken
   * @return whether the node has a branch path taken constraint with the
   * given from node id and to node id
   */
  hasBranchPathTakenConstraint(node, fromNodeId, toNodeId) {
    const constraints = node.constraints;
    if (constraints != null) {
      for (let constraint of constraints) {
        for (let removalCriterion of constraint.removalCriteria) {
          if (removalCriterion.name == 'branchPathTaken') {
            const params = removalCriterion.params;
            if (params.fromNodeId == fromNodeId && params.toNodeId == toNodeId) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * Remove all branch path taken constraints from a node.
   * @param nodeId Remove the constraints from this node.
   */
  removeBranchPathTakenNodeConstraintsIfAny(nodeId) {
    const node = this.getNodeById(nodeId);
    const constraints = node.constraints;
    if (constraints != null) {
      for (let c = 0; c < constraints.length; c++) {
        const constraint = constraints[c];
        const removalCriteria = constraint.removalCriteria;
        for (let removalCriterion of removalCriteria) {
          if (removalCriterion.name == 'branchPathTaken') {
            constraints.splice(c, 1);
            c--; // update the counter so we don't skip over the next element
          }
        }
      }
    }
  }

  /**
   * @param nodeId Get the branch path taken constraints from this node.
   * @return {Array} An array of branch path taken constraints from the node.
   */
  getBranchPathTakenConstraintsByNodeId(nodeId) {
    const branchPathTakenConstraints = [];
    const node = this.getNodeById(nodeId);
    const constraints = node.constraints;
    if (constraints != null) {
      for (let constraint of constraints) {
        for (let removalCriterion of constraint.removalCriteria) {
          if (removalCriterion.name == 'branchPathTaken') {
            branchPathTakenConstraints.push(constraint);
            break;
          }
        }
      }
    }
    return branchPathTakenConstraints;
  }

  addSpace(space) {
    if (this.project.spaces == null) {
      this.project.spaces = [];
    }
    if (!this.isSpaceExists(space.id)) {
      this.project.spaces.push(space);
      this.saveProject();
    }
  }

  removeSpace(id) {
    let spaces = this.getSpaces();
    for (let s = 0; s < spaces.length; s++) {
      if (spaces[s].id == id) {
        spaces.splice(s, 1);
        this.saveProject();
        return;
      }
    }
  }

  getFeaturedProjectIcons() {
    return this.http
      .get(this.configService.getConfigParam('featuredProjectIconsURL'))
      .toPromise()
      .then((data) => {
        return data;
      });
  }

  setFeaturedProjectIcon(projectIcon) {
    const isCustom = false;
    return this.setProjectIcon(projectIcon, isCustom);
  }

  setCustomProjectIcon(projectIcon) {
    const isCustom = true;
    return this.setProjectIcon(projectIcon, isCustom);
  }

  setProjectIcon(projectIcon, isCustom) {
    return this.http
      .post(this.configService.getConfigParam('projectIconURL'), {
        projectId: this.configService.getProjectId(),
        projectIcon: projectIcon,
        isCustom: isCustom
      })
      .toPromise()
      .then((result) => {
        return result;
      });
  }

  getStepNodesDetailsInOrder(): any[] {
    const stepNodeDetails: any[] = [];
    Object.entries(this.idToOrder).forEach(([nodeId, objectWithOrder]: [string, any]) => {
      if (this.isApplicationNode(nodeId)) {
        stepNodeDetails.push({
          nodeId: nodeId,
          order: objectWithOrder.order,
          nodePositionAndTitle: this.getNodePositionAndTitle(nodeId)
        });
      }
    });
    return stepNodeDetails.sort(this.sortByOrder);
  }

  sortByOrder(a: any, b: any): number {
    return a.order - b.order;
  }

  broadcastSavingProject(): void {
    this.savingProjectSource.next();
  }

  broadcastErrorSavingProject() {
    this.errorSavingProjectSource.next();
  }

  broadcastNotAllowedToEditThisProject() {
    this.notAllowedToEditThisProjectSource.next();
  }

  broadcastProjectSaved() {
    this.projectSavedSource.next();
  }

  getNodesInOrder(): any[] {
    return Object.entries(this.idToOrder)
      .map((entry: any) => {
        return { key: entry[0], id: entry[0], order: entry[1].order };
      })
      .sort((a: any, b: any) => {
        return a.order - b.order;
      });
  }

  setNodeTypeSelected(nodeTypeSelected: NodeTypeSelected): void {
    this.nodeTypeSelected.set(nodeTypeSelected);
  }

  getNodeTypeSelected(): Signal<NodeTypeSelected> {
    return this.nodeTypeSelected.asReadonly();
  }

  getComponentsFromStep(nodeId: string): ComponentContent[] {
    return this.getNodeById(nodeId).components;
  }

  getComponentsFromLesson(lessonId: string): ComponentContent[] {
    return this.getNodeById(lessonId).ids.flatMap((nodeId: string) =>
      this.getComponentsFromStep(nodeId)
    );
  }

  uiChanged(): void {
    this.uiChangedSource.next();
  }
}
