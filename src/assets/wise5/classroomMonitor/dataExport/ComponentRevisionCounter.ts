export class ComponentRevisionCounter extends Map<string, number> {
  incrementCounter(nodeId: string, componentId: string): void {
    const key = this.getKey(nodeId, componentId);
    this.initializeKeyIfNecessary(key);
    this.set(key, this.get(key) + 1);
  }

  getCounter(nodeId: string, componentId: string): number {
    const key = this.getKey(nodeId, componentId);
    this.initializeKeyIfNecessary(key);
    return this.get(key);
  }

  private getKey(nodeId: string, componentId: string): string {
    return `${nodeId}_${componentId}`;
  }

  private initializeKeyIfNecessary(key: string): void {
    if (!this.has(key)) {
      this.set(key, 1);
    }
  }
}
