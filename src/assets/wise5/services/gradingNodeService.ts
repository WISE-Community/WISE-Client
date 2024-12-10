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
      if (nextNodeId) {
        if (this.ProjectService.nodeHasWork(nextNodeId)) {
          return nextNodeId;
        } else {
          return this.getNextNodeId(nextNodeId);
        }
      } else {
        return null;
      }
    });
  }

  /**
   * Go to the next node that captures work
   * @return a promise that will return the next node id
   */
  goToNextNode(): Promise<string> {
    return this.getNextNodeId().then((nextNodeId: string) => {
      if (nextNodeId) {
        this.setCurrentNode(nextNodeId);
      }
      return nextNodeId;
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
    if (prevNodeId) {
      if (this.ProjectService.nodeHasWork(prevNodeId)) {
        return prevNodeId;
      } else {
        return this.getPrevNodeId(prevNodeId);
      }
    } else {
      return null;
    }
  }
}
