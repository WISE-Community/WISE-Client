import { Injectable } from '@angular/core';
import { TeacherProjectService } from './teacherProjectService';
import { UtilService } from './utilService';

@Injectable()
export class CopyComponentService {
  constructor(
    protected ProjectService: TeacherProjectService,
    protected UtilService: UtilService
  ) {}

  copyComponents(nodeId: string, componentIds: string[]): any[] {
    const newComponents = [];
    const newComponentIds = [];
    for (const componentId of componentIds) {
      const newComponent = this.copyComponent(nodeId, componentId, newComponentIds);
      newComponents.push(newComponent);
      newComponentIds.push(newComponent.id);
    }
    return newComponents;
  }

  private copyComponent(nodeId: string, componentId: string, componentIdsToSkip: string[]): any {
    const component = this.ProjectService.getComponent(nodeId, componentId);
    const newComponent = this.UtilService.makeCopyOfJSONObject(component);
    newComponent.id = this.ProjectService.getUnusedComponentId(componentIdsToSkip);
    return newComponent;
  }
}
