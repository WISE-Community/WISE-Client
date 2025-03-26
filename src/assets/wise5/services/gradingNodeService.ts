import { Injectable } from '@angular/core';
import { TeacherNodeService } from './teacherNodeService';

@Injectable()
export class GradingNodeService extends TeacherNodeService {
  getNextNodeId(currentId = null): Promise<string> {
    return super.getNextNodeId(currentId).then((nextNodeId: string) => {
      if (!nextNodeId) return null;
      return this.projectService.nodeHasWork(nextNodeId)
        ? nextNodeId
        : this.getNextNodeId(nextNodeId);
    });
  }

  getPrevNodeId(currentId = null) {
    const prevNodeId = super.getPrevNodeId(currentId);
    if (!prevNodeId) return null;
    return this.projectService.nodeHasWork(prevNodeId)
      ? prevNodeId
      : this.getPrevNodeId(prevNodeId);
  }
}
