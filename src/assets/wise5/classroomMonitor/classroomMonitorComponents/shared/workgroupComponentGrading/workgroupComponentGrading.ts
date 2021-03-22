'use strict';

import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

class WorkgroupComponentGradingController {
  component: any;
  componentId: string;
  latestComponentState: any;
  nodeId: string;
  workgroupId: number;
  teacherWorkgroupId: number;

  static $inject = ['ConfigService', 'ProjectService', 'TeacherDataService'];

  constructor(
    private ConfigService: ConfigService,
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService
  ) {}

  $onInit() {
    this.teacherWorkgroupId = this.ConfigService.getWorkgroupId();
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
