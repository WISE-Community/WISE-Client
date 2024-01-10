import { ComponentStatus } from '../../../../common/ComponentStatus';

export function calculateComponentVisibility(
  componentIdToHasWork: { [componentId: string]: boolean },
  componentStatuses: { [componentId: string]: ComponentStatus }
): { [componentId: string]: boolean } {
  const componentIdToIsVisible = {};
  for (const componentId in componentIdToHasWork) {
    componentIdToIsVisible[componentId] =
      componentIdToHasWork[componentId] &&
      isComponentVisibleToStudent(componentStatuses, componentId);
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
