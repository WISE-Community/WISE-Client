import { ComponentStatus } from '../../../../common/ComponentStatus';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

export function calculateComponentVisibility(
  nodeId: string,
  componentStatuses: { [componentId: string]: ComponentStatus },
  projectService: TeacherProjectService
): { [componentId: string]: boolean } {
  const componentIdToIsVisible = {};
  for (const component of projectService.getComponents(nodeId)) {
    componentIdToIsVisible[component.id] =
      projectService.componentHasWork(component) &&
      isComponentVisibleToStudent(componentStatuses, component.id);
  }
  return componentIdToIsVisible;
}

function isComponentVisibleToStudent(
  componentStatuses: { [componentId: string]: ComponentStatus } = {},
  componentId: string
): boolean {
  const componentStatus = componentStatuses[componentId];
  return componentStatus == null || componentStatus.isVisible;
}
