import { AnnotationService } from '../../services/annotationService';
import { CompletionService } from '../../services/completionService';
import { ComponentServiceLookupService } from '../../services/componentServiceLookupService';
import { ConfigService } from '../../services/configService';
import { NotebookService } from '../../services/notebookService';
import { StudentDataService } from '../../services/studentDataService';
import { TagService } from '../../services/tagService';
import { ConstraintStrategy } from './strategies/ConstraintStrategy';

export class EvaluateConstraintContext {
  private strategy: ConstraintStrategy;

  constructor(
    private annotationService: AnnotationService,
    private completionService: CompletionService,
    private componentServiceLookupService: ComponentServiceLookupService,
    private configService: ConfigService,
    private dataService: StudentDataService,
    private notebookService: NotebookService,
    private tagService: TagService
  ) {}

  getAnnotationService(): AnnotationService {
    return this.annotationService;
  }

  getCompletionService(): CompletionService {
    return this.completionService;
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

  getTagService(): TagService {
    return this.tagService;
  }

  setStrategy(strategy: ConstraintStrategy): void {
    strategy.setContext(this);
    this.strategy = strategy;
  }

  evaluate(criteria: any): boolean {
    return this.strategy.evaluate(criteria);
  }
}
