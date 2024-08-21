import { Injectable } from '@angular/core';
import { TeacherProjectService } from './teacherProjectService';
import { ComponentServiceLookupService } from './componentServiceLookupService';
import { Node } from '../common/Node';

@Injectable()
export class CreateComponentService {
  constructor(
    private componentServiceLookupService: ComponentServiceLookupService,
    private projectService: TeacherProjectService
  ) {}

  /**
   * Create a new component
   * @param nodeId the node id to create the component in
   * @param componentType the component type
   * @param insertAfterComponentId Insert the new component after the given
   * component id. If this argument is null, we will place the new component
   * in the first position.
   */
  create(nodeId: string, componentType: string, insertAfterComponentId: string = null): any {
    const node = this.projectService.getNode(nodeId);
    const service = this.componentServiceLookupService.getService(componentType);
    const component = service.createComponent();
    if (service.componentHasWork(component)) {
      if (node.showSaveButton == false) {
        if (this.projectService.doesAnyComponentInNodeShowSubmitButton(node.id)) {
          component.showSaveButton = true;
        } else {
          node.showSaveButton = true;
        }
      }
    }
    this.addComponentToNode(node, component, insertAfterComponentId);
    return component;
  }

  private addComponentToNode(node: Node, component: any, insertAfterComponentId: string): void {
    const insertPosition =
      insertAfterComponentId == null
        ? 0
        : node.components.findIndex((c) => c.id === insertAfterComponentId) + 1;
    node.components.splice(insertPosition, 0, component);
  }
}
