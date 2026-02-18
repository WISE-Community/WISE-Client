import { Component, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Node } from '../../../../common/Node';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { FilterComponentsComponent } from '../filter-components/filter-components.component';
import { ComponentContent } from '../../../../common/ComponentContent';
import { NodeClassResponsesComponent } from '../node-class-responses/node-class-responses.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ComponentTypeService } from '../../../../services/componentTypeService';
import { ComponentSummaryComponent } from '../../component-summary/component-summary.component';
import { FormControl } from '@angular/forms';
import { AnnotationService } from '../../../../services/annotationService';

@Component({
  imports: [
    CommonModule,
    ComponentSummaryComponent,
    FilterComponentsComponent,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    NodeClassResponsesComponent
  ],
  styles: [
    `
      .content-head-label {
        font-size: 50%;
      }

      .component-select {
        padding: 6px 12px;
      }

      .mat-body-1 {
        margin: 0;
      }
    `
  ],
  templateUrl: './node-grading.component.html'
})
export class NodeGradingComponent implements OnInit, OnDestroy, OnChanges {
  protected components: ComponentContent[];
  protected hasWork: boolean;
  protected node: Node;
  protected nodeAverageScore: number;
  protected nodeCompletionPercent: number;
  protected nodeMaxScore: number;
  @Input() nodeId: string;
  protected numRubrics: number;
  protected periodId: number;
  protected selectedComponent: FormControl = new FormControl();
  private subscriptions: Subscription = new Subscription();
  protected summariesVisible: boolean = true;
  protected visibleComponents: ComponentContent[];

  constructor(
    private annotationService: AnnotationService,
    private classroomStatusService: ClassroomStatusService,
    private componentTypeService: ComponentTypeService,
    private dataService: TeacherDataService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.setFields();
    this.subscriptions.add(
      this.dataService.currentPeriodChanged$.subscribe(() => this.setPeriod())
    );
    this.subscriptions.add(
      this.annotationService.annotationReceived$.subscribe(() => this.setPeriod())
    );
    this.subscriptions.add(this.projectService.projectSaved$.subscribe(() => this.setFields()));
    this.subscriptions.add(
      this.dataService.currentNodeChanged$.subscribe(() => this.selectedComponent.setValue(0))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(): void {
    this.setFields();
  }

  private setFields(): void {
    this.hasWork = this.projectService.nodeHasWork(this.nodeId);
    this.node = this.projectService.getNode(this.nodeId);
    this.nodeAverageScore = this.classroomStatusService.getNodeAverageScore(
      this.nodeId,
      this.dataService.getCurrentPeriodId()
    );
    this.nodeMaxScore = this.projectService.getMaxScoreForNode(this.nodeId);
    this.components = this.projectService
      .getComponents(this.nodeId)
      .filter((component) => this.projectService.componentHasWork(component))
      .map((component, index) => {
        component['displayIndex'] = index + 1;
        return component;
      });
    this.visibleComponents = [this.components[0]];
    this.numRubrics = this.node.getNumRubrics();
    this.setPeriod();
  }

  private setPeriod(): void {
    this.periodId = this.dataService.getCurrentPeriodId();
    this.setNodeAverageScore();
    this.setNodeCompletionPercent();
  }

  private setNodeAverageScore(): void {
    this.nodeAverageScore = this.classroomStatusService.getNodeAverageScore(
      this.nodeId,
      this.periodId
    );
  }

  private setNodeCompletionPercent(): void {
    this.nodeCompletionPercent = this.classroomStatusService.getNodeCompletion(
      this.nodeId,
      this.periodId
    ).completionPct;
  }

  protected setVisibleComponents(visibleComponents: ComponentContent[]): void {
    this.visibleComponents = visibleComponents;
  }

  protected previewProject(): void {
    window.open(this.dataService.getPreviewUrl());
  }

  protected getComponentTypeLabel(componentType: string): string {
    return this.componentTypeService.getComponentTypeLabel(componentType);
  }

  protected toggleSummaries(event: Event): void {
    event.preventDefault();
    this.summariesVisible = !this.summariesVisible;
  }

  protected selectSummary(componentIndex: number): void {
    this.selectedComponent.setValue(componentIndex);
    this.visibleComponents = [this.components[componentIndex]];
  }
}
