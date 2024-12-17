import { Injectable } from '@angular/core';
import { TeacherNodeService } from './teacherNodeService';

@Injectable()
export class GradingNodeService extends TeacherNodeService {
  /**
   * Get the next node id in the project sequence that captures student work
   * @param currentId (optional)
   * @returns next node id
   */
  getNextNodeId(currentId = null): Promise<string> {
    return super.getNextNodeId(currentId).then((nextNodeId: string) => {
      if (!nextNodeId) return null;
      return this.projectService.nodeHasWork(nextNodeId)
        ? nextNodeId
        : this.getNextNodeId(nextNodeId);
    });
  }

  /**
   * Go to the previous node that captures work
   */
  goToPrevNode(): void {
    this.setCurrentNode(this.getPrevNodeId());
  }

  /**
   * Get the previous node id in the project sequence that captures student work
   * @param currentId (optional)
   * @returns next node id
   */
  getPrevNodeId(currentId = null) {
    const prevNodeId = super.getPrevNodeId(currentId);
    if (!prevNodeId) return null;
    return this.projectService.nodeHasWork(prevNodeId)
      ? prevNodeId
      : this.getPrevNodeId(prevNodeId);
  }
}
