import { Directive } from '@angular/core';
import { AnnotationService } from '../../../../services/annotationService';
import { ConfigService } from '../../../../services/configService';
import { MilestoneService } from '../../../../services/milestoneService';
import { NodeService } from '../../../../services/nodeService';
import { NotificationService } from '../../../../services/notificationService';
import { StudentStatusService } from '../../../../services/studentStatusService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { NodeGradingViewController } from '../../nodeGrading/nodeGradingView/nodeGradingView';

@Directive()
class MilestoneGradingViewController extends NodeGradingViewController {
  milestone: any;
  nodeId: string;
  componentId: string;

  constructor(
    protected $filter: any,
    protected AnnotationService: AnnotationService,
    protected ConfigService: ConfigService,
    protected MilestoneService: MilestoneService,
    protected NodeService: NodeService,
    protected NotificationService: NotificationService,
    protected ProjectService: TeacherProjectService,
    protected StudentStatusService: StudentStatusService,
    protected TeacherDataService: TeacherDataService
  ) {
    super(
      $filter,
      AnnotationService,
      ConfigService,
      MilestoneService,
      NodeService,
      NotificationService,
      ProjectService,
      StudentStatusService,
      TeacherDataService
    );
  }

  $onInit() {
    this.nodeId = this.milestone.nodeId;
    this.componentId = this.milestone.componentId;
    this.maxScore = this.getMaxScore();
    this.retrieveStudentData();
    this.subscribeToEvents();
    this.saveNodeGradingViewDisplayedEvent();
  }

  getScoreByWorkgroupId(workgroupId: number): number {
    let score = null;
    const latestScoreAnnotation = this.AnnotationService.getLatestScoreAnnotation(
      this.nodeId,
      this.componentId,
      workgroupId
    );
    if (latestScoreAnnotation) {
      score = this.AnnotationService.getScoreValueFromScoreAnnotation(latestScoreAnnotation);
    }
    return typeof score === 'number' ? score : -1;
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
