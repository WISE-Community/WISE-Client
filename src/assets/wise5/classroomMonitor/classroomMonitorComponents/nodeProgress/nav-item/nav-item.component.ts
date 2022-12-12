import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AnnotationService } from '../../../../services/annotationService';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { NotificationService } from '../../../../services/notificationService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../../services/teacherWebSocketService';

@Component({
  selector: 'nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent implements OnInit {
  alertIconClass: string;
  alertIconLabel: string;
  alertIconName: string;
  alertNotifications: any;
  currentNode: any;
  currentNodeStatus: any;
  currentPeriod: any;
  currentWorkgroup: any;
  expanded: boolean = false;
  hasAlert: boolean = false;
  hasRubrics: boolean;
  icon: any;
  isCurrentNode: boolean;
  isGroup: boolean;
  item: any;
  maxScore: number;
  newAlert: boolean = false;
  nodeHasWork: boolean;
  @Input() nodeId: string;
  nodeTitle: string;
  @Output() onExpandedEvent: EventEmitter<any> = new EventEmitter();
  parentGroupId: string = null;
  rubricIconClass: string;
  rubricIconLabel: string;
  rubricIconName: string;
  subscriptions: Subscription = new Subscription();
  @Input() type: string;

  constructor(
    private annotationService: AnnotationService,
    private classroomStatusService: ClassroomStatusService,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService,
    private snackBar: MatSnackBar,
    private teacherDataService: TeacherDataService,
    private teacherWebSocketService: TeacherWebSocketService
  ) {}

  ngOnInit(): void {
    this.item = this.projectService.idToNode[this.nodeId];
    this.isGroup = this.projectService.isGroupNode(this.nodeId);
    this.nodeHasWork = this.projectService.nodeHasWork(this.nodeId);
    this.nodeTitle = this.projectService.nodeIdToNumber[this.nodeId] + ': ' + this.item.title;
    this.currentNode = this.teacherDataService.currentNode;
    this.isCurrentNode = this.currentNode.id === this.nodeId;
    if (this.isCurrentNode) {
      this.expanded = true;
      this.onExpandedEvent.emit({ nodeId: this.nodeId, expanded: this.expanded });
      this.zoomToElement();
    }
    this.currentPeriod = this.teacherDataService.getCurrentPeriod();
    this.currentWorkgroup = this.teacherDataService.getCurrentWorkgroup();
    this.setCurrentNodeStatus();
    this.maxScore = this.projectService.getMaxScoreForNode(this.nodeId);
    this.icon = this.projectService.getNode(this.nodeId).getIcon();
    const parentGroup = this.projectService.getParentGroup(this.nodeId);
    if (parentGroup != null) {
      this.parentGroupId = parentGroup.id;
    }
    this.getAlertNotifications();
    this.hasRubrics = this.projectService.getNumberOfRubricsByNodeId(this.nodeId) > 0;
    this.alertIconLabel = $localize`Has new alert(s)`;
    this.alertIconClass = 'warn';
    this.alertIconName = 'notifications';
    this.rubricIconLabel = $localize`Step has rubrics/teaching tips`;
    this.rubricIconClass = 'info';
    this.rubricIconName = 'info';
    this.subscribeCurrentNodeChanged();
    this.subscribeStudentStatusReceived();
    this.subscribeCurrentPeriodChanged();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeStudentStatusReceived(): void {
    this.subscriptions.add(
      this.classroomStatusService.studentStatusReceived$.subscribe(() => {
        this.setCurrentNodeStatus();
        this.getAlertNotifications();
      })
    );
  }

  private subscribeCurrentPeriodChanged(): void {
    this.subscriptions.add(
      this.teacherDataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        this.currentPeriod = currentPeriod;
        this.getAlertNotifications();
      })
    );
  }

  private subscribeCurrentNodeChanged(): void {
    this.subscriptions.add(
      this.teacherDataService.currentNodeChanged$.subscribe((previousAndCurrentNode) => {
        const oldNode = previousAndCurrentNode.previousNode;
        const newNode = previousAndCurrentNode.currentNode;
        this.currentNode = newNode;
        this.isCurrentNode = this.nodeId === newNode.id;
        let isPrev = false;
        if (this.projectService.isApplicationNode(newNode.id)) {
          return;
        }
        if (oldNode) {
          isPrev = this.nodeId === oldNode.id;
          if (isPrev && !this.isGroup) {
            this.zoomToElement();
          }
        }

        if (this.isGroup) {
          const prevNodeIsGroup = !oldNode || this.projectService.isGroupNode(oldNode.id);
          const prevNodeIsDescendant = this.projectService.isNodeDescendentOfGroup(
            oldNode,
            this.item
          );
          if (this.isCurrentNode) {
            this.expanded = true;
            if (prevNodeIsGroup || !prevNodeIsDescendant) {
              this.zoomToElement();
            }
          } else {
            this.expanded = false;
            if (!prevNodeIsGroup) {
              if (prevNodeIsDescendant) {
                this.expanded = true;
              } else {
                this.expanded = false;
              }
            }
          }
        } else {
          if (isPrev && this.projectService.isNodeDescendentOfGroup(this.item, newNode)) {
            this.zoomToElement();
          }
        }
      })
    );
  }

  private zoomToElement(): void {
    setTimeout(() => {
      document.getElementById(`nav-item-${this.nodeId}`).scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }

  itemClicked(): void {
    if (this.isGroup) {
      this.groupItemClicked();
      this.onExpandedEvent.emit({ nodeId: this.nodeId, expanded: this.expanded });
    } else {
      this.teacherDataService.endCurrentNodeAndSetCurrentNodeByNodeId(this.nodeId);
    }
  }

  private groupItemClicked(): void {
    this.expanded = !this.expanded;
    if (this.expanded) {
      if (this.isCurrentNode) {
        this.zoomToElement();
      } else {
        this.teacherDataService.endCurrentNodeAndSetCurrentNodeByNodeId(this.nodeId);
      }
    }
  }

  isLocked(): boolean {
    const constraints = this.projectService.getNodeById(this.nodeId).constraints;
    if (constraints == null) {
      return false;
    } else {
      return (
        (this.isShowingAllPeriods() && this.isLockedForAll(constraints)) ||
        (!this.isShowingAllPeriods() &&
          this.isLockedForPeriod(constraints, this.teacherDataService.getCurrentPeriod().periodId))
      );
    }
  }

  private isLockedForAll(constraints: any): boolean {
    for (const period of this.teacherDataService.getPeriods()) {
      if (period.periodId !== -1 && !this.isLockedForPeriod(constraints, period.periodId)) {
        return false;
      }
    }
    return true;
  }

  private isLockedForPeriod(constraints: any, periodId: number): boolean {
    for (const constraint of constraints) {
      if (
        constraint.action === 'makeThisNodeNotVisitable' &&
        constraint.targetId === this.nodeId &&
        constraint.removalCriteria[0].params.periodId === periodId
      ) {
        return true;
      }
    }
    return false;
  }

  toggleLockNode(): void {
    const node = this.projectService.getNodeById(this.nodeId);
    const isLocked = this.isLocked();
    if (isLocked) {
      this.unlockNode(node);
    } else {
      this.lockNode(node);
    }
    this.projectService.saveProject().then(() => {
      this.sendNodeToClass(node);
      this.showToggleLockNodeConfirmation(!isLocked);
    });
  }

  private showToggleLockNodeConfirmation(isLocked: boolean): void {
    let message = '';
    if (isLocked) {
      message = $localize`${this.nodeTitle} has been locked for ${this.getPeriodLabel()}.`;
    } else {
      message = $localize`${this.nodeTitle} has been unlocked for ${this.getPeriodLabel()}.`;
    }
    this.snackBar.open(message);
  }

  private unlockNode(node: any): void {
    if (this.isShowingAllPeriods()) {
      this.unlockNodeForAllPeriods(node);
    } else {
      this.projectService.removeTeacherRemovalConstraint(
        node,
        this.teacherDataService.getCurrentPeriod().periodId
      );
    }
  }

  private lockNode(node: any): void {
    if (this.isShowingAllPeriods()) {
      this.lockNodeForAllPeriods(node);
    } else {
      this.projectService.addTeacherRemovalConstraint(
        node,
        this.teacherDataService.getCurrentPeriod().periodId
      );
    }
  }

  private unlockNodeForAllPeriods(node: any): void {
    for (const period of this.teacherDataService.getPeriods()) {
      this.projectService.removeTeacherRemovalConstraint(node, period.periodId);
    }
  }

  private lockNodeForAllPeriods(node: any): void {
    for (const period of this.teacherDataService.getPeriods()) {
      if (period.periodId !== -1 && !this.isLockedForPeriod(node.constraints, period.periodId)) {
        this.projectService.addTeacherRemovalConstraint(node, period.periodId);
      }
    }
  }

  private isShowingAllPeriods(): boolean {
    return this.teacherDataService.getCurrentPeriod().periodId === -1;
  }

  private sendNodeToClass(node: any): void {
    if (this.isShowingAllPeriods()) {
      this.sendNodeToAllPeriods(node);
    } else {
      this.sendNodeToPeriod(node, this.currentPeriod.periodId);
    }
  }

  private sendNodeToAllPeriods(node: any): void {
    for (const period of this.teacherDataService.getPeriods()) {
      if (period.periodId !== -1) {
        this.sendNodeToPeriod(node, period.periodId);
      }
    }
  }

  private sendNodeToPeriod(node: any, periodId: number): void {
    this.teacherWebSocketService.sendNodeToClass(periodId, node);
  }

  getNodeCompletion(): number {
    return this.classroomStatusService.getNodeCompletion(
      this.nodeId,
      this.currentPeriod.periodId,
      null,
      true
    ).completionPct;
  }

  getNodeAverageScore(): any {
    const workgroupId = this.currentWorkgroup ? this.currentWorkgroup.workgroupId : null;
    if (workgroupId) {
      return this.annotationService.getTotalNodeScoreForWorkgroup(workgroupId, this.nodeId);
    } else {
      return this.classroomStatusService.getNodeAverageScore(
        this.nodeId,
        this.currentPeriod.periodId
      );
    }
  }

  private setCurrentNodeStatus(): void {
    if (this.currentWorkgroup) {
      const studentStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(
        this.currentWorkgroup.workgroupId
      );
      this.currentNodeStatus = studentStatus.nodeStatuses[this.nodeId];
    }
  }

  private getAlertNotifications(): void {
    this.alertNotifications = this.notificationService.getAlertNotifications({
      nodeId: this.nodeId,
      periodId: this.currentPeriod.periodId,
      toWorkgroupId: this.currentWorkgroup ? this.currentWorkgroup.workgroupId : null
    });
    this.hasAlert = this.alertNotifications.length > 0;
    this.newAlert = this.hasNewAlert();
  }

  private hasNewAlert(): boolean {
    for (const alert of this.alertNotifications) {
      if (!alert.timeDismissed) {
        return true;
      }
    }
    return false;
  }

  private getPeriodLabel(): string {
    return this.isShowingAllPeriods()
      ? $localize`All Periods`
      : $localize`Period: ${this.currentPeriod.periodName}`;
  }

  getNodeLockedText(): string {
    if (this.isLocked()) {
      return $localize`Unlock for ${this.getPeriodLabel()}`;
    } else {
      return $localize`Lock for ${this.getPeriodLabel()}`;
    }
  }
}
