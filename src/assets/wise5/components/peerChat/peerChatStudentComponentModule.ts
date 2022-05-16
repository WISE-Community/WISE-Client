'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { PeerChatStudentComponent } from './peer-chat-student/peer-chat-student.component';
import { PeerChatService } from './peerChatService';

const peerChatStudentComponentModule = angular
  .module('peerChatStudentComponentModule', [])
  .service('PeerChatService', downgradeInjectable(PeerChatService))
  .directive(
    'peerChatStudent',
    downgradeComponent({ component: PeerChatStudentComponent }) as angular.IDirectiveFactory
  );

export default peerChatStudentComponentModule;
