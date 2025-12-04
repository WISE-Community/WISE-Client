import { Component, Input, ViewEncapsulation } from '@angular/core';
import { copy } from '../../../../common/object/object';
import { Annotation } from '../../../../common/Annotation';
import { filter, Subscription } from 'rxjs';
import { AbstractClassResponsesComponent } from '../../AbstractClassResponsesComponent';
import { Node } from '../../../../common/Node';
import { Notification } from '../../../../../../app/domain/notification';
import { MatList, MatListItem } from '@angular/material/list';
import { WorkgroupSelectAutocompleteComponent } from '../../../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { MilestoneWorkgroupItemComponent } from '../milestone-workgroup-item/milestone-workgroup-item.component';

@Component({
  imports: [
    MatList,
    MatListItem,
    WorkgroupSelectAutocompleteComponent,
    MatButton,
    MatIcon,
    NgClass,
    MatTooltip,
    IntersectionObserverModule,
    MilestoneWorkgroupItemComponent
  ],
  encapsulation: ViewEncapsulation.None,
  selector: 'milestone-class-responses',
  styleUrl: './milestone-class-responses.component.scss',
  templateUrl: './milestone-class-responses.component.html'
})
export class MilestoneClassResponsesComponent extends AbstractClassResponsesComponent {
  protected component: any;
  private firstNodeId: string;
  protected firstNodePosition: string;
  private lastNodeId: string;
  protected lastNodePosition: string;
  @Input() milestone: any;
  protected node: Node;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.node = this.projectService.getNode(this.milestone.nodeId);
    this.component = this.node.getComponent(this.milestone.componentId);
    if (this.milestone.report.locations.length > 1) {
      this.firstNodeId = this.milestone.report.locations[0].nodeId;
      this.lastNodeId =
        this.milestone.report.locations[this.milestone.report.locations.length - 1].nodeId;
    }
    this.retrieveStudentData(this.projectService.getNode(this.firstNodeId));
    if (this.milestone.report.locations.length > 1) {
      this.retrieveStudentData(this.projectService.getNode(this.lastNodeId));
    }
    this.subscribeToEvents();
    this.getNodePositions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToEvents(): void {
    this.subscriptions.add(this.subscribeToNotifications());
    this.subscriptions.add(this.subscribeToAnnotations());
    this.subscriptions.add(this.subscribeToStudentWork());
    if (this.milestone.report.locations.length > 1) {
      this.subscriptions.add(this.subscribeToFirstNodeAnnotations());
    }
  }

  private subscribeToNotifications(): Subscription {
    return this.notificationService.notificationChanged$
      .pipe(
        filter(
          (notification: Notification) =>
            notification.type === 'CRaterResult' && this.workgroupsById[notification.toWorkgroupId]
        )
      )
      .subscribe((notification) =>
        this.updateWorkgroup(this.getWorkgroup(notification.toWorkgroupId))
      );
  }

  private subscribeToAnnotations(): Subscription {
    return this.annotationService.annotationReceived$
      .pipe(
        filter(
          (annotation: Annotation) =>
            annotation.nodeId === this.node.id && this.workgroupsById[annotation.toWorkgroupId]
        )
      )
      .subscribe((annotation: Annotation) =>
        this.updateWorkgroup(this.getWorkgroup(annotation.toWorkgroupId))
      );
  }

  private subscribeToStudentWork(): Subscription {
    return this.dataService.studentWorkReceived$
      .pipe(
        filter(
          ({ studentWork }) =>
            studentWork.nodeId === this.node.id && this.workgroupsById[studentWork.workgroupId]
        )
      )
      .subscribe(({ studentWork }) =>
        this.updateWorkgroup(this.getWorkgroup(studentWork.workgroupId))
      );
  }

  private subscribeToFirstNodeAnnotations(): Subscription {
    return this.annotationService.annotationReceived$
      .pipe(
        filter(
          (annotation: Annotation) =>
            annotation.nodeId === this.firstNodeId && this.workgroupsById[annotation.toWorkgroupId]
        )
      )
      .subscribe((annotation: Annotation) =>
        this.updateWorkgroup(this.getWorkgroup(annotation.toWorkgroupId))
      );
  }

  private getWorkgroup(workgroupId: number): any {
    return this.workgroupsById[workgroupId];
  }

  protected hasWork(): boolean {
    return this.projectService.nodeHasWork(this.node.id);
  }

  protected isCompleted(workgroupId: number, nodeStatus: any): boolean {
    return nodeStatus.isCompleted;
  }

  protected getComponentStates(): any[] {
    return this.dataService.getComponentStatesByNodeId(this.node.id);
  }

  private getNodePositions(): void {
    if (this.milestone.report.locations.length > 1) {
      this.firstNodePosition = this.projectService.getNodePositionById(this.firstNodeId);
      this.lastNodePosition = this.projectService.getNodePositionById(this.lastNodeId);
    }
  }

  protected expandAll(): void {
    super.expandAll();
    this.saveEvent('MilestoneStudentWorkExpandAllClicked', {
      milestoneId: this.milestone.id
    });
  }

  protected collapseAll(): void {
    super.collapseAll();
    this.saveEvent('MilestoneStudentWorkCollapseAllClicked', {
      milestoneId: this.milestone.id
    });
  }

  protected onUpdateExpand({ workgroupId, value }): void {
    super.onUpdateExpand({ workgroupId, value });
    this.saveEvent(value ? 'MilestoneStudentWorkOpened' : 'MilestoneStudentWorkClosed', {
      milestoneId: this.milestone.id,
      workgroupId: workgroupId
    });
  }

  private saveEvent(event: string, data: any): void {
    this.dataService.saveEvent('ClassroomMonitor', null, null, null, 'Navigation', event, data);
  }

  protected updateWorkgroup(workgroup: any): void {
    super.updateWorkgroup(workgroup);
    if (this.milestone.report.locations.length > 1) {
      const firstLocation = this.milestone.report.locations[0];
      workgroup.initialScore = this.getScoreByWorkgroupId(
        workgroup.workgroupId,
        firstLocation.nodeId,
        firstLocation.componentId
      );
      workgroup.changeInScore = this.getChangeInScore(workgroup.initialScore, workgroup.score);
    }
    this.workgroupsById[workgroup.workgroupId] = copy(workgroup);
  }

  protected getWorkgroupScore(workgroupId: number): number {
    return this.getScoreByWorkgroupId(workgroupId, this.node.id, this.component.id);
  }

  private getScoreByWorkgroupId(workgroupId: number, nodeId: string, componentId: string): number {
    const latestScoreAnnotation = this.annotationService.getLatestScoreAnnotation(
      nodeId,
      componentId,
      workgroupId
    );
    return latestScoreAnnotation
      ? this.annotationService.getScoreValueFromScoreAnnotation(latestScoreAnnotation)
      : null;
  }

  private getChangeInScore(initialScore: number, revisedScore: number): number {
    // returning -10000 ensures that this score appears as the lowest score
    return initialScore != -1 && revisedScore != -1 ? revisedScore - initialScore : -10000;
  }
}
