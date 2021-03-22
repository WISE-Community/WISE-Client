'use strict';

import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

class WorkgroupComponentGradingController {
  component: any;
  componentId: string;
  latestComponentState: any;
  nodeId: string;
  workgroupId: number;

  static $inject = ['ProjectService', 'TeacherDataService'];

  constructor(
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService
  ) {}

  $onInit() {
    this.component = this.ProjectService.getComponentByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    this.latestComponentState = this.TeacherDataService.getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(
      this.workgroupId,
      this.nodeId,
      this.componentId
    );
  }
}

const WorkgroupComponentGrading = {
  bindings: {
    nodeId: '<',
    componentId: '<',
    workgroupId: '<'
  },
  templateUrl:
    '/assets/wise5/classroomMonitor/classroomMonitorComponents/shared/workgroupComponentGrading/workgroupComponentGrading.html',
  controller: WorkgroupComponentGradingController
};

export default WorkgroupComponentGrading;
