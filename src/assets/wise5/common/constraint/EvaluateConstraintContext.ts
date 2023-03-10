import { ComponentServiceLookupService } from '../../services/componentServiceLookupService';
import { NotebookService } from '../../services/notebookService';
import { StudentDataService } from '../../services/studentDataService';
import { ConstraintStrategy } from './strategies/ConstraintStrategy';

export class EvaluateConstraintContext {
  private strategy: ConstraintStrategy;

  constructor(
    private componentServiceLookupService: ComponentServiceLookupService,
    private dataService: StudentDataService,
    private notebookService: NotebookService
  ) {}

  getComponentServiceLookupService(): ComponentServiceLookupService {
    return this.componentServiceLookupService;
  }

  getDataService(): StudentDataService {
    return this.dataService;
  }

  getNotebookService(): NotebookService {
    return this.notebookService;
  }

  setStrategy(strategy: ConstraintStrategy): void {
    strategy.setContext(this);
    this.strategy = strategy;
  }

  evaluate(criteria: any): boolean {
    return this.strategy.evaluate(criteria);
  }
}
