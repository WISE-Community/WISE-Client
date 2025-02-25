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
      this.updateWorkgroup(workgroupId, true);
    }
  }

  protected abstract updateWorkgroup(workgroupId: number, init: boolean): void;

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
