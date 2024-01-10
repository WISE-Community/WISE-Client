import { Injectable } from '@angular/core';
import { ComponentStatus } from '../common/ComponentStatus';
import { NodeStatus } from '../common/NodeStatus';
import { ConstraintService } from './constraintService';
import { NodeProgressService } from './nodeProgressService';
import { NotebookService } from './notebookService';
import { ProjectService } from './projectService';
import { StudentDataService } from './studentDataService';
import { CompletionService } from './completionService';

@Injectable()
export class NodeStatusService {
  private nodeIdToIsVisited: { [nodeId: string]: boolean } = {};

  constructor(
    private completionService: CompletionService,
    private constraintService: ConstraintService,
    private dataService: StudentDataService,
    private nodeProgressService: NodeProgressService,
    private notebookService: NotebookService,
    private projectService: ProjectService
  ) {
    this.constraintService.constraintsUpdated$.subscribe(() => {
      this.updateNodeStatuses();
    });
    this.dataService.dataRetrieved$.subscribe((studentData) => {
      this.populateNodeIdToIsVisited(studentData.events);
      this.updateNodeStatuses();
    });
    this.dataService.updateNodeStatuses$.subscribe(() => {
      this.updateNodeStatuses();
    });
    this.notebookService.notebookUpdated$.subscribe(() => {
      this.updateNodeStatuses();
    });
  }

  private populateNodeIdToIsVisited(events: any[]): void {
    events
      .filter((event) => event.event === 'nodeEntered')
      .forEach((event) => this.setNodeIsVisited(event.nodeId));
  }

  setNodeIsVisited(nodeId: string): void {
    this.nodeIdToIsVisited[nodeId] = true;
  }

  canVisitNode(nodeId: string): boolean {
    const nodeStatus = this.getNodeStatusByNodeId(nodeId);
    return nodeStatus != null && nodeStatus.isVisitable;
  }

  getNodeStatusByNodeId(nodeId: string): any {
    // TODO: move nodeStatus from StudentDataService to this class
    return this.dataService.getNodeStatusByNodeId(nodeId);
  }

  getNodeStatuses(): any {
    return this.dataService.nodeStatuses;
  }

  private updateNodeStatuses(): void {
    this.updateStepNodeStatuses();
    this.updateGroupNodeStatuses();
    this.dataService.broadcastNodeStatusesChanged();
  }

  private updateStepNodeStatuses(): void {
    for (const nodeId of this.projectService.getFlattenedProjectAsNodeIds()) {
      if (!this.projectService.isGroupNode(nodeId)) {
        this.updateNodeStatusByNode(this.projectService.getNodeById(nodeId));
      }
    }
  }

  private updateGroupNodeStatuses(): void {
    const groups = this.projectService.getGroups();
    for (const group of groups) {
      group.depth = this.projectService.getNodeDepth(group.id, 0);
    }
    groups.sort(function (a, b) {
      return b.depth - a.depth;
    });
    for (const group of groups) {
      this.updateNodeStatusByNode(group);
    }
  }

  private updateNodeStatusByNode(node: any): void {
    const nodeId = node.id;
    const nodeStatus = this.calculateNodeStatus(node);
    this.updateNodeStatus(nodeId, nodeStatus);
    this.updateNodeStatusProgress(nodeId);
    this.updateNodeStatusIcon(nodeId);
    this.updateNodeStatusTimestamps(nodeId);
  }

  private calculateNodeStatus(node: any): NodeStatus {
    const nodeId = node.id;
    const nodeStatus = new NodeStatus(nodeId);
    const constraintsForNode = this.constraintService.getConstraintsThatAffectNode(node);
    const constraintResults = this.constraintService.evaluate(constraintsForNode);
    nodeStatus.isVisible = constraintResults.isVisible;
    nodeStatus.isVisitable = constraintResults.isVisitable;
    this.setNotVisibleIfRequired(nodeId, constraintsForNode, nodeStatus);
    if (this.projectService.isApplicationNode(node.id)) {
      nodeStatus.componentStatuses = this.calculateComponentStatuses(node);
      nodeStatus.isCompleted = this.isAllVisibleComponentsCompleted(nodeStatus.componentStatuses);
    } else {
      nodeStatus.isCompleted = this.completionService.isCompleted(nodeId);
    }
    nodeStatus.isVisited = this.nodeIdToIsVisited[nodeId] == true;
    return nodeStatus;
  }

  private isAllVisibleComponentsCompleted(componentStatuses: {
    [componentId: string]: ComponentStatus;
  }): boolean {
    for (const componentId in componentStatuses) {
      if (componentStatuses[componentId].isVisibleAndNotCompleted()) {
        return false;
      }
    }
    return true;
  }

  private calculateComponentStatuses(node: any): { [componentId: string]: ComponentStatus } {
    const componentStatuses = {};
    node.components.forEach((component) => {
      componentStatuses[component.id] = new ComponentStatus(
        this.completionService.isCompleted(node.id, component.id),
        this.constraintService.evaluate(component.constraints).isVisible
      );
    });
    return componentStatuses;
  }

  private setNotVisibleIfRequired(
    nodeId: string,
    constraintsForNode: any[],
    nodeStatus: any
  ): void {
    if (
      constraintsForNode.length == 0 &&
      this.projectService.getFlattenedProjectAsNodeIds().indexOf(nodeId) == -1 &&
      !this.projectService.isGroupNode(nodeId)
    ) {
      nodeStatus.isVisible = false;
    }
  }

  private updateNodeStatus(nodeId: string, nodeStatus: NodeStatus): void {
    // TODO: figure out why we need this if-else check. Why not just over-write the NodeStatus?
    const oldNodeStatus = this.getNodeStatusByNodeId(nodeId);
    if (oldNodeStatus == null) {
      this.setNodeStatusByNodeId(nodeId, nodeStatus);
    } else {
      this.dataService.nodeStatuses[nodeId].isVisited = nodeStatus.isVisited;
      this.dataService.nodeStatuses[nodeId].isVisible = nodeStatus.isVisible;
      this.dataService.nodeStatuses[nodeId].isVisitable = nodeStatus.isVisitable;
      this.dataService.nodeStatuses[nodeId].isCompleted = nodeStatus.isCompleted;
      if (this.projectService.isApplicationNode(nodeId)) {
        this.dataService.nodeStatuses[nodeId].componentStatuses = nodeStatus.componentStatuses;
      }
    }
  }

  private setNodeStatusByNodeId(nodeId: string, nodeStatus: NodeStatus): void {
    this.dataService.nodeStatuses[nodeId] = nodeStatus;
  }

  private updateNodeStatusProgress(nodeId: string): void {
    this.dataService.nodeStatuses[nodeId].progress = this.nodeProgressService.getNodeProgress(
      nodeId,
      this.getNodeStatuses()
    );
  }

  private updateNodeStatusIcon(nodeId: string): void {
    this.dataService.nodeStatuses[nodeId].icon = this.projectService.getNode(nodeId).getIcon();
  }

  private updateNodeStatusTimestamps(nodeId: string): void {
    const latestComponentStatesForNode = this.dataService.getLatestComponentStateByNodeId(nodeId);
    if (latestComponentStatesForNode != null) {
      this.updateNodeStatusClientSaveTime(nodeId, latestComponentStatesForNode);
      this.updateNodeStatusServerSaveTime(nodeId, latestComponentStatesForNode);
    }
  }

  private updateNodeStatusClientSaveTime(nodeId: string, latestComponentStatesForNode: any): void {
    this.dataService.nodeStatuses[nodeId].latestComponentStateClientSaveTime =
      latestComponentStatesForNode.clientSaveTime;
  }

  private updateNodeStatusServerSaveTime(nodeId: string, latestComponentStatesForNode: any): void {
    this.dataService.nodeStatuses[nodeId].latestComponentStateServerSaveTime =
      latestComponentStatesForNode.serverSaveTime;
  }
}
