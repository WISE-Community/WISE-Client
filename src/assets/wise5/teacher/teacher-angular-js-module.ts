import '../lib/jquery/jquery-global';
import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import '../common-angular-js-module';
import { CopyComponentService } from '../services/copyComponentService';
import { CopyNodesService } from '../services/copyNodesService';
import { CopyProjectService } from '../services/copyProjectService';
import { DeleteNodeService } from '../services/deleteNodeService';
import { ImportComponentService } from '../services/importComponentService';
import { InsertComponentService } from '../services/insertComponentService';
import { MilestoneService } from '../services/milestoneService';
import { MoveNodesService } from '../services/moveNodesService';
import { NodeInfoService } from '../services/nodeInfoService';
import { PeerGroupService } from '../services/peerGroupService';
import { TeacherPeerGroupService } from '../services/teacherPeerGroupService';
import { TeacherProjectService } from '../services/teacherProjectService';
import { SpaceService } from '../services/spaceService';
import { ClassroomStatusService } from '../services/classroomStatusService';
import { TeacherDataService } from '../services/teacherDataService';
import { TeacherWebSocketService } from '../services/teacherWebSocketService';
import { StepToolsComponent } from '../common/stepTools/step-tools.component';
import { PeerGroupingAuthoringService } from '../../../../src/assets/wise5/services/peerGroupingAuthoringService';

import '../classroomMonitor/classroom-monitor.module';
import '../authoringTool/authoring-tool.module';

angular
  .module('teacher', ['common', 'angular-inview', 'authoringTool', 'classroomMonitor', 'ngAnimate'])
  .factory('ClassroomStatusService', downgradeInjectable(ClassroomStatusService))
  .factory('CopyComponentService', downgradeInjectable(CopyComponentService))
  .factory('CopyNodesService', downgradeInjectable(CopyNodesService))
  .factory('CopyProjectService', downgradeInjectable(CopyProjectService))
  .factory('DeleteNodeService', downgradeInjectable(DeleteNodeService))
  .factory('ImportComponentService', downgradeInjectable(ImportComponentService))
  .factory('InsertComponentService', downgradeInjectable(InsertComponentService))
  .factory('MilestoneService', downgradeInjectable(MilestoneService))
  .factory('MoveNodesService', downgradeInjectable(MoveNodesService))
  .factory('NodeInfoService', downgradeInjectable(NodeInfoService))
  .factory('PeerGroupingAuthoringService', downgradeInjectable(PeerGroupingAuthoringService))
  .factory('PeerGroupService', downgradeInjectable(PeerGroupService))
  .factory('TeacherPeerGroupService', downgradeInjectable(TeacherPeerGroupService))
  .factory('ProjectService', downgradeInjectable(TeacherProjectService))
  .factory('SpaceService', downgradeInjectable(SpaceService))
  .factory('TeacherDataService', downgradeInjectable(TeacherDataService))
  .factory('TeacherWebSocketService', downgradeInjectable(TeacherWebSocketService))
  .config([
    '$stateProvider',
    ($stateProvider) => {
      $stateProvider
        .state('root', {
          url: '/teacher',
          abstract: true
        })
        .state('sink', {
          url: '/*path',
          template: ''
        });
    }
  ]);
