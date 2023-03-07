import { StudentDataService } from '../../../services/studentDataService';
import { EvaluateConstraintContext } from '../EvaluateConstraintContext';
import { ConstraintStrategy } from './ConstraintStrategy';

export abstract class AbstractConstraintStrategy implements ConstraintStrategy {
  context: EvaluateConstraintContext;
  dataService: StudentDataService;

  setContext(context: EvaluateConstraintContext): void {
    this.context = context;
    this.dataService = this.context.getDataService();
  }

  abstract evaluate(criteria: any): boolean;
}
