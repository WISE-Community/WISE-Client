export class ComponentRevisionCounter extends Map<string, number> {
  incrementCounter(key: string): void {
    this.set(key, this.get(key) + 1);
  }
}
