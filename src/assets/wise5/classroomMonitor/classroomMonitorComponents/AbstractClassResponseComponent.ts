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
  protected sortBy: string;
  protected sortedWorkgroups: any[] = [];
  protected workgroups: any[] = [];
  protected workgroupExpanded: Record<number, boolean> = {}; // workgroup is expanded or not
  private workgroupInView: Record<number, boolean> = {}; // workgroup is in view or not
  protected workgroupsById: Record<number, any> = {};

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
      this.sortBy = '';
      this.sortWorkgroups('workgroupId');
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  }

  protected setWorkgroupsById(): void {
    this.workgroups.forEach((workgroup) => {
      this.workgroupsById[workgroup.workgroupId] = workgroup;
      this.workgroupExpanded[workgroup.workgroupId] = false;
      if (this.component) {
        this.updateWorkgroup(workgroup);
      }
    });
  }

  protected updateWorkgroup(workgroup: any): void {
    const alertNotifications = this.notificationService.getAlertNotifications({
      nodeId: this.node.id,
      toWorkgroupId: workgroup.workgroupId
    });
    workgroup.hasAlert = alertNotifications.length > 0;
    workgroup.hasNewAlert = alertNotifications.some((alert) => !alert.timeDismissed);
    const completionStatus = this.getCompletionStatus(workgroup.workgroupId);
    workgroup.isVisible = completionStatus.isVisible ? 1 : 0;
    workgroup.completionStatus = completionStatus.getStateNumber();
    const studentStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(
      workgroup.workgroupId
    );
    workgroup.nodeStatus = studentStatus.nodeStatuses[this.node.id] || {};
    workgroup.score = this.getWorkgroupScore(workgroup.workgroupId);
  }

  private getCompletionStatus(workgroupId: number): CompletionStatus {
    const studentStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(workgroupId);
    return studentStatus != null && studentStatus.nodeStatuses[this.node.id] != null
      ? this.createCompletionStatus(studentStatus.nodeStatuses[this.node.id], workgroupId)
      : new CompletionStatus();
  }

  private createCompletionStatus(nodeStatus: any, workgroupId: number): CompletionStatus {
    const completionStatus: CompletionStatus = new CompletionStatus();
    completionStatus.isVisible = nodeStatus.isVisible;
    completionStatus.latestWorkTime = this.getLatestWorkTimeByWorkgroupId(workgroupId);
    completionStatus.latestAnnotationTime = this.getLatestAnnotationTimeByWorkgroupId(workgroupId);
    if (!this.hasWork()) {
      completionStatus.isCompleted = nodeStatus.isVisited;
    }
    if (completionStatus.latestWorkTime) {
      completionStatus.isCompleted = this.isCompleted(workgroupId, nodeStatus);
    }
    return completionStatus;
  }

  protected abstract getWorkgroupScore(workgroupId: number): number;

  protected abstract hasWork(): boolean;

  protected abstract isCompleted(workgroupId: number, nodeStatus: any): boolean;

  private getLatestWorkTimeByWorkgroupId(workgroupId: number): string {
    return (
      this.getComponentStates().findLast(
        (componentState) => componentState.workgroupId === workgroupId
      )?.serverSaveTime ?? null
    );
  }

  protected abstract getComponentStates(): any[];

  private getLatestAnnotationTimeByWorkgroupId(workgroupId: number): string {
    return (
      this.dataService
        .getAnnotationsByNodeId(this.node.id)
        .findLast((annotation) => this.isAnnotationForWorkgroup(annotation, workgroupId))
        ?.serverSaveTime ?? null
    );
  }

  protected isAnnotationForWorkgroup(annotation: any, workgroupId: number): boolean {
    return (
      annotation.toWorkgroupId === workgroupId &&
      annotation.fromWorkgroupId === this.configService.getWorkgroupId()
    );
  }

  protected sortWorkgroups(sortBy: string): void {
    this.sortBy = this.sortBy === sortBy ? `-${sortBy}` : sortBy;
    this.sortedWorkgroups = [...this.workgroups].sort(this.createSortFunction());
  }

  private createSortFunction(): (workgroupA: any, workgroupB: any) => number {
    return (workgroupA: any, workgroupB: any) => {
      const ascending = this.sortBy[0] !== '-';
      const fieldName = this.sortBy.replace('-', '');
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

  protected onIntersection(
    workgroupId: number,
    intersectionObserverEntries: IntersectionObserverEntry[]
  ): void {
    intersectionObserverEntries.forEach((entry) => {
      this.workgroupInView[workgroupId] = entry.isIntersecting;
      if (this.allWorkgroupsExpanded && entry.isIntersecting) {
        this.workgroupExpanded[workgroupId] = true;
      }
    });
  }

  protected onUpdateExpand({ workgroupId, value: expanded }): void {
    this.workgroupExpanded[workgroupId] = expanded;
    if (!expanded) {
      this.allWorkgroupsExpanded = false;
    }
  }

  protected isWorkgroupShown(workgroup: any): boolean {
    return this.dataService.isWorkgroupShown(workgroup);
  }

  protected collapseAll(): void {
    this.workgroups.forEach((workgroup) => (this.workgroupExpanded[workgroup.workgroupId] = false));
    this.allWorkgroupsExpanded = false;
  }

  protected expandAll(): void {
    this.workgroups
      .filter((workgroup) => this.workgroupInView[workgroup.workgroupId])
      .forEach((workgroup) => (this.workgroupExpanded[workgroup.workgroupId] = true));
    this.allWorkgroupsExpanded = true;
  }
}
