export function goToNodeAuthoring(
  state: any,
  projectId: number,
  nodeId: string,
  newComponents: any[]
): void {
  state.go('root.at.project.node', {
    projectId: projectId,
    nodeId: nodeId,
    newComponents: newComponents
  });
}
