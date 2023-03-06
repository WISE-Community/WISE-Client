import { StudentDataService } from '../../services/studentDataService';
import { ConstraintStrategy } from './strategies/ConstraintStrategy';

export class EvaluateConstraintContext {
  private strategy: ConstraintStrategy;

  constructor(private dataService: StudentDataService) {}

  getDataService(): StudentDataService {
    return this.dataService;
  }

  setStrategy(strategy: ConstraintStrategy) {
    strategy.setContext(this);
    this.strategy = strategy;
  }

  evaluate(criteria: any): boolean {
    return this.strategy.evaluate(criteria);
  }
}
