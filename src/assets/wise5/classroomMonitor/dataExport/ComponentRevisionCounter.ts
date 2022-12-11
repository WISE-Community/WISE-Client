export class ComponentRevisionCounter extends Map<string, number> {
  incrementCounter(nodeId: string, componentId: string): void {
    const key = `${nodeId}_${componentId}`;
    if (!this.has(key)) {
      this.set(key, 1);
    }
    this.set(key, this.get(key) + 1);
  }

  getCounter(nodeId: string, componentId: string): number {
    const key = `${nodeId}_${componentId}`;
    if (!this.has(key)) {
      this.set(key, 1);
    }
    return this.get(key);
  }
}
