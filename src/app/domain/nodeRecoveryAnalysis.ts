export class NodeRecoveryAnalysis {
  hasTransitionToNull: boolean = false;
  nodeId: string;
  referencedIdsThatAreDuplicated: string[] = [];
  referencedIdsThatDoNotExist: string[] = [];

  constructor(nodeId: string) {
    this.nodeId = nodeId;
  }

  addReferencedIdThatIsDuplicated(nodeId: string): void {
    this.referencedIdsThatAreDuplicated.push(nodeId);
  }

  addReferencedIdThatDoesNotExist(nodeId: string): void {
    this.referencedIdsThatDoNotExist.push(nodeId);
  }

  setHasTransitionToNull(value: boolean): void {
    this.hasTransitionToNull = value;
  }

  hasProblem(): boolean {
    return (
      this.referencedIdsThatAreDuplicated.length > 0 ||
      this.referencedIdsThatDoNotExist.length > 0 ||
      this.hasTransitionToNull
    );
  }
}
