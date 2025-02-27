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
  protected allWorkgroupsExpanded: boolean;
  protected component: any;
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
    this.workgroups.forEach((workgroup) => {
      this.workgroupsById[workgroup.workgroupId] = workgroup;
      this.workVisibilityById[workgroup.workgroupId] = false;
      this.updateWorkgroup(workgroup, true);
    });
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
    workgroup.completionStatus = completionStatus.getStateNumber();
    const studentStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(
      workgroup.workgroupId
    );
    workgroup.nodeStatus = studentStatus.nodeStatuses[this.node.id] || {};
    workgroup.score = this.getWorkgroupScore(workgroup.workgroupId);
  }

  private getCompletionStatusByWorkgroupId(workgroupId: number): CompletionStatus {
    const completionStatus: CompletionStatus = new CompletionStatus();
    const studentStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(workgroupId);
    if (studentStatus != null && studentStatus.nodeStatuses[this.node.id] != null) {
      const nodeStatus = studentStatus.nodeStatuses[this.node.id];
      completionStatus.isVisible = nodeStatus.isVisible;
      completionStatus.latestWorkTime = this.getLatestWorkTimeByWorkgroupId(workgroupId);
      completionStatus.latestAnnotationTime =
        this.getLatestAnnotationTimeByWorkgroupId(workgroupId);
      if (!this.hasWork()) {
        completionStatus.isCompleted = nodeStatus.isVisited;
      }
      if (completionStatus.latestWorkTime) {
        completionStatus.isCompleted = this.isCompleted(workgroupId, nodeStatus);
      }
    }
    return completionStatus;
  }

  protected abstract getWorkgroupScore(workgroupId: number): any;

  protected abstract hasWork(): boolean;

  protected abstract isCompleted(workgroupId: number, nodeStatus: any): boolean;

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
    this.sortedWorkgroups = [...this.workgroups];
    switch (this.sort) {
      case 'team':
        this.sortedWorkgroups.sort(this.createSortFunction('workgroupId', true));
        break;
      case '-team':
        this.sortedWorkgroups.sort(this.createSortFunction('workgroupId', false));
        break;
      case 'status':
        this.sortedWorkgroups.sort(this.createSortFunction('completionStatus', true));
        break;
      case '-status':
        this.sortedWorkgroups.sort(this.createSortFunction('completionStatus', false));
        break;
      case 'score':
        this.sortedWorkgroups.sort(this.createSortFunction('score', true));
        break;
      case '-score':
        this.sortedWorkgroups.sort(this.createSortFunction('score', false));
        break;
    }
  }

  protected createSortFunction(fieldName: string, ascending: boolean): any {
    return (workgroupA: any, workgroupB: any) => {
      if (workgroupA.isVisible === workgroupB.isVisible) {
        if (workgroupA[fieldName] === workgroupB[fieldName]) {
          return workgroupA.workgroupId - workgroupB.workgroupId;
        } else {
          return ascending
            ? workgroupA[fieldName] - workgroupB[fieldName]
            : workgroupB[fieldName] - workgroupA[fieldName];
        }
      } else {
        return workgroupB.isVisible - workgroupA.isVisible;
      }
    };
  }

  setSort(criteria: string): void {
    this.sort = this.sort === criteria ? `-${criteria}` : criteria;
    this.dataService.nodeGradingSort = this.sort;
    this.sortWorkgroups();
  }

  protected onIntersection(
    workgroupId: number,
    intersectionObserverEntries: IntersectionObserverEntry[]
  ): void {
    for (const entry of intersectionObserverEntries) {
      this.workgroupInViewById[workgroupId] = entry.isIntersecting;
      if (this.allWorkgroupsExpanded && entry.isIntersecting) {
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
    this.allWorkgroupsExpanded = false;
  }

  protected expandAll(): void {
    this.workgroups
      .filter((workgroup) => this.workgroupInViewById[workgroup.workgroupId])
      .forEach((workgroup) => (this.workVisibilityById[workgroup.workgroupId] = true));
    this.allWorkgroupsExpanded = true;
  }
}
