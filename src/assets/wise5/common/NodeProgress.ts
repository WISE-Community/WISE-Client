export interface NodeProgress {
  completedItems: number;
  completedItemsWithWork: number;
  completionPct?: number;
  completionPctWithWork?: number;
  totalItems: number;
  totalItemsWithWork: number;
}
