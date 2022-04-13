import { Injectable } from '@angular/core';
import { TeacherProjectService } from './teacherProjectService';

@Injectable()
export class InsertComponentService {
  constructor(protected ProjectService: TeacherProjectService) {}

  insertComponents(components: any[], nodeId: string, insertAfterComponentId: string): void {
    const node = this.ProjectService.getNodeById(nodeId);
    let insertPosition = this.getInitialInsertPosition(nodeId, insertAfterComponentId);
    components.forEach((component) => {
      node.components.splice(insertPosition, 0, component);
      insertPosition++;
    });
  }

  private getInitialInsertPosition(nodeId: string, insertAfterComponentId: string): number {
    return insertAfterComponentId == null
      ? 0
      : this.ProjectService.getComponentPositionByNodeIdAndComponentId(
          nodeId,
          insertAfterComponentId
        ) + 1;
  }
}
