import { DataExportStrategy } from './strategies/DataExportStrategy';

export class DataExportContext {
  private strategy: DataExportStrategy;

  setStrategy(strategy: DataExportStrategy) {
    this.strategy = strategy;
  }

  export() {
    this.strategy.export();
  }
}
