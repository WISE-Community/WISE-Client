import { Directive } from '@angular/core';
import { AnnotationService } from '../../services/annotationService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import { ConfigService } from '../../services/configService';
import { NotificationService } from '../../services/notificationService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { Node } from '../../common/Node';
import { copy } from '../../common/object/object';
import { CompletionStatus } from './shared/CompletionStatus';

@Directive()
export abstract class AbstractClassResponsesComponent {
  protected component: any;
  protected isExpandAll: boolean;
  protected node: Node;
  protected sort: string;
  sortedWorkgroups: any[] = [];
  workgroups: any[] = [];
  protected workgroupInViewById: any = {}; // whether the workgroup is in view or not
  protected workgroupsById: any = {};
  protected workVisibilityById: { [key: number]: boolean } = {};

  constructor(
    protected annotationService: AnnotationService,
    protected classroomStatusService: ClassroomStatusService,
    protected configService: ConfigService,
    protected dataService: TeacherDataService,
    protected notificationService: NotificationService,
    protected projectService: TeacherProjectService
  ) {}

  protected retrieveStudentData(node: Node): void {
    this.dataService.retrieveStudentDataForNode(node).subscribe(() => {
      this.workgroups = copy(this.configService.getClassmateUserInfos()).filter(
        (workgroup) =>
          workgroup.workgroupId != null &&
          this.classroomStatusService.hasStudentStatus(workgroup.workgroupId)
      );
      this.setWorkgroupsById();
      this.sortWorkgroups();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  }

  protected setWorkgroupsById(): void {
    for (const workgroup of this.workgroups) {
      const workgroupId = workgroup.workgroupId;
      this.workgroupsById[workgroupId] = workgroup;
      this.workVisibilityById[workgroupId] = false;
      this.updateWorkgroup(workgroup, true);
    }
  }

  /**
   * Update statuses, scores, notifications, etc. for a workgroup object. Also check if we need to
   * hide student names because logged-in user does not have the right permissions
   * @param workgroupID a workgroup ID number
   * @param init Boolean whether we're in controller initialization or not
   */
  protected updateWorkgroup(workgroup: any, init = false): void {
    const alertNotifications = this.notificationService.getAlertNotifications({
      nodeId: this.node.id,
      toWorkgroupId: workgroup.workgroupId
    });
    workgroup.hasAlert = alertNotifications.length > 0;
    workgroup.hasNewAlert = alertNotifications.some((alert) => !alert.timeDismissed);
    const completionStatus = this.getCompletionStatusByWorkgroupId(workgroup.workgroupId);
    workgroup.isVisible = completionStatus.isVisible ? 1 : 0;
    workgroup.completionStatus = this.getWorkgroupCompletionStatus(completionStatus);
    const studentStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(
      workgroup.workgroupId
    );
    workgroup.nodeStatus = studentStatus.nodeStatuses[this.node.id] || {};
    workgroup.score = this.getWorkgroupScore(workgroup.workgroupId);
  }

  protected abstract getCompletionStatusByWorkgroupId(workgroupId: number): CompletionStatus;

  protected abstract getWorkgroupScore(workgroupId: number): any;

  protected getLatestWorkTimeByWorkgroupId(workgroupId: number): string {
    const componentStates = this.getComponentStates();
    for (const componentState of componentStates.reverse()) {
      if (componentState.workgroupId === workgroupId) {
        return componentState.serverSaveTime;
      }
    }
    return null;
  }

  protected abstract getComponentStates(): any[];

  protected getLatestAnnotationTimeByWorkgroupId(workgroupId: number): string {
    const annotations = this.dataService.getAnnotationsByNodeId(this.node.id);
    for (const annotation of annotations.reverse()) {
      if (this.isAnnotationForWorkgroup(annotation, workgroupId)) {
        return annotation.serverSaveTime;
      }
    }
    return null;
  }

  protected isAnnotationForWorkgroup(annotation: any, workgroupId: number): boolean {
    return (
      annotation.toWorkgroupId === workgroupId &&
      annotation.fromWorkgroupId === this.configService.getWorkgroupId()
    );
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

  private sortTeamAscending(workgroupA: any, workgroupB: any): number {
    return workgroupA.isVisible === workgroupB.isVisible
      ? workgroupA.workgroupId - workgroupB.workgroupId
      : workgroupB.isVisible - workgroupA.isVisible;
  }

  private sortTeamDescending(workgroupA: any, workgroupB: any): number {
    return workgroupA.isVisible === workgroupB.isVisible
      ? workgroupB.workgroupId - workgroupA.workgroupId
      : workgroupB.isVisible - workgroupA.isVisible;
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
    if (this.sort === criteria) {
      this.sort = `-${criteria}`;
    } else {
      this.sort = criteria;
    }
    this.dataService.nodeGradingSort = this.sort;
    this.sortWorkgroups();
  }

  /**
   * Returns a numerical status value for a given completion status object depending on node
   * completion
   * Available status values are: 0 (not visited/no work; default), 1 (partially completed),
   * 2 (completed)
   * @param completionStatus Object
   * @returns Integer status value
   */
  protected getWorkgroupCompletionStatus(completionStatus: CompletionStatus): number {
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

  protected onIntersection(
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

  protected onUpdateExpand({ workgroupId, value }): void {
    this.workVisibilityById[workgroupId] = value;
  }

  protected isWorkgroupShown(workgroup: any): boolean {
    return this.dataService.isWorkgroupShown(workgroup);
  }

  protected collapseAll(): void {
    this.workgroups.forEach(
      (workgroup) => (this.workVisibilityById[workgroup.workgroupId] = false)
    );
    this.isExpandAll = false;
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
}
