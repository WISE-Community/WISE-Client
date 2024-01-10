export class NodeProgress {
  completedItems: number;
  completedItemsWithWork: number;
  completionPct?: number;
  completionPctWithWork?: number;
  totalItems: number;
  totalItemsWithWork: number;

  constructor(
    completedItems: number,
    completedItemsWithWork: number,
    completionPct: number,
    completionPctWithWork: number,
    totalItems: number,
    totalItemsWithWork: number
  ) {
    this.completedItems = completedItems;
    this.completedItemsWithWork = completedItemsWithWork;
    this.completionPct = completionPct;
    this.completionPctWithWork = completionPctWithWork;
    this.totalItems = totalItems;
    this.totalItemsWithWork = totalItemsWithWork;
  }
}
