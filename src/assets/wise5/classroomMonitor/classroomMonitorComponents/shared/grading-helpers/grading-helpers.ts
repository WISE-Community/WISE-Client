import { ComponentContent } from '../../../../common/ComponentContent';
import { ComponentStatus } from '../../../../common/ComponentStatus';

export function calculateComponentVisibility(
  components: ComponentContent[],
  componentIdToHasWork: { [componentId: string]: boolean },
  componentStatuses: { [componentId: string]: ComponentStatus }
): { [componentId: string]: boolean } {
  const componentIdToIsVisible = {};
  for (const component of components) {
    componentIdToIsVisible[component.id] =
      componentIdToHasWork[component.id] &&
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
