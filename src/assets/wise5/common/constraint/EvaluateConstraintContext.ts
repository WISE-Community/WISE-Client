import { AnnotationService } from '../../services/annotationService';
import { ComponentServiceLookupService } from '../../services/componentServiceLookupService';
import { ConfigService } from '../../services/configService';
import { NotebookService } from '../../services/notebookService';
import { StudentDataService } from '../../services/studentDataService';
import { ConstraintStrategy } from './strategies/ConstraintStrategy';

export class EvaluateConstraintContext {
  private strategy: ConstraintStrategy;

  constructor(
    private annotationService: AnnotationService,
    private componentServiceLookupService: ComponentServiceLookupService,
    private configService: ConfigService,
    private dataService: StudentDataService,
    private notebookService: NotebookService
  ) {}

  getAnnotationService(): AnnotationService {
    return this.annotationService;
  }

  getComponentServiceLookupService(): ComponentServiceLookupService {
    return this.componentServiceLookupService;
  }

  getConfigService(): ConfigService {
    return this.configService;
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
