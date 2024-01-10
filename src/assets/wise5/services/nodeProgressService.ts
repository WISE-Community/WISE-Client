import { Injectable } from '@angular/core';
import { NodeProgress } from '../common/NodeProgress';
import { ProjectService } from './projectService';

@Injectable()
export class NodeProgressService {
  constructor(protected projectService: ProjectService) {}

  /**
   * Get progress information for a given node
   * @param nodeId the node id
   * @param nodeStatuses all the NodeStatuses for the student
   * @returns object with number of completed items (both all and for items that capture student
   * work), number of visible items (all/with work), completion % (for all items, items with student
   * work)
   */
  getNodeProgress(nodeId: string, nodeStatuses: any): NodeProgress {
    const progress: NodeProgress = {
      totalItems: 0,
      totalItemsWithWork: 0,
      completedItems: 0,
      completedItemsWithWork: 0
    };
    if (this.projectService.isGroupNode(nodeId)) {
      for (const childNodeId of this.projectService.getChildNodeIdsById(nodeId)) {
        if (this.projectService.isGroupNode(childNodeId)) {
          this.updateGroupNodeProgress(childNodeId, progress, nodeStatuses);
        } else {
          this.updateStepNodeProgress(childNodeId, progress, nodeStatuses);
        }
      }
      this.calculateAndInjectCompletionPercentage(progress);
      this.calculateAndInjectCompletionPercentageWithWork(progress);
    }
    // TODO: implement for steps (using components instead of child nodes)?
    return progress;
  }

  private updateGroupNodeProgress(
    nodeId: string,
    progress: NodeProgress,
    nodeStatuses: any
  ): NodeProgress {
    const nodeStatus = nodeStatuses[nodeId];
    if (nodeStatus.progress.totalItemsWithWork > -1) {
      progress.completedItems += nodeStatus.progress.completedItems;
      progress.totalItems += nodeStatus.progress.totalItems;
      progress.completedItemsWithWork += nodeStatus.progress.completedItemsWithWork;
      progress.totalItemsWithWork += nodeStatus.progress.totalItemsWithWork;
    } else {
      // we have a legacy node status so we'll need to calculate manually
      const groupProgress = this.getNodeProgress(nodeId, nodeStatuses);
      progress.completedItems += groupProgress.completedItems;
      progress.totalItems += groupProgress.totalItems;
      progress.completedItemsWithWork += groupProgress.completedItemsWithWork;
      progress.totalItemsWithWork += groupProgress.totalItemsWithWork;
    }
    return progress;
  }

  private updateStepNodeProgress(
    nodeId: string,
    progress: NodeProgress,
    nodeStatuses: any
  ): NodeProgress {
    const nodeStatus = nodeStatuses[nodeId];
    if (nodeStatus.isVisible) {
      progress.totalItems++;
      const hasWork = this.projectService.nodeHasWork(nodeId);
      if (hasWork) {
        progress.totalItemsWithWork++;
      }
      if (nodeStatus.isCompleted) {
        progress.completedItems++;
        if (hasWork) {
          progress.completedItemsWithWork++;
        }
      }
    }
    return progress;
  }

  private calculateAndInjectCompletionPercentage(progress: NodeProgress): void {
    const totalItems = progress.totalItems;
    const completedItems = progress.completedItems;
    progress.completionPct = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;
  }

  private calculateAndInjectCompletionPercentageWithWork(progress: NodeProgress): void {
    const totalItemsWithWork = progress.totalItemsWithWork;
    const completedItemsWithWork = progress.completedItemsWithWork;
    progress.completionPctWithWork = totalItemsWithWork
      ? Math.round((completedItemsWithWork / totalItemsWithWork) * 100)
      : 0;
  }
}
