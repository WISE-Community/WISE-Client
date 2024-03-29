import { Component, Input } from '@angular/core';
import { SummaryService } from '../../../../components/summary/summaryService';
import { AnnotationService } from '../../../../services/annotationService';
import { ComponentServiceLookupService } from '../../../../services/componentServiceLookupService';
import { ComponentTypeService } from '../../../../services/componentTypeService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ComponentFactory } from '../../../../common/ComponentFactory';
import { isMatchingPeriods } from '../../../../common/period/period';

@Component({
  selector: 'node-info',
  styleUrls: ['node-info.component.scss'],
  templateUrl: 'node-info.component.html'
})
export class NodeInfoComponent {
  nodeContent: any;
  @Input() nodeId: string;
  periodId: number;
  source: string;

  constructor(
    private annotationService: AnnotationService,
    private componentServiceLookupService: ComponentServiceLookupService,
    private componentTypeService: ComponentTypeService,
    private projectService: TeacherProjectService,
    private summaryService: SummaryService,
    private teacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.periodId = this.teacherDataService.getCurrentPeriodId();
    this.source = this.periodId === -1 ? 'allPeriods' : 'period';
    this.nodeContent = this.projectService.getNodeById(this.nodeId);
    if (this.nodeContent.rubric != null) {
      this.nodeContent.rubric = this.projectService.replaceAssetPaths(this.nodeContent.rubric);
    }
    this.populateComponentFields();
  }

  private populateComponentFields(): void {
    let assessmentItemIndex = 1;
    for (const component of this.nodeContent.components) {
      component.typeLabel = this.componentTypeService.getComponentTypeLabel(component.type);
      component.rubric = this.projectService.replaceAssetPaths(component.rubric);
      component.hasCorrectAnswer = this.componentHasCorrectAnswer(component);
      component.hasResponsesSummary = this.summaryService.isResponsesSummaryAvailableForComponentType(
        component.type
      );
      component.hasScoresSummary = this.summaryService.isScoresSummaryAvailableForComponentType(
        component.type
      );
      component.hasScoreAnnotation = this.hasScoreAnnotation(
        this.nodeId,
        component.id,
        this.periodId
      );
      component.isStudentWorkGenerated = this.projectService.componentHasWork(component);
      if (component.isStudentWorkGenerated) {
        component.assessmentItemIndex = assessmentItemIndex++;
      }
      const factory = new ComponentFactory();
      component.component = factory.getComponent(
        this.projectService.injectAssetPaths(component),
        this.nodeId
      );
    }
  }

  private hasScoreAnnotation(nodeId: string, componentId: string, periodId: number): boolean {
    return this.annotationService
      .getAnnotationsByNodeIdComponentId(nodeId, componentId)
      .some(
        (annotation) =>
          isMatchingPeriods(annotation.periodId, periodId) &&
          ['score', 'autoScore'].includes(annotation.type)
      );
  }

  private componentHasCorrectAnswer(component: any): boolean {
    const service = this.componentServiceLookupService.getService(component.type);
    return service.componentHasCorrectAnswer(component);
  }
}
