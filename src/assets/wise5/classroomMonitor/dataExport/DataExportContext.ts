import { DataExportComponent } from './data-export/data-export.component';
import { DataExportStrategy } from './strategies/DataExportStrategy';

export class DataExportContext {
  private strategy: DataExportStrategy;
  constructor(public controller: DataExportComponent) {}

  setStrategy(strategy: DataExportStrategy) {
    strategy.setDataExportContext(this);
    this.strategy = strategy;
  }

  export() {
    this.strategy.export();
  }
}
