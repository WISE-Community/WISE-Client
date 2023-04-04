export function isComponentVisibleToStudent(nodeStatus: any, component: any): boolean {
  let result = true;
  if (nodeStatus.componentStatuses != null) {
    const componentStatus = nodeStatus.componentStatuses[component.id];
    if (componentStatus != null) {
      result = componentStatus.isVisible;
    }
  }
  return result;
}
