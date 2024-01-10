export class ComponentStatus {
  isCompleted: boolean;
  isVisible: boolean;

  constructor(isCompleted: boolean, isVisible: boolean) {
    this.isCompleted = isCompleted;
    this.isVisible = isVisible;
  }

  isVisibleAndNotCompleted(): boolean {
    return this.isVisible && !this.isCompleted;
  }
}
