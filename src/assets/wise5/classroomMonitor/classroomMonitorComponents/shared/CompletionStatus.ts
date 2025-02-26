export class CompletionStatus {
  isCompleted: boolean;
  isVisible: boolean;
  latestWorkTime: string;
  latestAnnotationTime: string;

  constructor() {
    this.isCompleted = false;
    this.isVisible = false;
    this.latestWorkTime = null;
    this.latestAnnotationTime = null;
  }

  /**
   * Returns a numerical status value for this completion status object depending on node completion
   * Available status values are:
   *    -1 (not visible)
   *    0 (not visited/no work; default)
   *    1 (partially completed)
   *    2 (completed)
   * @returns number status value
   */
  getStateNumber(): number {
    let status = 0;
    if (!this.isVisible) {
      status = -1;
    } else if (this.isCompleted) {
      status = 2;
    } else if (this.latestWorkTime !== null) {
      status = 1;
    }
    return status;
  }
}
