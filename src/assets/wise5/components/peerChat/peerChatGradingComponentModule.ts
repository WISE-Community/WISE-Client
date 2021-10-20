'use strict';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { PeerChatGradingComponent } from './peer-chat-grading/peer-chat-grading.component';

const peerChatGradingComponentModule = angular
  .module('peerChatGradingComponentModule', [])
  .directive(
    'peerChatGrading',
    downgradeComponent({ component: PeerChatGradingComponent }) as angular.IDirectiveFactory
  );

export default peerChatGradingComponentModule;
