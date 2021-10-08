'use strict';

import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import * as angular from 'angular';
import { EditPeerChatAdvancedComponentComponent } from './edit-peer-chat-advanced-component/edit-peer-chat-advanced-component.component';
import { PeerChatAuthoringComponent } from './peer-chat-authoring/peer-chat-authoring.component';
import { PeerChatService } from './peerChatService';

const peerChatAuthoringComponentModule = angular
  .module('peerChatAuthoringComponentModule', [])
  .service('PeerChatService', downgradeInjectable(PeerChatService))
  .directive(
    'peerChatAuthoring',
    downgradeComponent({ component: PeerChatAuthoringComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editPeerChatAdvanced',
    downgradeComponent({
      component: EditPeerChatAdvancedComponentComponent
    }) as angular.IDirectiveFactory
  );

export default peerChatAuthoringComponentModule;
