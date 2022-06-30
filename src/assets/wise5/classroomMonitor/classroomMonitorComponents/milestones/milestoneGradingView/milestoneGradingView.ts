import { Directive } from '@angular/core';
import { AnnotationService } from '../../../../services/annotationService';
import { ConfigService } from '../../../../services/configService';
import { MilestoneService } from '../../../../services/milestoneService';
import { NodeInfoService } from '../../../../services/nodeInfoService';
import { NotificationService } from '../../../../services/notificationService';
import { TeacherPeerGroupService } from '../../../../services/teacherPeerGroupService';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { NodeGradingViewController } from '../../nodeGrading/nodeGradingView/nodeGradingView';
import * as angular from 'angular';

@Directive()
class MilestoneGradingViewController extends NodeGradingViewController {
  firstNodeId: string;
  firstNodePosition: string;
  lastNodeId: string;
  lastNodePosition: string;
  milestone: any;
  nodeId: string;
  componentId: string;

  constructor(
    protected $filter: any,
    protected AnnotationService: AnnotationService,
    protected classroomStatusService: ClassroomStatusService,
    protected ConfigService: ConfigService,
    protected MilestoneService: MilestoneService,
    protected nodeInfoService: NodeInfoService,
    protected NotificationService: NotificationService,
    protected PeerGroupService: TeacherPeerGroupService,
    protected ProjectService: TeacherProjectService,
    protected TeacherDataService: TeacherDataService
  ) {
    super(
      $filter,
      AnnotationService,
      classroomStatusService,
      ConfigService,
      MilestoneService,
      nodeInfoService,
      NotificationService,
      PeerGroupService,
      ProjectService,
      TeacherDataService
    );
    const additionalSortOrder = {
      initialScore: ['-isVisible', 'initialScore', 'workgroupId'],
      '-initialScore': ['-isVisible', '-initialScore', 'workgroupId'],
      changeInScore: ['-isVisible', 'changeInScore', 'workgroupId'],
      '-changeInScore': ['-isVisible', '-changeInScore', 'workgroupId']
    };
    this.sortOrder = { ...this.sortOrder, ...additionalSortOrder };
  }

  $onInit() {
    this.nodeId = this.milestone.nodeId;
    this.node = this.ProjectService.getNode(this.nodeId);
    if (this.milestone.report.locations.length > 1) {
      this.firstNodeId = this.milestone.report.locations[0].nodeId;
      this.lastNodeId = this.milestone.report.locations[
        this.milestone.report.locations.length - 1
      ].nodeId;
    }
    this.componentId = this.milestone.componentId;
    this.retrieveStudentData();
    this.subscribeToEvents();
    this.saveNodeGradingViewDisplayedEvent();
    this.getNodePositions();
  }

  subscribeToEvents() {
    super.subscribeToEvents();
    if (this.milestone.report.locations.length > 1) {
      this.subscriptions.add(
        this.AnnotationService.annotationReceived$.subscribe(({ annotation }) => {
          const workgroupId = annotation.toWorkgroupId;
          if (annotation.nodeId === this.firstNodeId && this.workgroupsById[workgroupId]) {
            this.updateWorkgroup(workgroupId);
          }
        })
      );
    }
  }

  retrieveStudentData() {
    const firstNode = this.ProjectService.getNode(this.firstNodeId);
    super.retrieveStudentData(firstNode);
    if (this.milestone.report.locations.length > 1) {
      const lastNode = this.ProjectService.getNode(this.lastNodeId);
      super.retrieveStudentData(lastNode);
    }
  }

  private getNodePositions() {
    if (this.milestone.report.locations.length > 1) {
      this.firstNodePosition = this.ProjectService.getNodePositionById(this.firstNodeId);
      this.lastNodePosition = this.ProjectService.getNodePositionById(this.lastNodeId);
    }
  }

  getScoreByWorkgroupId(
    workgroupId: number,
    nodeId: string = this.nodeId,
    componentId: string = this.componentId
  ): number {
    let score = null;
    const latestScoreAnnotation = this.AnnotationService.getLatestScoreAnnotation(
      nodeId,
      componentId,
      workgroupId
    );
    if (latestScoreAnnotation) {
      score = this.AnnotationService.getScoreValueFromScoreAnnotation(latestScoreAnnotation);
    }
    return score;
  }

  expandAll(): void {
    super.expandAll();
    this.saveMilestoneStudentWorkExpandCollapseAllEvent('MilestoneStudentWorkExpandAllClicked');
  }

  collapseAll(): void {
    super.collapseAll();
    this.saveMilestoneStudentWorkExpandCollapseAllEvent('MilestoneStudentWorkCollapseAllClicked');
  }

  saveMilestoneStudentWorkExpandCollapseAllEvent(event) {
    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      data = { milestoneId: this.milestone.id };
    this.TeacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      event,
      data
    );
  }

  onUpdateExpand(workgroupId: number, isExpanded: boolean): void {
    super.onUpdateExpand(workgroupId, isExpanded);
    this.saveMilestoneWorkgroupItemViewedEvent(workgroupId, isExpanded);
  }

  updateWorkgroup(workgroupId, init = false) {
    super.updateWorkgroup(workgroupId, init);
    const workgroup = this.workgroupsById[workgroupId];
    workgroup.score = this.getScoreByWorkgroupId(workgroupId);
    if (this.milestone.report.locations.length > 1) {
      const firstLocation = this.milestone.report.locations[0];
      workgroup.initialScore = this.getScoreByWorkgroupId(
        workgroupId,
        firstLocation.nodeId,
        firstLocation.componentId
      );
      workgroup.changeInScore = this.getChangeInScore(workgroup.initialScore, workgroup.score);
    }
    if (!init) {
      this.workgroupsById[workgroupId] = angular.copy(workgroup);
    }
  }

  getChangeInScore(initialScore: number, revisedScore: number): number {
    if (initialScore != -1 && revisedScore != -1) {
      return revisedScore - initialScore;
    }
    return -10000; // this hack ensures that this score appears as the lowest score
  }

  saveMilestoneWorkgroupItemViewedEvent(workgroupId, isExpanded) {
    let event = '';
    if (isExpanded) {
      event = 'MilestoneStudentWorkOpened';
    } else {
      event = 'MilestoneStudentWorkClosed';
    }
    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      data = { milestoneId: this.milestone.id, workgroupId: workgroupId };
    this.TeacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      event,
      data
    );
  }
}

const MilestoneGradingView = {
  bindings: {
    milestone: '<'
  },
  controller: MilestoneGradingViewController,
  templateUrl:
    '/assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestoneGradingView/milestoneGradingView.html'
};

export default MilestoneGradingView;
