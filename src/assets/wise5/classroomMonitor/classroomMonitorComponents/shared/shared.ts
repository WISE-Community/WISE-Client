'use strict';

import { ComponentNewWorkBadgeComponent } from '../../../../../app/classroom-monitor/component-new-work-badge/component-new-work-badge.component';
import { NodeInfoComponent } from './node-info/node-info.component';
import { StatusIconComponent } from '../../../../../app/classroom-monitor/status-icon/status-icon.component';
import TopBar from './topBar/topBar';
import { WorkgroupNodeStatusComponent } from '../../../../../app/classroom-monitor/workgroup-node-status/workgroup-node-status.component';
import { WorkgroupSelectAutocompleteComponent } from '../../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { WorkgroupSelectDropdownComponent } from '../../../../../app/classroom-monitor/workgroup-select/workgroup-select-dropdown/workgroup-select-dropdown.component';
import { AlertStatusCornerComponent } from '../../../../../app/classroom-monitor/alert-status-corner/alert-status-corner.component';
import * as angular from 'angular';
import { WorkgroupNodeScoreComponent } from './workgroupNodeScore/workgroup-node-score.component';
import { downgradeComponent } from '@angular/upgrade/static';
import { PauseScreensMenuComponent } from '../pause-screens-menu/pause-screens-menu.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { MainMenuComponent } from '../../../common/main-menu/main-menu.component';
import { NotificationsMenuComponent } from './notifications-menu/notifications-menu.component';
import { TopBarComponent } from './top-bar/top-bar.component';

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
  .directive(
    'cmMainMenu',
    downgradeComponent({ component: MainMenuComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'nodeInfo',
    downgradeComponent({ component: NodeInfoComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'notificationsMenu',
    downgradeComponent({ component: NotificationsMenuComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'pauseScreensMenu',
    downgradeComponent({ component: PauseScreensMenuComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'statusIcon',
    downgradeComponent({ component: StatusIconComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'cmToolbar',
    downgradeComponent({ component: ToolBarComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'cmTopBar',
    downgradeComponent({ component: TopBarComponent }) as angular.IDirectiveFactory
  )
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
