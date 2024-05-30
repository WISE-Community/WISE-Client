export class AddStepTarget {
  branchNodeId?: string;
  firstNodeIdInBranchPath?: string;
  targetId?: string;
  type: 'in' | 'after' | 'firstStepInBranchPath';

  constructor(
    type: 'in' | 'after' | 'firstStepInBranchPath',
    targetId: string,
    branchNodeId?: string,
    firstNodeIdInBranchPath?: string
  ) {
    this.type = type;
    this.targetId = targetId;
    this.branchNodeId = branchNodeId;
    this.firstNodeIdInBranchPath = firstNodeIdInBranchPath;
  }
}
