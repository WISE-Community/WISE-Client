import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AnnotationService } from '../../../../services/annotationService';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { NotificationService } from '../../../../services/notificationService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../../services/teacherWebSocketService';
import { NodeService } from '../../../../services/nodeService';
import { generateRandomKey } from '../../../../common/string/string';
import { Node } from '../../../../common/Node';

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
    private nodeService: NodeService,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService,
    private snackBar: MatSnackBar,
    private dataService: TeacherDataService,
    private webSocketService: TeacherWebSocketService
  ) {}

  ngOnInit(): void {
    this.item = this.projectService.idToNode[this.nodeId];
    this.isGroup = this.projectService.isGroupNode(this.nodeId);
    this.nodeHasWork = this.projectService.nodeHasWork(this.nodeId);
    this.nodeTitle = this.projectService.nodeIdToNumber[this.nodeId] + ': ' + this.item.title;
    this.currentNode = this.dataService.currentNode;
    this.isCurrentNode = this.currentNode.id === this.nodeId;
    if (this.isCurrentNode) {
      this.expanded = true;
      this.onExpandedEvent.emit({ nodeId: this.nodeId, expanded: this.expanded });
      this.zoomToElement();
    }
    this.currentPeriod = this.dataService.getCurrentPeriod();
    this.currentWorkgroup = this.dataService.getCurrentWorkgroup();
    this.setCurrentNodeStatus();
    this.maxScore = this.projectService.getMaxScoreForNode(this.nodeId);
    this.icon = this.projectService.getNode(this.nodeId).getIcon();
    const parentGroup = this.projectService.getParentGroup(this.nodeId);
    if (parentGroup != null) {
      this.parentGroupId = parentGroup.id;
    }
    this.getAlertNotifications();
    this.hasRubrics = this.projectService.getNode(this.nodeId).getNumRubrics() > 0;
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
      this.dataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        this.currentPeriod = currentPeriod;
        this.getAlertNotifications();
      })
    );
  }

  private subscribeCurrentNodeChanged(): void {
    this.subscriptions.add(
      this.dataService.currentNodeChanged$.subscribe((previousAndCurrentNode) => {
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
      this.nodeService.setCurrentNode(this.nodeId);
    }
  }

  private groupItemClicked(): void {
    this.expanded = !this.expanded;
    if (this.expanded) {
      if (this.isCurrentNode) {
        this.zoomToElement();
      } else {
        this.nodeService.setCurrentNode(this.nodeId);
      }
    }
  }

  isLocked(): boolean {
    const constraints = this.projectService.getNodeById(this.nodeId).constraints ?? [];
    return (
      (this.isShowingAllPeriods() && this.isLockedForAll(constraints)) ||
      (!this.isShowingAllPeriods() &&
        this.isLockedForPeriod(constraints, this.dataService.getCurrentPeriod().periodId))
    );
  }

  private isLockedForAll(constraints: any): boolean {
    for (const period of this.dataService.getPeriods()) {
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

  protected toggleLockNode(): void {
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
    this.snackBar.open(
      isLocked
        ? $localize`${this.nodeTitle} has been locked for ${this.getPeriodLabel()}.`
        : $localize`${this.nodeTitle} has been unlocked for ${this.getPeriodLabel()}.`
    );
  }

  private unlockNode(node: Node): void {
    if (this.isShowingAllPeriods()) {
      this.unlockNodeForAllPeriods(node);
    } else {
      this.removeTeacherRemovalConstraint(node, this.dataService.getCurrentPeriod().periodId);
    }
  }

  private lockNode(node: Node): void {
    if (this.isShowingAllPeriods()) {
      this.lockNodeForAllPeriods(node);
    } else {
      this.addTeacherRemovalConstraint(node, this.dataService.getCurrentPeriod().periodId);
    }
  }

  private addTeacherRemovalConstraint(node: Node, periodId: number): void {
    const lockConstraint = {
      id: generateRandomKey(),
      action: 'makeThisNodeNotVisitable',
      targetId: node.id,
      removalConditional: 'any',
      removalCriteria: [
        {
          name: 'teacherRemoval',
          params: {
            periodId: periodId
          }
        }
      ]
    };
    if (node.constraints == null) {
      node.constraints = [];
    }
    node.constraints.push(lockConstraint);
  }

  private unlockNodeForAllPeriods(node: Node): void {
    for (const period of this.dataService.getPeriods()) {
      this.removeTeacherRemovalConstraint(node, period.periodId);
    }
  }

  private removeTeacherRemovalConstraint(node: Node, periodId: number) {
    node.constraints = node.constraints.filter((constraint) => {
      return !(
        constraint.action === 'makeThisNodeNotVisitable' &&
        constraint.targetId === node.id &&
        constraint.removalCriteria[0].name === 'teacherRemoval' &&
        constraint.removalCriteria[0].params.periodId === periodId
      );
    });
  }

  private lockNodeForAllPeriods(node: Node): void {
    for (const period of this.dataService.getPeriods()) {
      if (period.periodId !== -1 && !this.isLockedForPeriod(node.constraints, period.periodId)) {
        this.addTeacherRemovalConstraint(node, period.periodId);
      }
    }
  }

  private isShowingAllPeriods(): boolean {
    return this.dataService.getCurrentPeriod().periodId === -1;
  }

  private sendNodeToClass(node: any): void {
    if (this.isShowingAllPeriods()) {
      this.sendNodeToAllPeriods(node);
    } else {
      this.sendNodeToPeriod(node, this.currentPeriod.periodId);
    }
  }

  private sendNodeToAllPeriods(node: any): void {
    for (const period of this.dataService.getPeriods()) {
      if (period.periodId !== -1) {
        this.sendNodeToPeriod(node, period.periodId);
      }
    }
  }

  private sendNodeToPeriod(node: any, periodId: number): void {
    this.webSocketService.sendNodeToClass(periodId, node);
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
    return this.alertNotifications.some((alert) => !alert.timeDismissed);
  }

  private getPeriodLabel(): string {
    return this.isShowingAllPeriods()
      ? $localize`All Periods`
      : $localize`Period: ${this.currentPeriod.periodName}`;
  }

  protected getNodeLockedText(): string {
    return this.isLocked()
      ? $localize`Unlock for ${this.getPeriodLabel()}`
      : $localize`Lock for ${this.getPeriodLabel()}`;
  }
}
