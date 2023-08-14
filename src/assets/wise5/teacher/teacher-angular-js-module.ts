import '../lib/jquery/jquery-global';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import '../common-angular-js-module';
import { MilestoneService } from '../services/milestoneService';
import { PeerGroupService } from '../services/peerGroupService';
import { TeacherPeerGroupService } from '../services/teacherPeerGroupService';
import { TeacherProjectService } from '../services/teacherProjectService';
import { SpaceService } from '../services/spaceService';
import { ClassroomStatusService } from '../services/classroomStatusService';
import { TeacherDataService } from '../services/teacherDataService';
import { TeacherWebSocketService } from '../services/teacherWebSocketService';
import { PeerGroupingAuthoringService } from '../../../../src/assets/wise5/services/peerGroupingAuthoringService';

import '../classroomMonitor/classroom-monitor.module';

angular
  .module('teacher', ['common', 'angular-inview', 'classroomMonitor', 'ngAnimate'])
  .factory('ClassroomStatusService', downgradeInjectable(ClassroomStatusService))
  .factory('MilestoneService', downgradeInjectable(MilestoneService))
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
