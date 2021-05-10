'use strict';

import { ComponentSelectComponent } from '../../../../../app/classroom-monitor/component-select/component-select.component';
import NodeGradingView from './nodeGradingView/nodeGradingView';
import WorkgroupItem from './workgroupItem/workgroupItem';
import * as angular from 'angular';
import { WorkgroupInfoComponent } from './workgroupInfo/workgroup-info.component';
import { downgradeComponent } from '@angular/upgrade/static';
import MilestoneWorkgroupItem from '../milestones/milestoneWorkgroupItem/milestoneWorkgroupItem';

const NodeGrading = angular
  .module('nodeGrading', [])
  .component('nodeGradingView', NodeGradingView)
  .directive(
    'componentSelect',
    downgradeComponent({ component: ComponentSelectComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'workgroupInfo',
    downgradeComponent({ component: WorkgroupInfoComponent }) as angular.IDirectiveFactory
  )
  .component('workgroupItem', WorkgroupItem)
  .component('milestoneWorkgroupItem', MilestoneWorkgroupItem);

export default NodeGrading;
