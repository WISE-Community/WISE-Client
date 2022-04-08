import DataExportController from './dataExportController';
import { DataExportStrategy } from './strategies/DataExportStrategy';

export class DataExportContext {
  private strategy: DataExportStrategy;
  constructor(public controller: DataExportController) {}

  setStrategy(strategy: DataExportStrategy) {
    strategy.setDataExportContext(this);
    this.strategy = strategy;
  }

  export() {
    this.strategy.export();
  }
}
