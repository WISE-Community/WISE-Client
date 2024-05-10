export interface CreateBranchParams {
  branchStepId: string;
  componentId?: string;
  criteria: string;
  mergeStepId: string;
  nodeId?: string;
  pathCount: number;
  paths?: string[];
}
