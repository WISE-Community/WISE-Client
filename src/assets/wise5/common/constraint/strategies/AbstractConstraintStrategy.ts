import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { NotebookService } from '../../../services/notebookService';
import { StudentDataService } from '../../../services/studentDataService';
import { EvaluateConstraintContext } from '../EvaluateConstraintContext';
import { ConstraintStrategy } from './ConstraintStrategy';

export abstract class AbstractConstraintStrategy implements ConstraintStrategy {
  componentServiceLookupService: ComponentServiceLookupService;
  context: EvaluateConstraintContext;
  dataService: StudentDataService;
  notebookService: NotebookService;

  setContext(context: EvaluateConstraintContext): void {
    this.context = context;
    this.dataService = this.context.getDataService();
    this.componentServiceLookupService = this.context.getComponentServiceLookupService();
    this.notebookService = this.context.getNotebookService();
  }

  abstract evaluate(criteria: any): boolean;
}
