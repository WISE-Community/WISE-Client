'use strict';

import { ComponentNewWorkBadgeComponent } from '../../../../../app/classroom-monitor/component-new-work-badge/component-new-work-badge.component';
import MainMenu from './mainMenu/mainMenu';
import NodeInfo from './nodeInfo/nodeInfo';
import NotificationsMenu from './notificationsMenu/notificationsMenu';
import PauseScreensMenu from './pauseScreensMenu/pauseScreensMenu';
import { StatusIconComponent } from '../../../../../app/classroom-monitor/status-icon/status-icon.component';
import Toolbar from './toolbar/toolbar';
import TopBar from './topBar/topBar';
import { WorkgroupNodeStatusComponent } from '../../../../../app/classroom-monitor/workgroup-node-status/workgroup-node-status.component';
import { WorkgroupSelectAutocompleteComponent } from '../../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { WorkgroupSelectDropdownComponent } from '../../../../../app/classroom-monitor/workgroup-select/workgroup-select-dropdown/workgroup-select-dropdown.component';
import { AlertStatusCornerComponent } from '../../../../../app/classroom-monitor/alert-status-corner/alert-status-corner.component';
import * as angular from 'angular';
import { WorkgroupNodeScoreComponent } from './workgroupNodeScore/workgroup-node-score.component';
import { downgradeComponent } from '@angular/upgrade/static';

const Shared = angular
  .module('cmShared', [])
  .directive(
    'alertStatusCorner',
    downgradeComponent({ component: AlertStatusCornerComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'componentNewWorkBadge',
    downgradeComponent({ component: ComponentNewWorkBadgeComponent }) as angular.IDirectiveFactory
  )
  .component('cmMainMenu', MainMenu)
  .component('notificationsMenu', NotificationsMenu)
  .component('nodeInfo', NodeInfo)
  .component('pauseScreensMenu', PauseScreensMenu)
  .directive(
    'statusIcon',
    downgradeComponent({ component: StatusIconComponent }) as angular.IDirectiveFactory
  )
  .component('cmToolbar', Toolbar)
  .component('cmTopBar', TopBar)
  .directive(
    'workgroupNodeScore',
    downgradeComponent({ component: WorkgroupNodeScoreComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'workgroupNodeStatus',
    downgradeComponent({ component: WorkgroupNodeStatusComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'workgroupSelectAutocomplete',
    downgradeComponent({
      component: WorkgroupSelectAutocompleteComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'workgroupSelectDropdown',
    downgradeComponent({ component: WorkgroupSelectDropdownComponent }) as angular.IDirectiveFactory
  );

export default Shared;
