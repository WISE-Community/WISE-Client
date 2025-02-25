import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WorkgroupSelectAutocompleteComponent } from '../../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { TeacherDataService } from '../../../services/teacherDataService';
import { Node } from '../../../common/Node';
import { ConfigService } from '../../../services/configService';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { AnnotationService } from '../../../services/annotationService';
import { NotificationService } from '../../../services/notificationService';
import { CompletionStatus } from '../shared/CompletionStatus';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ComponentWorkgroupItemComponent } from '../component-workgroup-item/component-workgroup-item.component';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { AbstractClassResponsesComponent } from '../AbstractClassResponseComponent';

@Component({
  imports: [
    CommonModule,
    ComponentWorkgroupItemComponent,
    FlexLayoutModule,
    IntersectionObserverModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    WorkgroupSelectAutocompleteComponent
  ],
  selector: 'class-responses',
  templateUrl: './class-responses.component.html'
})
export class ClassResponsesComponent extends AbstractClassResponsesComponent {
  @Input() component: any;
  @Input() node: Node;

  constructor(
    protected annotationService: AnnotationService,
    protected classroomStatusService: ClassroomStatusService,
    private componentServiceLookupService: ComponentServiceLookupService,
    protected configService: ConfigService,
    protected dataService: TeacherDataService,
    protected notificationService: NotificationService,
    protected projectService: TeacherProjectService
  ) {
    super(
      annotationService,
      classroomStatusService,
      configService,
      dataService,
      notificationService,
      projectService
    );
  }

  ngOnInit(): void {
    this.retrieveStudentData(this.node);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.component) {
      this.collapseAll();
      this.setWorkgroupsById();
    }
  }

  /**
   * Update statuses, scores, notifications, etc. for a workgroup object. Also check if we need to
   * hide student names because logged-in user does not have the right permissions
   * @param workgroupID a workgroup ID number
   * @param init Boolean whether we're in controller initialization or not
   */
  protected updateWorkgroup(workgroupId: number, init = false): void {
    const workgroup = this.workgroupsById[workgroupId];
    const alertNotifications = this.notificationService.getAlertNotifications({
      nodeId: this.node.id,
      toWorkgroupId: workgroupId
    });
    workgroup.hasAlert = alertNotifications.length > 0;
    workgroup.hasNewAlert = alertNotifications.some((alert) => !alert.timeDismissed);
    const nodeCompletionStatus = this.getCompletionStatusByWorkgroupId(workgroupId);
    workgroup.isVisible = nodeCompletionStatus.isVisible ? 1 : 0;
    workgroup.completionStatus = this.getWorkgroupCompletionStatus(nodeCompletionStatus);
    workgroup.score =
      this.annotationService.getLatestScoreAnnotation(this.node.id, this.component.id, workgroupId)
        ?.data.value ?? '-';
    const studentStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(workgroupId);
    workgroup.nodeStatus = studentStatus.nodeStatuses[this.node.id] || {};
  }

  private getCompletionStatusByWorkgroupId(workgroupId: number): CompletionStatus {
    const completionStatus: CompletionStatus = {
      isCompleted: false,
      isVisible: false,
      latestWorkTime: null,
      latestAnnotationTime: null
    };
    const studentStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(workgroupId);
    if (studentStatus != null) {
      const nodeStatus = studentStatus.nodeStatuses[this.node.id];
      if (nodeStatus) {
        completionStatus.isVisible = nodeStatus.isVisible;
        completionStatus.latestWorkTime = this.getLatestWorkTimeByWorkgroupId(workgroupId);
        completionStatus.latestAnnotationTime =
          this.getLatestAnnotationTimeByWorkgroupId(workgroupId);
        if (!this.projectService.componentHasWork(this.component)) {
          completionStatus.isCompleted = nodeStatus.isVisited;
        }
        if (completionStatus.latestWorkTime) {
          completionStatus.isCompleted = this.isCompleted(workgroupId);
        }
      }
    }
    return completionStatus;
  }

  private getLatestWorkTimeByWorkgroupId(workgroupId: number): string {
    const componentStates = this.dataService.getComponentStatesByComponentId(this.component.id);
    for (const componentState of componentStates.reverse()) {
      if (componentState.workgroupId === workgroupId) {
        return componentState.serverSaveTime;
      }
    }
    return null;
  }

  private getLatestAnnotationTimeByWorkgroupId(workgroupId: number): string {
    const annotations = this.dataService.getAnnotationsByNodeId(this.node.id);
    for (const annotation of annotations.reverse()) {
      if (
        annotation.componentId === this.component.id &&
        annotation.toWorkgroupId === workgroupId &&
        annotation.fromWorkgroupId === this.configService.getWorkgroupId()
      ) {
        return annotation.serverSaveTime;
      }
    }
    return null;
  }

  private isCompleted(workgroupId: number): boolean {
    const service = this.componentServiceLookupService.getService(this.component.type);
    const workgroupComponentStates = this.dataService.getComponentStatesByWorkgroupIdAndComponentId(
      workgroupId,
      this.component.id
    );
    return ['OpenResponse', 'Discussion'].includes(this.component.type)
      ? service.isCompletedV2(this.node, this.component, {
          componentStates: workgroupComponentStates
        })
      : service.isCompleted(
          this.component,
          workgroupComponentStates,
          this.dataService.getEventsByNodeId(this.node.id),
          this.node
        );
  }

  protected isWorkgroupShown(workgroup: any): boolean {
    return this.dataService.isWorkgroupShown(workgroup);
  }

  protected onUpdateExpand({ workgroupId, value }): void {
    this.workVisibilityById[workgroupId] = value;
  }

  protected expandAll(): void {
    this.workgroups.forEach((workgroup) => {
      const workgroupId = workgroup.workgroupId;
      if (this.workgroupInViewById[workgroupId]) {
        this.workVisibilityById[workgroupId] = true;
      }
    });
    this.isExpandAll = true;
  }

  protected collapseAll(): void {
    this.workgroups.forEach(
      (workgroup) => (this.workVisibilityById[workgroup.workgroupId] = false)
    );
    this.isExpandAll = false;
  }
}
