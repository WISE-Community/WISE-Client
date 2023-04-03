import { Injectable } from '@angular/core';
import { ComponentServiceLookupService } from './componentServiceLookupService';
import { ProjectService } from './projectService';
import { StudentDataService } from './studentDataService';

@Injectable()
export class CompletionService {
  constructor(
    private componentServiceLookupService: ComponentServiceLookupService,
    private dataService: StudentDataService,
    protected projectService: ProjectService
  ) {}

  /**
   * Check if the given node or component is completed
   * @param nodeId the node id
   * @param componentId (optional) the component id
   * @returns whether the node or component is completed
   */
  isCompleted(nodeId: string, componentId: string = null): boolean {
    let result = false;
    if (nodeId && componentId) {
      result = this.isComponentCompleted(nodeId, componentId);
    } else if (this.projectService.isGroupNode(nodeId)) {
      result = this.isGroupNodeCompleted(nodeId);
    } else if (this.projectService.isApplicationNode(nodeId)) {
      result = this.isStepNodeCompleted(nodeId);
    }
    return result;
  }

  private isComponentCompleted(nodeId: string, componentId: string): boolean {
    const component = this.projectService.getComponent(nodeId, componentId);
    if (component != null) {
      const node = this.projectService.getNodeById(nodeId);
      const componentType = component.type;
      const service = this.componentServiceLookupService.getService(componentType);
      if (['OpenResponse', 'Discussion'].includes(componentType)) {
        return service.isCompletedV2(node, component, this.dataService.studentData);
      } else {
        const componentStates = this.dataService.getComponentStatesByNodeIdAndComponentId(
          nodeId,
          componentId
        );
        const nodeEvents = this.dataService.getEventsByNodeId(nodeId);
        return service.isCompleted(component, componentStates, nodeEvents, node);
      }
    }
    return false;
  }

  private isStepNodeCompleted(nodeId: string): boolean {
    let result = true;
    const components = this.projectService.getComponents(nodeId);
    for (const component of components) {
      const isComponentCompleted = this.isComponentCompleted(nodeId, component.id);
      result = result && isComponentCompleted;
    }
    return result;
  }

  private isGroupNodeCompleted(nodeId: string): boolean {
    let result = true;
    const nodeIds = this.projectService.getChildNodeIdsById(nodeId);
    for (const id of nodeIds) {
      if (
        this.dataService.nodeStatuses[id] == null ||
        !this.dataService.nodeStatuses[id].isVisible ||
        !this.dataService.nodeStatuses[id].isCompleted
      ) {
        result = false;
        break;
      }
    }
    return result;
  }
}
