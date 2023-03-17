import { Injectable } from '@angular/core';
import { NodeStatus } from '../common/NodeStatus';
import { ConstraintService } from './constraintService';
import { NotebookService } from './notebookService';
import { ProjectService } from './projectService';
import { StudentDataService } from './studentDataService';

@Injectable()
export class NodeStatusService {
  constructor(
    private constraintService: ConstraintService,
    private notebookService: NotebookService,
    private projectService: ProjectService,
    private dataService: StudentDataService
  ) {
    this.dataService.updateNodeStatuses$.subscribe(() => {
      this.updateNodeStatuses();
    });
    this.notebookService.notebookUpdated$.subscribe(() => {
      this.updateNodeStatuses();
    });
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
    for (const node of this.projectService.getNodes()) {
      if (!this.projectService.isGroupNode(node.id)) {
        this.updateNodeStatusByNode(node);
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
    nodeStatus.isCompleted = this.dataService.isCompleted(nodeId);
    nodeStatus.isVisited = this.dataService.isNodeVisited(nodeId);
    return nodeStatus;
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
    const oldNodeStatus = this.getNodeStatusByNodeId(nodeId);
    if (oldNodeStatus == null) {
      this.setNodeStatusByNodeId(nodeId, nodeStatus);
    } else {
      this.dataService.nodeStatuses[nodeId].isVisited = nodeStatus.isVisited;
      this.dataService.nodeStatuses[nodeId].isVisible = nodeStatus.isVisible;
      this.dataService.nodeStatuses[nodeId].isVisitable = nodeStatus.isVisitable;
      this.dataService.nodeStatuses[nodeId].isCompleted = nodeStatus.isCompleted;
    }
  }

  private setNodeStatusByNodeId(nodeId: string, nodeStatus: NodeStatus): void {
    this.dataService.nodeStatuses[nodeId] = nodeStatus;
  }

  private updateNodeStatusProgress(nodeId: string): void {
    this.dataService.nodeStatuses[nodeId].progress = this.dataService.getNodeProgressById(nodeId);
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
