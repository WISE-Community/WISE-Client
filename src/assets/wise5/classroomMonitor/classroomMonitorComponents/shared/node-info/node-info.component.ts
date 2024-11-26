import { Component, Input } from '@angular/core';
import { SummaryService } from '../../../../components/summary/summaryService';
import { AnnotationService } from '../../../../services/annotationService';
import { ComponentServiceLookupService } from '../../../../services/componentServiceLookupService';
import { ComponentTypeService } from '../../../../services/componentTypeService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ComponentFactory } from '../../../../common/ComponentFactory';
import { isMatchingPeriods } from '../../../../common/period/period';
import { Node } from '../../../../common/Node';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PreviewComponentComponent } from '../../../../authoringTool/components/preview-component/preview-component.component';
import { TeacherSummaryDisplayComponent } from '../../../../directives/teacher-summary-display/teacher-summary-display.component';
import { CommonModule } from '@angular/common';

@Component({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    FlexLayoutModule,
    PreviewComponentComponent,
    TeacherSummaryDisplayComponent
  ],
  selector: 'node-info',
  standalone: true,
  styleUrl: 'node-info.component.scss',
  templateUrl: 'node-info.component.html'
})
export class NodeInfoComponent {
  protected node: Node;
  @Input() nodeId: string;
  protected periodId: number;
  protected source: 'allPeriods' | 'period';

  constructor(
    private annotationService: AnnotationService,
    private componentServiceLookupService: ComponentServiceLookupService,
    private componentTypeService: ComponentTypeService,
    private dataService: TeacherDataService,
    private projectService: TeacherProjectService,
    private summaryService: SummaryService
  ) {}

  ngOnInit(): void {
    this.periodId = this.dataService.getCurrentPeriodId();
    this.source = this.periodId === -1 ? 'allPeriods' : 'period';
    this.node = this.projectService.getNode(this.nodeId);
    if (this.node.rubric != null) {
      this.node.rubric = this.projectService.replaceAssetPaths(this.node.rubric);
    }
    this.populateComponentFields();
  }

  private populateComponentFields(): void {
    let assessmentItemIndex = 1;
    for (const component of this.node.components) {
      component.typeLabel = this.componentTypeService.getComponentTypeLabel(component.type);
      component.rubric = this.projectService.replaceAssetPaths(component.rubric);
      component.hasCorrectAnswer = this.componentHasCorrectAnswer(component);
      component.hasResponsesSummary =
        this.summaryService.isResponsesSummaryAvailableForComponentType(component.type);
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
      component.component = new ComponentFactory().getComponent(
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
    return this.componentServiceLookupService
      .getService(component.type)
      .componentHasCorrectAnswer(component);
  }
}
