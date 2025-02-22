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
import { copy } from '../../../common/object/object';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { AnnotationService } from '../../../services/annotationService';
import { NotificationService } from '../../../services/notificationService';
import { Notification } from '../../../../../app/domain/notification';
import { CompletionStatus } from '../shared/CompletionStatus';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ComponentWorkgroupItemComponent } from '../component-workgroup-item/component-workgroup-item.component';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';

@Component({
  selector: 'class-responses',
  standalone: true,
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
  templateUrl: './class-responses.component.html'
})
export class ClassResponsesComponent {
  protected canViewStudentNames: boolean;
  @Input() component: any;
  protected hiddenComponents: any[] = [];
  protected isExpandAll: boolean;
  protected maxScore: number;
  @Input() node: Node;
  protected numRubrics: number;
  protected sort: string;
  protected sortedWorkgroups: any[] = [];
  private workgroups: any[] = [];
  protected workgroupsById: any = {};
  protected workgroupInViewById: any = {}; // whether the workgroup is in view or not
  protected workVisibilityById: { [key: number]: boolean } = {};

  constructor(
    private annotationService: AnnotationService,
    private classroomStatusService: ClassroomStatusService,
    private componentServiceLookupService: ComponentServiceLookupService,
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.retrieveStudentData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.component) {
      this.collapseAll();
      this.setWorkgroupsById();
    }
  }

  protected retrieveStudentData(node: Node = this.node): void {
    this.dataService.retrieveStudentDataForNode(node).subscribe(() => {
      this.workgroups = copy(this.configService.getClassmateUserInfos()).filter(
        (workgroup) =>
          workgroup.workgroupId != null &&
          this.classroomStatusService.hasStudentStatus(workgroup.workgroupId)
      );
      this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
      this.setWorkgroupsById();
      this.sortWorkgroups();
      this.numRubrics = node.getNumRubrics();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  }

  private setWorkgroupsById(): void {
    for (const workgroup of this.workgroups) {
      const workgroupId = workgroup.workgroupId;
      this.workgroupsById[workgroupId] = workgroup;
      this.workVisibilityById[workgroupId] = false;
      this.updateWorkgroup(workgroupId, true);
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

  protected sortWorkgroups(): void {
    this.sortedWorkgroups = [];
    for (const workgroup of this.workgroups) {
      this.sortedWorkgroups.push(workgroup);
    }
    switch (this.sort) {
      case 'team':
        this.sortedWorkgroups.sort(this.sortTeamAscending);
        break;
      case '-team':
        this.sortedWorkgroups.sort(this.sortTeamDescending);
        break;
      case 'status':
        this.sortedWorkgroups.sort(this.createSortAscendingFunction('completionStatus'));
        break;
      case '-status':
        this.sortedWorkgroups.sort(this.createSortDescendingFunction('completionStatus'));
        break;
      case 'score':
        this.sortedWorkgroups.sort(this.createSortAscendingFunction('score'));
        break;
      case '-score':
        this.sortedWorkgroups.sort(this.createSortDescendingFunction('score'));
        break;
    }
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

  /**
   * Returns a numerical status value for a given completion status object depending on node
   * completion
   * Available status values are: 0 (not visited/no work; default), 1 (partially completed),
   * 2 (completed)
   * @param completionStatus Object
   * @returns Integer status value
   */
  private getWorkgroupCompletionStatus(completionStatus: CompletionStatus): number {
    // TODO: store this info in the nodeStatus so we don't have to calculate every time (and can use
    // more widely)?
    let status = 0;
    if (!completionStatus.isVisible) {
      status = -1;
    } else if (completionStatus.isCompleted) {
      status = 2;
    } else if (completionStatus.latestWorkTime !== null) {
      status = 1;
    }
    return status;
  }

  /**
   * Sort using this order hierarchy
   * isVisible descending, workgroupId ascending
   */
  private sortTeamAscending(workgroupA: any, workgroupB: any): number {
    if (workgroupA.isVisible === workgroupB.isVisible) {
      return workgroupA.workgroupId - workgroupB.workgroupId;
    } else {
      return workgroupB.isVisible - workgroupA.isVisible;
    }
  }

  /**
   * Sort using this order hierarchy
   * isVisible descending, workgroupId descending
   */
  private sortTeamDescending(workgroupA: any, workgroupB: any): number {
    if (workgroupA.isVisible === workgroupB.isVisible) {
      return workgroupB.workgroupId - workgroupA.workgroupId;
    } else {
      return workgroupB.isVisible - workgroupA.isVisible;
    }
  }

  protected createSortAscendingFunction(fieldName: string): any {
    return (workgroupA: any, workgroupB: any) => {
      if (workgroupA.isVisible === workgroupB.isVisible) {
        if (workgroupA[fieldName] === workgroupB[fieldName]) {
          return workgroupA.workgroupId - workgroupB.workgroupId;
        } else {
          return workgroupA[fieldName] - workgroupB[fieldName];
        }
      } else {
        return workgroupB.isVisible - workgroupA.isVisible;
      }
    };
  }

  protected createSortDescendingFunction(fieldName: string): any {
    return (workgroupA: any, workgroupB: any) => {
      if (workgroupA.isVisible === workgroupB.isVisible) {
        if (workgroupA[fieldName] === workgroupB[fieldName]) {
          return workgroupA.workgroupId - workgroupB.workgroupId;
        } else {
          return workgroupB[fieldName] - workgroupA[fieldName];
        }
      } else {
        return workgroupB.isVisible - workgroupA.isVisible;
      }
    };
  }

  setSort(criteria: string): void {
    this.sort = criteria;
  }

  isWorkgroupShown(workgroup: any): boolean {
    return true; // implement actual logic
  }

  onUpdateExpand({ workgroupId, value }): void {
    this.workVisibilityById[workgroupId] = value;
  }

  onIntersection(
    workgroupId: number,
    intersectionObserverEntries: IntersectionObserverEntry[]
  ): void {
    for (const entry of intersectionObserverEntries) {
      this.workgroupInViewById[workgroupId] = entry.isIntersecting;
      if (this.isExpandAll && entry.isIntersecting) {
        this.workVisibilityById[workgroupId] = true;
      }
    }
  }

  trackWorkgroup(index: number, workgroup: any): any {
    return workgroup.workgroupId;
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
