export class ComponentRevisionCounter extends Map<string, number> {
  incrementCounter(key: string): void {
    if (!this.has(key)) {
      this.set(key, 1);
    }
    this.set(key, this.get(key) + 1);
  }
}
