export function createScoreCounts(counts: any[]) {
  const countsObject = {};
  for (let c = 0; c < counts.length; c++) {
    countsObject[c + 1] = counts[c];
  }
  return countsObject;
}

export function createSatisfyCriteria(
  nodeId: string,
  componentId: string,
  targetVariable: string = null,
  func: string = null,
  value: number = null,
  percentThreshold: number = null
) {
  return {
    nodeId: nodeId,
    componentId: componentId,
    targetVariable: targetVariable,
    function: func,
    value: value,
    percentThreshold: percentThreshold
  };
}
