import { AnnotationService } from '../../../services/annotationService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { ConfigService } from '../../../services/configService';
import { NotebookService } from '../../../services/notebookService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { EvaluateConstraintContext } from '../EvaluateConstraintContext';
import { ConstraintStrategy } from './ConstraintStrategy';

export abstract class AbstractConstraintStrategy implements ConstraintStrategy {
  annotationService: AnnotationService;
  componentServiceLookupService: ComponentServiceLookupService;
  configService: ConfigService;
  context: EvaluateConstraintContext;
  dataService: StudentDataService;
  notebookService: NotebookService;
  tagService: TagService;

  setContext(context: EvaluateConstraintContext): void {
    this.annotationService = context.getAnnotationService();
    this.context = context;
    this.configService = context.getConfigService();
    this.dataService = context.getDataService();
    this.componentServiceLookupService = context.getComponentServiceLookupService();
    this.notebookService = context.getNotebookService();
    this.tagService = context.getTagService();
  }

  abstract evaluate(criteria: any): boolean;
}
