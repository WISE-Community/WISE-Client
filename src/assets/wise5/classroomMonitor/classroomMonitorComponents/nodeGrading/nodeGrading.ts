'use strict';

import { ComponentSelectComponent } from '../../../../../app/classroom-monitor/component-select/component-select.component';
import NodeGradingView from './nodeGradingView/nodeGradingView';
import * as angular from 'angular';
import { WorkgroupInfoComponent } from './workgroupInfo/workgroup-info.component';
import { downgradeComponent } from '@angular/upgrade/static';
import MilestoneWorkgroupItem from '../milestones/milestoneWorkgroupItem/milestoneWorkgroupItem';
import { PeerGroupDialogComponent } from '../peer-group/peer-group-dialog/peer-group-dialog.component';
import { WorkgroupItemComponent } from './workgroup-item/workgroup-item.component';

const NodeGrading = angular
  .module('nodeGrading', [])
  .component('nodeGradingView', NodeGradingView)
  .directive(
    'componentSelect',
    downgradeComponent({ component: ComponentSelectComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'peerGroupDialog',
    downgradeComponent({ component: PeerGroupDialogComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'workgroupInfo',
    downgradeComponent({ component: WorkgroupInfoComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'workgroupItem',
    downgradeComponent({ component: WorkgroupItemComponent }) as angular.IDirectiveFactory
  )
  .component('milestoneWorkgroupItem', MilestoneWorkgroupItem);

export default NodeGrading;
