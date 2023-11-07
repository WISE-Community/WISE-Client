'use strict';

import { ConfigService } from './configService';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Node } from '../common/Node';
import { PeerGrouping } from '../../../app/domain/peerGrouping';
import { ComponentServiceLookupService } from './componentServiceLookupService';
import { Branch } from '../../../app/domain/branch';
import { BranchService } from './branchService';
import { PathService } from './pathService';
import { ComponentContent } from '../common/ComponentContent';
import { MultipleChoiceContent } from '../components/multipleChoice/MultipleChoiceContent';
import { TransitionLogic } from '../common/TransitionLogic';
import { Transition } from '../common/Transition';
import { ReferenceComponent } from '../../../app/domain/referenceComponent';
import { QuestionBank } from '../components/peerChat/peer-chat-question-bank/QuestionBank';
import { DynamicPrompt } from '../directives/dynamic-prompt/DynamicPrompt';
import { Component } from '../common/Component';

@Injectable()
export class ProjectService {
  achievements: any = [];
  additionalProcessingFunctionsMap: any = {};
  allPaths: string[][] = [];
  applicationNodes: any = [];
  flattenedProjectAsNodeIds: any = null;
  groupNodes: any[] = [];
  idToNode: any = {};
  idToOrder: any = {};
  inactiveGroupNodes: any[] = [];
  inactiveStepNodes: any[] = [];
  metadata: any = {};
  nodes: any = {};
  nodeCount: number = 0;
  nodeIdToNumber: any = {};
  nodeIdToIsInBranchPath: any = {};
  nodeIdsInAnyBranch: any = [];
  nodeIdToBranchPathLetter: any = {};
  project: any = null;
  rootNode: any = null;
  transitions: Transition[] = [];
  private projectParsedSource: Subject<void> = new Subject<void>();
  public projectParsed$: Observable<void> = this.projectParsedSource.asObservable();

  constructor(
    protected branchService: BranchService,
    protected componentServiceLookupService: ComponentServiceLookupService,
    protected http: HttpClient,
    protected configService: ConfigService,
    protected pathService: PathService
  ) {}

  setProject(project: any): void {
    this.project = project;
    this.parseProject();
  }

  clearProjectFields(): void {
    this.allPaths = [];
    this.applicationNodes = [];
    this.flattenedProjectAsNodeIds = null;
    this.inactiveStepNodes = [];
    this.inactiveGroupNodes = [];
    this.groupNodes = [];
    this.idToNode = {};
    this.metadata = {};
    this.rootNode = null;
    this.idToOrder = {};
    this.nodeCount = 0;
    this.nodeIdToIsInBranchPath = {};
    this.nodeIdsInAnyBranch = [];
    this.nodes = {};
    this.achievements = [];
    this.branchService.clearBranchesCache();
  }

  getStyle(): any {
    return this.project.style;
  }

  getProjectTitle(): string {
    const name = this.getProjectMetadata().title;
    return name ? name : 'A WISE Project (No name)';
  }

  getProjectMetadata(): any {
    return this.metadata ? this.metadata : {};
  }

  getNodes(): any {
    return this.project.nodes;
  }

  getChildNodeIdsById(nodeId: string): string[] {
    const node = this.getNodeById(nodeId);
    if (node.ids) {
      return node.ids;
    }
    return [];
  }

  getGroupNodes(): any[] {
    return this.groupNodes;
  }

  addNode(node: any): void {
    const existingNodes = this.project.nodes;
    let replaced = false;
    if (existingNodes != null) {
      for (let n = 0; n < existingNodes.length; n++) {
        const existingNode = existingNodes[n];
        if (existingNode.id === node.id) {
          existingNodes.splice(n, 1, node);
          replaced = true;
        }
      }
    }
    if (!replaced) {
      existingNodes.push(node);
    }
  }

  private addApplicationNode(node: any): void {
    const applicationNodes = this.applicationNodes;
    if (applicationNodes != null) {
      applicationNodes.push(node);
    }
  }

  private addGroupNode(node: any): void {
    const groupNodes = this.groupNodes;
    if (node != null && groupNodes != null) {
      groupNodes.push(node);
    }
  }

  private addNodeToGroupNode(groupId: string, nodeId: string): void {
    if (groupId != null && nodeId != null) {
      const group = this.getNodeById(groupId);
      if (group != null) {
        const groupChildNodeIds = group.ids;
        if (groupChildNodeIds != null) {
          if (groupChildNodeIds.indexOf(nodeId) === -1) {
            groupChildNodeIds.push(nodeId);
          }
        }
      }
    }
  }

  isGroupNode(id: string): boolean {
    const node = this.getNodeById(id);
    return node != null && node.type == 'group';
  }

  isApplicationNode(id: string): boolean {
    const node = this.getNodeById(id);
    return node != null && node.type !== 'group';
  }

  getGroups(): any[] {
    return this.groupNodes;
  }

  getInactiveGroupNodes(): any[] {
    return this.inactiveGroupNodes;
  }

  /**
   * Get the inactive step nodes. This will include the inactive steps that
   * are in an inactive group.
   * @return An array of inactive step nodes.
   */
  getInactiveStepNodes(): any[] {
    return this.inactiveStepNodes;
  }

  loadNodes(nodes: any[]): void {
    for (const node of nodes) {
      const nodeId = node.id;
      const nodeType = node.type;

      this.setIdToNode(nodeId, node);
      this.addNode(node);

      if (nodeType === 'group') {
        this.addGroupNode(node);
      } else {
        this.addApplicationNode(node);
      }

      const groupId = node.groupId;
      if (groupId != null) {
        this.addNodeToGroupNode(groupId, nodeId);
      }
    }
  }

  private loadNodeIdsInAnyBranch(branches: Branch[]): void {
    for (const branch of branches) {
      for (const branchPath of branch.paths) {
        this.nodeIdsInAnyBranch = this.nodeIdsInAnyBranch.concat(branchPath);
      }
    }
  }

  parseProject(): void {
    this.clearProjectFields();
    this.instantiateDefaults();
    this.metadata = this.project.metadata;
    this.loadNodes(this.project.nodes);
    this.loadInactiveNodes(this.project.inactiveNodes);
    this.rootNode = this.getRootNode(this.project.nodes[0].id);
    this.calculateNodeOrderOfProject();
    this.loadNodeIdsInAnyBranch(this.getBranches());
    this.calculateNodeNumbers();
    this.groupNodes = this.getActiveGroupNodes();
    if (this.project.projectAchievements != null) {
      this.achievements = this.project.projectAchievements;
    }
    this.broadcastProjectParsed();
  }

  private getActiveGroupNodes(): any[] {
    const activeNodeIds = Object.keys(this.idToOrder);
    return this.groupNodes.filter((node) => activeNodeIds.includes(node.id));
  }

  instantiateDefaults(): void {
    this.project.nodes = this.project.nodes ? this.project.nodes : [];
    this.project.inactiveNodes = this.project.inactiveNodes ? this.project.inactiveNodes : [];
  }

  private calculateNodeOrderOfProject(): void {
    this.calculateNodeOrder(this.rootNode);
  }

  calculateNodeOrder(node: any): void {
    this.idToOrder[node.id] = { order: this.nodeCount };
    this.nodeCount++;
    if (this.isGroupNode(node.id)) {
      for (const childId of node.ids) {
        this.calculateNodeOrder(this.getNodeById(childId));
      }
    }
  }

  private getBranches(): Branch[] {
    const allPaths = this.getAllPaths([], this.getStartNodeId());
    return this.branchService.getBranches(allPaths);
  }

  /**
   * Get the node order mappings of the project
   * @param project the project JSOn
   * @return an object containing the idToOrder mapping and also the array
   * of nodes
   */
  getNodeOrderOfProject(project: any): any {
    const rootNode = this.getNodeById(project.startGroupId, project);
    const idToOrder = {
      nodeCount: 0
    };
    const stepNumber = '';
    const nodes = [];
    const importProjectIdToOrder = this.getNodeOrderOfProjectHelper(
      project,
      rootNode,
      idToOrder,
      stepNumber,
      nodes
    );
    delete importProjectIdToOrder.nodeCount;
    return {
      idToOrder: importProjectIdToOrder,
      nodes: nodes
    };
  }

  /**
   * Recursively traverse the project to calculate the node order and step numbers
   * @param project the project JSON
   * @param node the current node we are on
   * @param idToOrder the mapping of node id to item
   * @param stepNumber the current step number
   * @param nodes the array of nodes
   */
  private getNodeOrderOfProjectHelper(
    project: any,
    node: any,
    idToOrder: any,
    stepNumber: string,
    nodes: any
  ): any {
    /*
     * Create the item that we will add to the idToOrder mapping.
     * The 'order' field determines how the project nodes are displayed
     * when we flatten the project for displaying.
     */
    const item = {
      order: idToOrder.nodeCount,
      node: node,
      stepNumber: stepNumber
    };

    idToOrder[node.id] = item;
    idToOrder.nodeCount++;
    nodes.push(item);

    if (node.type == 'group') {
      const childIds = node.ids;
      for (let c = 0; c < childIds.length; c++) {
        const childId = childIds[c];
        const child = this.getNodeById(childId, project);
        let childStepNumber = stepNumber;

        if (childStepNumber != '') {
          // add the . separator for the step number e.g. 1.
          childStepNumber += '.';
        }

        childStepNumber += c + 1;
        this.getNodeOrderOfProjectHelper(project, child, idToOrder, childStepNumber, nodes);
      }
    }
    return idToOrder;
  }

  /**
   * Returns the order of the given node id in the project. Returns null if no node with id exists.
   * @param id String node id
   * @return Number order of the given node id in the project
   */
  getOrderById(id: string): any {
    if (this.idToOrder[id]) {
      return this.idToOrder[id].order;
    }
    return null;
  }

  getGroupNodesIdToOrder(): any {
    const idToOrder = {};
    const onlyGroupNodes = Object.entries(this.idToOrder).filter((item) => {
      return this.isGroupNode(item[0]);
    });
    for (const [key, value] of onlyGroupNodes) {
      idToOrder[key] = value;
    }
    return idToOrder;
  }

  getNodePositionById(id: string): any {
    if (id != null) {
      return this.nodeIdToNumber[id];
    }
    return null;
  }

  getNodeIdByOrder(order: any): string {
    for (let [nodeId, value] of Object.entries(this.idToOrder)) {
      if ((<any>value).order === order) {
        return nodeId;
      }
    }
    return null;
  }

  getNodeOrderById(id: string): any {
    return this.idToOrder[id] ? this.idToOrder[id].order : null;
  }

  setIdToNode(id: any, element: any): void {
    this.idToNode[id] = element;
  }

  /**
   * Replace relative asset paths with absolute paths
   * e.g.
   * assets/myimage.jpg
   * will be replaced with
   * http://wise.berkeley.edu/curriculum/123456/assets/myimage.jpg
   * @param content a string or JSON object
   * @return the same type of object that was passed in as the content
   * but with relative asset paths replaced with absolute paths
   */
  injectAssetPaths(content: any): any {
    if (content != null) {
      if (typeof content === 'object') {
        let contentString = JSON.stringify(content);
        if (contentString != null) {
          // replace the relative asset paths with the absolute paths
          contentString = this.replaceAssetPaths(contentString);
          content = JSON.parse(contentString);
        }
      } else if (typeof content === 'string') {
        // replace the relative asset paths with the absolute paths
        content = this.replaceAssetPaths(content);
      }
    }
    return content;
  }

  /**
   * Replace the relative asset paths with absolute paths
   * @param contentString the content string
   * @return the content string with relative asset paths replaced
   * with absolute asset paths
   */
  replaceAssetPaths(contentString: string): string {
    if (contentString != null) {
      // get the content base url e.g. http://wise.berkeley.edu/curriculum/123456/
      const contentBaseURL = this.configService.getConfigParam('projectBaseURL');

      // only look for string that starts with ' or " and ends in png, jpg, jpeg, pdf, etc.
      // the string we're looking for can't start with '/ and "/.
      // note that this also works for \"abc.png and \'abc.png, where the quotes are escaped
      contentString = contentString.replace(
        new RegExp(
          "('|\"|\\\\'|\\\\\")[^:][^/]?[^/]?[a-zA-Z0-9@%&;\\._\\/\\s\\-']*[.]" +
            '(png|jpe?g|pdf|gif|mov|mp4|mp3|wav|swf|css|txt|json|xlsx?|doc|html.*?|js).*?' +
            '(\'|"|\\\\\'|\\\\")',
          'gi'
        ),
        (matchedString) => {
          /*
           * once found, we prepend the contentBaseURL + "assets/" to the string within the quotes
           * and keep everything else the same.
           */
          let delimiter = '';
          let matchedStringWithoutQuotes = '';

          if (matchedString.length > 2 && matchedString.substr(0, 1) == '\\') {
            // the string has escaped quotes for example \"hello.png\"

            // get everything between the escaped quotes
            matchedStringWithoutQuotes = matchedString.substr(2, matchedString.length - 4);

            // get the delimiter which will be \' or \"
            delimiter = matchedString.substr(0, 2);
          } else {
            // the string does not have escaped quotes for example "hello.png"

            // get everything between the quotes
            matchedStringWithoutQuotes = matchedString.substr(1, matchedString.length - 2);

            // get the delimiter which will be ' or "
            delimiter = matchedString.substr(0, 1);
          }

          if (
            matchedStringWithoutQuotes != null &&
            matchedStringWithoutQuotes.length > 0 &&
            matchedStringWithoutQuotes.charAt(0) == '/'
          ) {
            /*
             * the matched string starts with a "/" which means it's
             * an absolute path and does not require path prepending
             * so we will just return the original unmodified string
             */
            return delimiter + matchedStringWithoutQuotes + delimiter;
          } else {
            // make a new string with the contentBaseURL + assets/ prepended to the path
            return delimiter + contentBaseURL + 'assets/' + matchedStringWithoutQuotes + delimiter;
          }
        }
      );
    }
    return contentString;
  }

  /**
   * Returns the node specified by the nodeId
   * @param nodeId get the node with this node id
   * @param (optional) the project to retrieve the node from. this is used in
   * the case when we want the node from another project such as when we are
   * importing a step from another project
   * Return null if nodeId param is null or the specified node does not exist in the project.
   */
  getNodeById(nodeId: string, project = null): any {
    if (project == null) {
      if (this.idToNode[nodeId]) {
        return this.idToNode[nodeId];
      }
    } else {
      for (let tempNode of project.nodes) {
        if (tempNode != null && tempNode.id == nodeId) {
          return tempNode;
        }
      }

      for (let tempNode of project.inactiveNodes) {
        if (tempNode != null && tempNode.id == nodeId) {
          return tempNode;
        }
      }
    }
    return null;
  }

  getNode(nodeId: string): Node {
    if (this.nodes.hasOwnProperty(nodeId)) {
      return this.nodes[nodeId];
    } else {
      const node = Object.assign(new Node(), this.getNodeById(nodeId));
      this.nodes[nodeId] = node;
      return node;
    }
  }

  /**
   * Returns the title of the node with the nodeId
   * Return null if nodeId param is null or the specified node does not exist in the project.
   */
  getNodeTitle(nodeId: string): string {
    const node = this.getNodeById(nodeId);
    if (node != null) {
      return node.title;
    }
    return null;
  }

  /**
   * Get the node position and title
   * @param nodeId the node id
   * @returns the node position and title, e.g. "1.1 Introduction"
   */
  getNodePositionAndTitle(nodeId: string): string {
    const node = this.getNodeById(nodeId);
    if (node != null) {
      const position = this.getNodePositionById(nodeId);
      if (position != null) {
        return position + ': ' + node.title;
      } else {
        return node.title;
      }
    }
    return null;
  }

  getParentGroup(nodeId = ''): any {
    const node = this.getNodeById(nodeId);
    if (node != null) {
      for (const groupNode of this.getGroupNodes()) {
        if (this.isNodeDirectChildOfGroup(node, groupNode)) {
          return groupNode;
        }
      }
      for (const inactiveGroupNode of this.getInactiveGroupNodes()) {
        if (this.isNodeDirectChildOfGroup(node, inactiveGroupNode)) {
          return inactiveGroupNode;
        }
      }
    }
    return null;
  }

  getParentGroupId(nodeId = ''): string {
    const parentGroup = this.getParentGroup(nodeId);
    if (parentGroup != null) {
      return parentGroup.id;
    }
    return null;
  }

  getNodeDepth(nodeId, val) {
    if (nodeId != null) {
      let depth = typeof val === 'number' ? val : 0;
      const parent = this.getParentGroup(nodeId);
      if (parent) {
        depth = this.getNodeDepth(parent.id, depth + 1);
      }
      return depth;
    }
    return null;
  }

  getRootNode(nodeId: string): any {
    const parentGroup = this.getParentGroup(nodeId);
    return parentGroup == null ? this.getNodeById(nodeId) : this.getRootNode(parentGroup.id);
  }

  private isNodeDirectChildOfGroup(node: any, group: any): boolean {
    if (node != null && group != null) {
      const nodeId = node.id;
      const groupIds = group.ids;
      if (groupIds != null && groupIds.indexOf(nodeId) != -1) {
        return true;
      }
    }
    return false;
  }

  isNodeDescendentOfGroup(node: any, group: any): boolean {
    if (node != null && group != null) {
      const descendents = this.getDescendentIdsOfGroup(group);
      const nodeId = node.id;
      if (descendents.indexOf(nodeId) != -1) {
        return true;
      }
    }
    return false;
  }

  getDescendentIdsOfGroup(group: any): string[] {
    let descendents = [];
    if (group != null) {
      const childIds = group.ids;
      if (childIds != null) {
        descendents = childIds;
        for (let childId of childIds) {
          const node = this.getNodeById(childId);
          if (node != null) {
            const childDescendents = this.getDescendentIdsOfGroup(node);
            descendents = descendents.concat(childDescendents);
          }
        }
      }
    }
    return descendents;
  }

  getStartNodeId(): string {
    return this.project.startNodeId;
  }

  setStartNodeId(nodeId: string): void {
    this.project.startNodeId = nodeId;
  }

  getStartGroupId(): string {
    return this.project.startGroupId;
  }

  isStartNodeId(nodeId: string): boolean {
    return this.project.startNodeId === nodeId;
  }

  /**
   * Check if a node id comes after another node id in the project.
   * @param nodeId1 The node id of a step or group.
   * @param nodeId2 The node id of a step or group.
   * @returns {boolean} True iff nodeId2 comes after nodeId1.
   */
  isNodeIdAfter(nodeId1: string, nodeId2: string): boolean {
    if (this.isApplicationNode(nodeId1)) {
      if (nodeId1 == nodeId2) {
        return false;
      } else {
        for (const onePath of this.getOrCalculateAllPaths()) {
          if (this.pathIncludesNodesAndOneComesBeforeTwo(onePath, nodeId1, nodeId2)) {
            return true;
          }
        }
      }
    } else {
      return this.isNodeAfterGroup(nodeId1, nodeId2);
    }
    return false;
  }

  pathIncludesNodesAndOneComesBeforeTwo(path: string[], nodeId1: string, nodeId2: string): boolean {
    return (
      path.includes(nodeId1) &&
      path.includes(nodeId2) &&
      path.indexOf(nodeId1) < path.indexOf(nodeId2)
    );
  }

  private getOrCalculateAllPaths(): string[][] {
    if (this.allPaths.length === 0) {
      this.allPaths = this.getAllPaths([], this.getStartNodeId(), true);
    }
    return this.allPaths;
  }

  /**
   * @param groupId
   * @param nodeId The node id of a step or group.
   * @returns {boolean} True iff nodeId comes after groupId.
   */
  private isNodeAfterGroup(groupId: string, nodeId: string): boolean {
    try {
      for (const transition of this.getTransitionsByFromNodeId(groupId)) {
        const pathFromGroupToEnd = this.getAllPaths([], transition.to, true);
        for (let pathToEnd of pathFromGroupToEnd) {
          if (pathToEnd.indexOf(nodeId) != -1) {
            return true;
          }
        }
      }
    } catch (e) {}
    return false;
  }

  /**
   * Get the transition logic for a node
   * @param fromNodeId the from node id
   * @returns the transition logic object
   */
  getTransitionLogicByFromNodeId(fromNodeId: string): TransitionLogic {
    return this.getNode(fromNodeId).getTransitionLogic();
  }

  /**
   * Get the transitions for a node
   * @param fromNodeId the node to get transitions from
   * @returns {Array} an array of transitions
   */
  getTransitionsByFromNodeId(fromNodeId: string): Transition[] {
    const transitionLogic = this.getTransitionLogicByFromNodeId(fromNodeId);
    return transitionLogic.transitions ?? [];
  }

  /**
   * Get nodes that have a transition to the given node id
   * @param toNodeId the node id
   * @returns an array of node objects that transition to the
   * given node id
   */
  getNodesByToNodeId(toNodeId: string): any {
    const nodesByToNodeId = [];
    if (toNodeId != null) {
      const nodes = this.project.nodes;
      for (let node of nodes) {
        if (this.nodeHasTransitionToNodeId(node, toNodeId)) {
          nodesByToNodeId.push(node);
        }
      }
      const inactiveNodes = this.getInactiveNodes();
      for (let inactiveNode of inactiveNodes) {
        if (this.nodeHasTransitionToNodeId(inactiveNode, toNodeId)) {
          nodesByToNodeId.push(inactiveNode);
        }
      }
    }
    return nodesByToNodeId;
  }

  getInactiveNodes(): any {
    return this.project.inactiveNodes;
  }

  /**
   * Check if a node has a transition to the given nodeId.
   * @param node The node to check.
   * @param toNodeId We are looking for a transition to this node id.
   * @returns Whether the node has a transition to the given nodeId.
   */
  nodeHasTransitionToNodeId(node: Node, toNodeId: string): boolean {
    return this.getTransitionsByFromNodeId(node.id).some(
      (transition) => transition.to === toNodeId
    );
  }

  /**
   * Get node ids of all the nodes that have a to transition to the given node id
   * @param toNodeId
   * @returns all the node ids that have a transition to the given node id
   */
  getNodesWithTransitionToNodeId(toNodeId: string): string[] {
    const nodeIds = [];
    const nodes = this.getNodesByToNodeId(toNodeId);
    for (let node of nodes) {
      nodeIds.push(node.id);
    }
    return nodeIds;
  }

  /**
   * Retrieves the project JSON from Config.projectURL and returns it.
   * If Config.projectURL is undefined, returns null.
   */
  retrieveProject(): Observable<any> {
    return this.makeProjectRequest().pipe(
      tap((projectJSON: any) => {
        this.setProject(projectJSON);
        return projectJSON;
      })
    );
  }

  retrieveProjectWithoutParsing(): Observable<any> {
    return this.makeProjectRequest().pipe(
      tap((projectJSON: any) => {
        this.project = projectJSON;
        this.metadata = projectJSON.metadata;
        return projectJSON;
      })
    );
  }

  private makeProjectRequest(): Observable<any> {
    const projectURL = this.configService.getConfigParam('projectURL');
    const headers = new HttpHeaders().set('cache-control', 'no-cache');
    return this.http.get(projectURL, { headers: headers });
  }

  getThemePath(): string {
    return this.getDefaultThemePath();
  }

  private getDefaultThemePath(): string {
    return `${this.configService.getWISEBaseURL()}/assets/wise5/themes/default`;
  }

  /**
   * Returns the theme settings for the current project
   */
  getThemeSettings(): any {
    let themeSettings = {};
    if (this.project.themeSettings) {
      if (this.project.theme) {
        // TODO: check if this is a valid theme (using ConfigService) rather than just truthy
        themeSettings = this.project.themeSettings[this.project.theme];
      } else {
        // TODO: get default theme name from ConfigService
        themeSettings = this.project.themeSettings['default'];
      }
    }
    return themeSettings ? themeSettings : {};
  }

  /**
   * Flatten the project to obtain a list of node ids
   * @param recalculate Whether to force recalculating the flattened node ids.
   * @return An array of the flattened node ids in the project.
   */
  getFlattenedProjectAsNodeIds(recalculate = true): any {
    if (!recalculate && this.flattenedProjectAsNodeIds != null) {
      // use the previously calculated flattened node ids
      return this.flattenedProjectAsNodeIds;
    }

    const startNodeId = this.getStartNodeId();

    /*
     * an array to keep track of the node ids in the path that
     * we are currently on as we traverse the nodes in the project
     * depth first
     */
    const pathsSoFar = [];
    const allPaths = this.getAllPaths(pathsSoFar, startNodeId);
    const nodeIds = this.pathService.consolidatePaths(allPaths);
    this.flattenedProjectAsNodeIds = nodeIds; // cache flatted node ids
    return nodeIds;
  }

  /**
   * Get all the possible paths through the project. This function
   * recursively calls itself to traverse the project depth first.
   * @param pathSoFar the node ids in the path so far. the node ids
   * in this array are referenced to make sure we don't loop back
   * on the path.
   * @param nodeId the node id we want to get the paths from
   * @param includeGroups whether to include the group node ids in the paths
   * @return an array of paths. each path is an array of node ids.
   */
  getAllPaths(pathSoFar: string[], nodeId: string = '', includeGroups: boolean = false): any[][] {
    const allPaths = [];
    if (this.isApplicationNode(nodeId)) {
      const path = [];
      const transitions = this.getTransitionsByFromNodeId(nodeId);
      if (includeGroups) {
        const parentGroup = this.getParentGroup(nodeId);
        if (parentGroup != null) {
          const parentGroupId = parentGroup.id;
          if (parentGroupId != null && pathSoFar.indexOf(parentGroupId) == -1) {
            pathSoFar.push(parentGroup.id);
          }
        }
      }

      /*
       * add the node id to the path so far so we can later check
       * which nodes are already in the path to prevent looping
       * back in the path
       */
      pathSoFar.push(nodeId);

      if (transitions.length === 0) {
        /*
         * there are no transitions from the node id so we will
         * look for a transition in the parent group
         */

        let addedCurrentNodeId = false;
        const parentGroupId = this.getParentGroupId(nodeId);
        const parentGroupTransitions = this.getTransitionsByFromNodeId(parentGroupId);
        for (const parentGroupTransition of parentGroupTransitions) {
          if (parentGroupTransition != null) {
            const toNodeId = parentGroupTransition.to;
            if (pathSoFar.indexOf(toNodeId) == -1) {
              /*
               * recursively get the paths by getting all
               * the paths for the to node
               */
              const allPathsFromToNode = this.getAllPaths(pathSoFar, toNodeId, includeGroups);

              for (let tempPath of allPathsFromToNode) {
                tempPath.unshift(nodeId);
                allPaths.push(tempPath);
                addedCurrentNodeId = true;
              }
            }
          }
        }

        if (!addedCurrentNodeId) {
          /*
           * if the parent group doesn't have any transitions we will
           * need to add the current node id to the path
           */
          path.push(nodeId);
          allPaths.push(path);
        }
      } else {
        // there are transitions from this node id

        for (let transition of transitions) {
          if (transition != null) {
            const toNodeId = transition.to;
            if (toNodeId != null && pathSoFar.indexOf(toNodeId) == -1) {
              // we have not found the to node in the path yet so we can traverse it

              /*
               * recursively get the paths by getting all
               * the paths from the to node
               */
              const allPathsFromToNode = this.getAllPaths(pathSoFar, toNodeId, includeGroups);

              if (allPathsFromToNode != null) {
                for (let tempPath of allPathsFromToNode) {
                  if (includeGroups) {
                    // we need to add the group id to the path

                    if (tempPath.length > 0) {
                      const firstNodeId = tempPath[0];
                      const firstParentGroupId = this.getParentGroupId(firstNodeId);
                      const parentGroupId = this.getParentGroupId(nodeId);
                      if (parentGroupId != firstParentGroupId) {
                        /*
                         * the parent ids are different which means this is a boundary
                         * between two groups. for example if the project looked like
                         * group1>node1>node2>group2>node3>node4
                         * and the current node was node2 then the first node in the
                         * path would be node3 which means we would need to place
                         * group2 on the path before node3
                         */
                        tempPath.unshift(firstParentGroupId);
                      }
                    }
                  }

                  tempPath.unshift(nodeId);
                  allPaths.push(tempPath);
                }
              }
            } else {
              /*
               * the node is already in the path so far which means
               * the transition is looping back to a previous node.
               * we do not want to take this transition because
               * it will lead to an infinite loop. we will just
               * add the current node id to the path and not take
               * the transition which essentially ends the path.
               */
              path.push(nodeId);
              allPaths.push(path);
            }
          }
        }
      }

      if (pathSoFar.length > 0) {
        const lastNodeId = pathSoFar[pathSoFar.length - 1];
        if (this.isGroupNode(lastNodeId)) {
          /*
           * the last node id is a group id so we will remove it
           * since we are moving back up the path as we traverse
           * the nodes depth first
           */
          pathSoFar.pop();
        }
      }

      /*
       * remove the latest node id (this will be a step node id)
       * since we are moving back up the path as we traverse the
       * nodes depth first
       */
      pathSoFar.pop();

      if (includeGroups) {
        if (pathSoFar.length == 1) {
          /*
           * we are including groups and we have traversed
           * back up to the start node id for the project.
           * the only node id left in pathSoFar is now the
           * parent group of the start node id. we will
           * now add this parent group of the start node id
           * to all of the paths
           */

          for (let path of allPaths) {
            if (path != null) {
              /*
               * prepend the parent group of the start node id
               * to the path
               */
              path.unshift(pathSoFar[0]);
            }
          }

          /*
           * remove the parent group of the start node id from
           * pathSoFar which leaves us with an empty pathSoFar
           * which means we are completely done with
           * calculating all the paths
           */
          pathSoFar.pop();
        }
      }
    } else {
      /*
       * add the node id to the path so far so we can later check
       * which nodes are already in the path to prevent looping
       * back in the path
       */
      pathSoFar.push(nodeId);

      const groupNode = this.getNodeById(nodeId);
      if (groupNode != null) {
        const startId = groupNode.startId;
        if (startId == null || startId == '') {
          // there is no start id so we will take the transition from the group
          // TODO? there is no start id so we will loop through all the child nodes

          const transitions = this.getTransitionsByFromNodeId(groupNode.id);
          if (transitions.length > 0) {
            for (let transition of transitions) {
              if (transition != null) {
                const toNodeId = transition.to;

                const allPathsFromToNode = this.getAllPaths(pathSoFar, toNodeId, includeGroups);

                if (allPathsFromToNode != null) {
                  for (let tempPath of allPathsFromToNode) {
                    tempPath.unshift(nodeId);
                    allPaths.push(tempPath);
                  }
                }
              }
            }
          } else {
            /*
             * this activity does not have any transitions so
             * we have reached the end of this path
             */

            const tempPath = [];
            tempPath.unshift(nodeId);
            allPaths.push(tempPath);
          }
        } else {
          // there is a start id so we will traverse it

          const allPathsFromToNode = this.getAllPaths(pathSoFar, startId, includeGroups);

          if (allPathsFromToNode != null) {
            for (let tempPath of allPathsFromToNode) {
              tempPath.unshift(nodeId);
              allPaths.push(tempPath);
            }
          }
        }
      }

      /*
       * remove the latest node id since we are moving back
       * up the path as we traverse the nodes depth first
       */
      pathSoFar.pop();
    }
    return allPaths;
  }

  getStepNodeIds(): string[] {
    return this.getFlattenedProjectAsNodeIds().filter((nodeId: string) => {
      return this.isApplicationNode(nodeId);
    });
  }

  /**
   * Get the component by node id and component id
   * @param nodeId the node id
   * @param componentId the component id
   * @returns the component or null if the nodeId or componentId are null or does not exist
   */
  getComponent(nodeId: string, componentId: string): ComponentContent {
    const components = this.getComponents(nodeId);
    for (const component of components) {
      if (component.id === componentId) {
        return component;
      }
    }
    return null;
  }

  /**
   * Get the components in a node
   * @param nodeId the node id
   * @returns an array of components or empty array if nodeId is null or
   * doesn't exist in the project.
   * if the node exists but doesn't have any components, returns an empty array.
   */
  getComponents(nodeId: string): ComponentContent[] {
    const node = this.getNodeById(nodeId);
    if (node != null) {
      if (node.components != null) {
        return node.components;
      }
    }
    return [];
  }

  /**
   * Get the max score for the node
   * @param nodeId the node id which can be a step or an activity
   * @returns the max score for the node which can be null or a number
   * if null, author/teacher has not set a max score for the node
   */
  getMaxScoreForNode(nodeId: string): number {
    let maxScore = null;
    if (!this.isGroupNode(nodeId)) {
      const node = this.getNodeById(nodeId);
      for (const component of node.components) {
        if (!component.excludeFromTotalScore) {
          const componentMaxScore = component.maxScore;
          if (typeof componentMaxScore == 'number') {
            if (maxScore == null) {
              maxScore = componentMaxScore;
            } else {
              maxScore += componentMaxScore;
            }
          }
        }
      }
    }
    return maxScore;
  }

  getMaxScoreForComponent(nodeId: string, componentId: string): number {
    const component = this.getComponent(nodeId, componentId);
    if (component != null && !component.excludeFromTotalScore) {
      return component.maxScore;
    }
    return null;
  }

  /**
   * Get the message that describes how to satisfy the criteria
   * TODO: check if the criteria is satisfied
   * @param criteria the criteria object that needs to be satisfied
   * @returns the message to display to the student that describes how to
   * satisfy the criteria
   */
  getCriteriaMessage(criteria: any): string {
    let message = '';

    if (criteria != null) {
      const name = criteria.name;
      const params = criteria.params;

      if (name === 'isCompleted') {
        const nodeId = params.nodeId;
        if (nodeId != null) {
          const nodeTitle = this.getNodePositionAndTitle(nodeId);
          message += $localize`Complete <b>${nodeTitle}</b>`;
        }
      } else if (name === 'isVisited') {
        const nodeId = params.nodeId;
        if (nodeId != null) {
          const nodeTitle = this.getNodePositionAndTitle(nodeId);
          message += $localize`Visit <b>${nodeTitle}</b>`;
        }
      } else if (name === 'isCorrect') {
        const nodeId = params.nodeId;
        if (nodeId != null) {
          const nodeTitle = this.getNodePositionAndTitle(nodeId);
          message += $localize`Correctly answer <b>${nodeTitle}</b>`;
        }
      } else if (name === 'score') {
        const nodeId = params.nodeId;
        let nodeTitle = '';
        let scoresString = '';

        if (nodeId != null) {
          nodeTitle = this.getNodePositionAndTitle(nodeId);
        }

        const scores = params.scores;
        if (scores != null) {
          scoresString = scores.join(', ');
        }
        message += $localize`Obtain a score of <b>${scoresString}</b> on <b>${nodeTitle}</b>`;
      } else if (name === 'choiceChosen') {
        const nodeId = params.nodeId;
        const componentId = params.componentId;
        const choiceIds = params.choiceIds;
        let nodeTitle = this.getNodePositionAndTitle(nodeId);
        let choices = this.getChoiceText(nodeId, componentId, choiceIds);
        let choiceText = choices.join(', ');
        message += $localize`You must choose "${choiceText}" on "${nodeTitle}"`;
      } else if (name === 'usedXSubmits') {
        const nodeId = params.nodeId;
        let nodeTitle = '';

        const requiredSubmitCount = params.requiredSubmitCount;

        if (nodeId != null) {
          nodeTitle = this.getNodePositionAndTitle(nodeId);
        }

        if (requiredSubmitCount == 1) {
          message += $localize`Submit <b>${requiredSubmitCount}</b> time on <b>${nodeTitle}</b>`;
        } else {
          message += $localize`Submit <b>${requiredSubmitCount}</b> times on <b>${nodeTitle}</b>`;
        }
      } else if (name === 'branchPathTaken') {
        const fromNodeId = params.fromNodeId;
        const fromNodeTitle = this.getNodePositionAndTitle(fromNodeId);
        const toNodeId = params.toNodeId;
        const toNodeTitle = this.getNodePositionAndTitle(toNodeId);
        message += $localize`Take the branch path from <b>${fromNodeTitle}</b> to <b>${toNodeTitle}</b>`;
      } else if (name === 'wroteXNumberOfWords') {
        const nodeId = params.nodeId;
        if (nodeId != null) {
          const requiredNumberOfWords = params.requiredNumberOfWords;
          const nodeTitle = this.getNodePositionAndTitle(nodeId);
          message += $localize`Write <b>${requiredNumberOfWords}</b> words on <b>${nodeTitle}</b>`;
        }
      } else if (name === 'isVisible') {
        const nodeId = params.nodeId;
        if (nodeId != null) {
          const nodeTitle = this.getNodePositionAndTitle(nodeId);
          message += $localize`"${nodeTitle}" is visible`;
        }
      } else if (name === 'isVisitable') {
        const nodeId = params.nodeId;
        if (nodeId != null) {
          const nodeTitle = this.getNodePositionAndTitle(nodeId);
          message += $localize`"${nodeTitle}" is visitable`;
        }
      } else if (name === 'addXNumberOfNotesOnThisStep') {
        const nodeId = params.nodeId;
        const requiredNumberOfNotes = params.requiredNumberOfNotes;
        const nodeTitle = this.getNodePositionAndTitle(nodeId);
        if (requiredNumberOfNotes == 1) {
          message += $localize`Add <b>${requiredNumberOfNotes}</b> note on <b>${nodeTitle}</b>`;
        } else {
          message += $localize`Add <b>${requiredNumberOfNotes}</b> notes on <b>${nodeTitle}</b>`;
        }
      } else if (name === 'fillXNumberOfRows') {
        const requiredNumberOfFilledRows = params.requiredNumberOfFilledRows;
        const nodeId = params.nodeId;
        const nodeTitle = this.getNodePositionAndTitle(nodeId);
        if (requiredNumberOfFilledRows == 1) {
          message += $localize`You must fill in <b>${requiredNumberOfFilledRows}</b> row in the <b>Table</b> on <b>${nodeTitle}</b>`;
        } else {
          message += $localize`You must fill in <b>${requiredNumberOfFilledRows}</b> rows in the <b>Table</b> on <b>${nodeTitle}</b>`;
        }
      } else if (name === 'teacherRemoval') {
        message += $localize`Wait for your teacher to unlock the item`;
      }
    }
    return message;
  }

  /**
   * Get the choices of a Multiple Choice component.
   * @param nodeId The node id.
   * @param componentId The component id.
   * @return The choices from the component.
   */
  getChoices(nodeId: string, componentId: string): any[] {
    const component = this.getComponent(nodeId, componentId) as MultipleChoiceContent;
    return component.choices;
  }

  /**
   * Get the choice text for the given choice ids of a multiple choice component.
   * @param nodeId The node id of the component.
   * @param componentId The component id of the component.
   * @param choiceIds An array of choice ids.
   * @return An array of choice text strings.
   */
  getChoiceText(nodeId: string, componentId: string, choiceIds: string[]): string[] {
    const choicesText = [];
    for (const choice of this.getChoices(nodeId, componentId)) {
      if (choiceIds.indexOf(choice.id) != -1) {
        choicesText.push(choice.text);
      }
    }
    return choicesText;
  }

  /**
   * Get the start id of a group
   * @param nodeId get the start id of this group
   * @returns the start id of the group
   */
  getGroupStartId(nodeId: string): string {
    return this.getNodeById(nodeId).startId;
  }

  /**
   * Load the inactive nodes
   * @param nodes the inactive nodes
   */
  loadInactiveNodes(nodes: any[]): void {
    for (const node of nodes) {
      this.setIdToNode(node.id, node);
      if (node.type === 'group') {
        this.inactiveGroupNodes.push(node);
      } else {
        this.inactiveStepNodes.push(node);
      }
    }
  }

  shouldIncludeInTotalScore(nodeId: string, componentId: string): boolean {
    const component = this.getComponent(nodeId, componentId);
    return this.isNodeActive(nodeId) && component != null && !component.excludeFromTotalScore;
  }

  /**
   * Check if the target is active
   * @param target the node id or inactiveNodes/inactiveGroups to check
   * @returns whether the target is active
   */
  isActive(target: string): boolean {
    return target !== 'inactiveNodes' && target !== 'inactiveGroups' && this.isNodeActive(target);
  }

  /**
   * Check if a node is active.
   * @param nodeId the id of the node
   */
  isNodeActive(nodeId: string): boolean {
    for (const activeNode of this.project.nodes) {
      if (activeNode.id == nodeId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if a node generates work by looking at all of its components
   * @param nodeId the node id
   * @return whether the node generates work
   */
  nodeHasWork(nodeId: string): boolean {
    const node = this.getNodeById(nodeId);
    // TODO: remove need for component null check by ensuring that node always has components
    if (node.components != null) {
      for (const component of node.components) {
        if (this.componentHasWork(component)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if a component generates work
   * @param component check if this component generates work
   * @return whether the component generates work
   */
  componentHasWork(component: any): boolean {
    const componentService = this.componentServiceLookupService.getService(component.type);
    return componentService.componentHasWork(component);
  }

  calculateComponentIdToHasWork(
    components: ComponentContent[]
  ): { [componentId: string]: boolean } {
    const componentIdToHasWork: { [componentId: string]: boolean } = {};
    for (const component of components) {
      componentIdToHasWork[component.id] = this.componentHasWork(component);
    }
    return componentIdToHasWork;
  }

  getComponentType(nodeId: string, componentId: string): string {
    const component = this.getComponent(nodeId, componentId);
    return component.type;
  }

  /**
   * Check if a node is a branch start point
   * @param nodeId look for a branch with this start node id
   * @return whether the node is a branch start point
   */
  private isBranchStartPoint(nodeId: string): boolean {
    return this.getBranches().some((branch) => branch.startPoint === nodeId);
  }

  /**
   * Check if a node is a branch end point
   * @param nodeId look for a branch with this end node id
   * @return whether the node is a branch end point
   */
  private isBranchMergePoint(nodeId: string): boolean {
    return this.getBranches().some((branch) => branch.endPoint === nodeId);
  }

  /**
   * Get all the branches whose branch start point is the given node id
   * @param nodeId the branch start point
   * @return an array of branches that have the given branch start point
   */
  getBranchesByBranchStartPointNodeId(nodeId: string): Branch[] {
    return this.getBranches().filter((branch) => branch.startPoint === nodeId);
  }

  /**
   * Calculate the node numbers and set them into the nodeIdToNumber map
   * If the step is called "1.5 View the Potential Energy", then the node number is 1.5
   *
   * If this is a branching step that is called "1.5 B View the Potential Energy", then the
   * node number is 1.5 B
   */
  calculateNodeNumbers(): void {
    this.nodeIdToNumber = {};
    this.nodeIdToBranchPathLetter = {};
    const startNodeId = this.getStartNodeId();
    const currentActivityNumber = 0;
    const currentStepNumber = 0;
    this.calculateNodeNumbersHelper(startNodeId, currentActivityNumber, currentStepNumber);
  }

  /**
   * Recursively calculate the node numbers by traversing the project tree using transitions
   * @param nodeId the current node id we are on
   * @param currentActivityNumber the current activity number
   * @param currentStepNumber the current step number
   * @param branchLetterCode (optional) the character code for the branch letter e.g. 0=A, 1=B, etc.
   */
  private calculateNodeNumbersHelper(
    nodeId: string,
    currentActivityNumber: any,
    currentStepNumber: number,
    branchLetterCode: number = null
  ): number {
    if (this.isApplicationNode(nodeId)) {
      currentStepNumber = this.calculateNodeNumberForStep(
        nodeId,
        currentActivityNumber,
        currentStepNumber,
        branchLetterCode
      );
    } else {
      currentStepNumber = this.calculateNodeNumberForLesson(
        nodeId,
        currentActivityNumber,
        currentStepNumber,
        branchLetterCode
      );
    }
    return currentStepNumber;
  }

  private calculateNodeNumberForStep(
    nodeId: string,
    currentActivityNumber: any,
    currentStepNumber: number,
    branchLetterCode: number = null
  ): number {
    ({ currentActivityNumber, currentStepNumber, branchLetterCode } = this.getCurrentActivityNumber(
      nodeId,
      currentActivityNumber,
      currentStepNumber,
      branchLetterCode
    ));
    if (this.isBranchStartPoint(nodeId)) {
      currentStepNumber = this.calculateNodeNumberForBranchStartPoint(
        nodeId,
        currentActivityNumber,
        currentStepNumber
      );
    } else {
      currentStepNumber = this.calculateNodeNumberForRegularStep(
        nodeId,
        currentActivityNumber,
        currentStepNumber,
        branchLetterCode
      );
    }
    return currentStepNumber;
  }

  private getCurrentActivityNumber(
    nodeId: string,
    currentActivityNumber: any,
    currentStepNumber: number,
    branchLetterCode: number = null
  ): any {
    const parentGroup = this.getParentGroup(nodeId);
    if (parentGroup != null) {
      if (this.nodeIdToNumber[parentGroup.id] == null) {
        // the parent group has not been assigned a number so we will assign a number now
        currentActivityNumber = parseInt(currentActivityNumber) + 1;

        // set the current step number to 1 now that we have entered a new group
        currentStepNumber = 1;
        this.nodeIdToNumber[parentGroup.id] = '' + currentActivityNumber;
      } else {
        // the parent group has previously been assigned a number so we will use it
        currentActivityNumber = this.nodeIdToNumber[parentGroup.id];
      }
    }
    if (this.isBranchMergePoint(nodeId)) {
      // the node is a merge point so we will not use a letter anymore now that we are no longer in
      // a branch path
      branchLetterCode = null;
    }
    return { currentActivityNumber, currentStepNumber, branchLetterCode };
  }

  private calculateNodeNumberForBranchStartPoint(
    nodeId: string,
    currentActivityNumber: any,
    currentStepNumber: number
  ): number {
    this.nodeIdToNumber[nodeId] = currentActivityNumber + '.' + currentStepNumber;
    currentStepNumber++;
    let maxCurrentStepNumber = 0;
    const branchesByBranchStartPointNodeId = this.getBranchesByBranchStartPointNodeId(nodeId);
    const branches = branchesByBranchStartPointNodeId[0];
    const branchPaths = branches.paths;
    for (let branchPathNumber = 0; branchPathNumber < branchPaths.length; branchPathNumber++) {
      maxCurrentStepNumber = this.calculateBranchPathNodeNumbers(
        nodeId,
        currentActivityNumber,
        currentStepNumber,
        branchPaths[branchPathNumber],
        branchPathNumber,
        maxCurrentStepNumber
      );
    }
    currentStepNumber = maxCurrentStepNumber;
    this.calculateNodeNumbersHelper(branches.endPoint, currentActivityNumber, currentStepNumber);
    return currentStepNumber;
  }

  private calculateBranchPathNodeNumbers(
    nodeId: string,
    currentActivityNumber: any,
    currentStepNumber: number,
    branchPath: any,
    branchPathNumber: number,
    maxCurrentStepNumber: number
  ): number {
    // get the letter code e.g. 0=A, 1=B, etc.
    const branchLetterCode = branchPathNumber;
    let branchCurrentStepNumber = currentStepNumber;
    for (let bpn = 0; bpn < branchPath.length; bpn++) {
      if (bpn == 0) {
        if (this.getParentGroupId(nodeId) !== this.getParentGroupId(branchPath[bpn])) {
          branchCurrentStepNumber = 1;
        }
        // Calculate the node numbers for the steps in this branch path
        const branchPathNodeId = branchPath[bpn];
        branchCurrentStepNumber = this.calculateNodeNumbersHelper(
          branchPathNodeId,
          currentActivityNumber,
          branchCurrentStepNumber,
          branchLetterCode
        );
      }
      if (branchCurrentStepNumber > maxCurrentStepNumber) {
        maxCurrentStepNumber = branchCurrentStepNumber;
      }
    }
    return maxCurrentStepNumber;
  }

  private calculateNodeNumberForRegularStep(
    nodeId: string,
    currentActivityNumber: any,
    currentStepNumber: number,
    branchLetterCode: number = null
  ): number {
    // Check if we have already set the number for this node so that we don't need to unnecessarily
    // re-calculate the node number
    if (this.nodeIdToNumber[nodeId] == null) {
      this.setStepNodeNumber(nodeId, currentActivityNumber, currentStepNumber, branchLetterCode);
    } else {
      // We have calculated the node number before so we will return.
      // This will prevent infinite looping within the project.
      return currentStepNumber;
    }
    currentStepNumber++;
    const node = this.getNodeById(nodeId);
    const transitions = node.transitionLogic.transitions;
    if (transitions.length > 0) {
      currentStepNumber = this.calculateNodeNumberForRegularStepThatHasTransitions(
        nodeId,
        currentActivityNumber,
        currentStepNumber,
        branchLetterCode
      );
    } else {
      currentStepNumber = this.calculateNodeNumberForRegularStepThatDoesNotHaveTransitions(
        nodeId,
        currentActivityNumber,
        currentStepNumber,
        branchLetterCode
      );
    }
    return currentStepNumber;
  }

  private calculateNodeNumberForRegularStepThatHasTransitions(
    nodeId: string,
    currentActivityNumber: any,
    currentStepNumber: number,
    branchLetterCode: number = null
  ) {
    const node = this.getNodeById(nodeId);
    for (const transition of node.transitionLogic.transitions) {
      if (!this.isBranchMergePoint(transition.to)) {
        if (this.getParentGroupId(nodeId) !== this.getParentGroupId(transition.to)) {
          currentStepNumber = 1;
        }
        currentStepNumber = this.calculateNodeNumbersHelper(
          transition.to,
          currentActivityNumber,
          currentStepNumber,
          branchLetterCode
        );
      }
    }
    return currentStepNumber;
  }

  private calculateNodeNumberForRegularStepThatDoesNotHaveTransitions(
    nodeId: string,
    currentActivityNumber: any,
    currentStepNumber: number,
    branchLetterCode: number = null
  ): number {
    const parentGroup = this.getParentGroup(nodeId);
    if (parentGroup.transitionLogic?.transitions != null) {
      for (const transition of parentGroup.transitionLogic.transitions) {
        currentStepNumber = this.calculateNodeNumbersHelper(
          transition.to,
          currentActivityNumber,
          currentStepNumber,
          branchLetterCode
        );
      }
    }
    return currentStepNumber;
  }

  private setStepNodeNumber(
    nodeId: string,
    currentActivityNumber: any,
    currentStepNumber: number,
    branchLetterCode: number
  ) {
    let number = null;
    if (branchLetterCode == null) {
      number = currentActivityNumber + '.' + currentStepNumber;
    } else {
      const branchLetter = String.fromCharCode(65 + branchLetterCode);
      number = `${currentActivityNumber}.${currentStepNumber} ${branchLetter}`;
      this.nodeIdToBranchPathLetter[nodeId] = branchLetter;
    }
    this.nodeIdToNumber[nodeId] = number;
  }

  private calculateNodeNumberForLesson(
    nodeId: string,
    currentActivityNumber: any,
    currentStepNumber: number,
    branchLetterCode: number = null
  ): number {
    // check if the group has previously been assigned a number
    if (this.nodeIdToNumber[nodeId] == null) {
      ({ currentActivityNumber, currentStepNumber } = this.setLessonNodeNumber(
        nodeId,
        currentActivityNumber,
        currentStepNumber
      ));
    } else {
      // We have calculated the node number before so we will return.
      // This will prevent infinite looping within the project.
      return currentStepNumber;
    }
    const node = this.getNodeById(nodeId);
    if (node.startId != '') {
      // calculate the node number for the first step in this activity and any steps after it
      this.calculateNodeNumbersHelper(
        node.startId,
        currentActivityNumber,
        currentStepNumber,
        branchLetterCode
      );
    } else {
      // this activity doesn't have a start step so we will look for a transition
      for (const transition of node.transitionLogic.transitions) {
        // calculate the node number for the next node and all its children steps
        this.calculateNodeNumbersHelper(
          transition.to,
          currentActivityNumber,
          currentStepNumber,
          branchLetterCode
        );
      }
    }
    return currentStepNumber;
  }

  private setLessonNodeNumber(
    nodeId: string,
    currentActivityNumber: any,
    currentStepNumber: number
  ): any {
    // the group has not been assigned a number so we will assign a number now/
    if (nodeId == 'group0') {
      // group 0 will always be given the activity number of 0
      this.nodeIdToNumber[nodeId] = '0';
    } else {
      // set the current step number to 1 now that we have entered a new group
      currentStepNumber = 1;
      currentActivityNumber = parseInt(currentActivityNumber) + 1;
      this.nodeIdToNumber[nodeId] = '' + currentActivityNumber;
    }
    return { currentActivityNumber, currentStepNumber };
  }

  getProjectScript(): any {
    return this.project.script;
  }

  /**
   * Get the next node after the specified node
   * @param nodeId get the node id that comes after this one
   * @return the node id that comes after
   */
  getNextNodeId(nodeId: string): string {
    const flattenedNodeIds = this.getFlattenedProjectAsNodeIds();
    if (flattenedNodeIds != null) {
      const indexOfNodeId = flattenedNodeIds.indexOf(nodeId);
      if (indexOfNodeId != -1) {
        const indexOfNextNodeId = indexOfNodeId + 1;
        return flattenedNodeIds[indexOfNextNodeId];
      }
    }
    return null;
  }

  /**
   * Get all the projectAchievements object in the project. The projectAchievements object
   * contains the isEnabled field and an array of items.
   * @return the achievement object
   */
  getAchievements(): any {
    if (this.project.achievements == null) {
      this.project.achievements = {
        isEnabled: false,
        items: []
      };
    }
    return this.project.achievements;
  }

  /**
   * Get the achievement items in the project
   * @return the achievement items
   */
  getAchievementItems(): any[] {
    const achievements = this.getAchievements();
    if (achievements.items == null) {
      achievements.items = [];
    }
    return achievements.items;
  }

  /**
   * Get an achievement by the 10 character alphanumeric achievement id
   * @param achievementId the 10 character alphanumeric achievement id
   * @return the achievement with the given achievement id
   */
  getAchievementByAchievementId(achievementId: string): any {
    if (achievementId != null) {
      const achievements = this.getAchievements();
      if (achievements != null) {
        const achievementItems = achievements.items;
        if (achievementItems != null) {
          for (let achievement of achievementItems) {
            if (achievement != null && achievement.id == achievementId) {
              return achievement;
            }
          }
        }
      }
    }
    return null;
  }

  getSpaces(): any[] {
    if (this.project.spaces != null) {
      return this.project.spaces;
    } else {
      return [];
    }
  }

  isSpaceExists(id: string): boolean {
    const spaces = this.getSpaces();
    for (let space of spaces) {
      if (space.id === id) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns true iff the specified node and component has any registered
   * additionalProcessingFunctions
   * @param nodeId the node id
   * @param componentId the component id
   * @returns true/false
   */
  hasAdditionalProcessingFunctions(nodeId: string, componentId: string): boolean {
    return this.getAdditionalProcessingFunctions(nodeId, componentId) != null;
  }

  /**
   * Returns an array of registered additionalProcessingFunctions for the specified node and
   * component
   * @param nodeId the node id
   * @param componentId the component id
   * @returns an array of additionalProcessingFunctions
   */
  getAdditionalProcessingFunctions(nodeId: string, componentId: string): any {
    return this.additionalProcessingFunctionsMap[`${nodeId}_${componentId}`];
  }

  replaceNode(nodeId: string, node: any): void {
    this.setIdToNode(nodeId, node);
    const nodes = this.getNodes();
    for (let n = 0; n < nodes.length; n++) {
      if (nodeId === nodes[n].id) {
        nodes.splice(n, 1, node);
        break;
      }
    }
    for (let a = 0; a < this.applicationNodes.length; a++) {
      if (nodeId === this.applicationNodes[a].id) {
        this.applicationNodes.splice(a, 1, node);
      }
    }
  }

  retrieveScript(scriptFilename: string): any {
    return Promise.resolve('');
  }

  getNotificationByScore(component: any, previousScore: number, currentScore: number): any {}

  isConnectedComponent(nodeId: string, componentId: string, connectedComponentId: string): boolean {
    return false;
  }

  getConnectedComponentParams(componentContent: any, componentId: string): any {}

  getTags(): any[] {
    let tags = [];
    const nodes = this.getNodes();
    for (const node of nodes) {
      tags = tags.concat(this.getTagsFromNode(node));
    }
    return tags;
  }

  getTagsFromNode(node: any): any[] {
    const tags = [];
    const transitions = this.getTransitionsFromNode(node);
    for (const transition of transitions) {
      const criteriaArray = this.getCriteriaArrayFromTransition(transition);
      for (const singleCriteria of criteriaArray) {
        const tag = this.getTagFromSingleCriteria(singleCriteria);
        if (tag != null) {
          tags.push(tag);
        }
      }
    }
    return tags;
  }

  getTransitionsFromNode(node: any): Transition[] {
    const transitionLogic = node.transitionLogic;
    if (transitionLogic == null) {
      return [];
    } else {
      return node.transitionLogic.transitions;
    }
  }

  getCriteriaArrayFromTransition(transition: Transition): any[] {
    if (transition.criteria == null) {
      return [];
    } else {
      return transition.criteria;
    }
  }

  getTagFromSingleCriteria(singleCriteria: any): any {
    const params = singleCriteria.params;
    if (params == null) {
      return null;
    } else {
      return this.getTagFromParams(params);
    }
  }

  getTagFromParams(params: any): any {
    if (params.tag == null) {
      return null;
    } else {
      return { name: params['tag'] };
    }
  }

  broadcastProjectParsed(): void {
    this.projectParsedSource.next();
  }

  getPeerGroupings(): PeerGrouping[] {
    if (this.project.peerGroupings == null) {
      this.project.peerGroupings = [];
    }
    return this.project.peerGroupings;
  }

  getPeerGrouping(tag: string): PeerGrouping {
    return this.getPeerGroupings().find((peerGrouping: PeerGrouping) => peerGrouping.tag === tag);
  }

  getProjectRootNode(): any {
    return this.rootNode;
  }

  /**
   * Get the reference component from a field in the component content
   * @param nodeId the node id
   * @param componentId the component id
   * @param fieldName the name of the object that contains a referenceComponent object
   * In this example the fieldName would be 'dynamicPrompt'
   * {
   *   id: 'component2',
   *   dynamicPrompt: {
   *     referenceComponent: {
   *       nodeId: 'node1',
   *       componentId: 'component1'
   *     }
   *   }
   * }
   * @returns the referenceComponent object from a component
   */
  getReferenceComponentForField(
    nodeId: string,
    componentId: string,
    fieldName: 'dynamicPrompt' | 'questionBank'
  ): ReferenceComponent {
    const component = this.getComponent(nodeId, componentId);
    return component[fieldName]?.referenceComponent;
  }

  getReferenceComponent(content: QuestionBank | DynamicPrompt): Component {
    const nodeId = content.getReferenceNodeId();
    const componentId = content.getReferenceComponentId();
    return new Component(this.getComponent(nodeId, componentId), nodeId);
  }
}
