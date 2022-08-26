'use strict';

import NodeProgressView from './nodeProgressView/nodeProgressView';
import NavItem from './navItem/navItem';
import WorkgroupProgress from './workgroupProgress/workgroupProgress';
import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { NavItemScoreComponent } from './navItemScore/nav-item-score.component';
import { NavItemProgressComponent } from '../../../../../app/classroom-monitor/nav-item-progress/nav-item-progress.component';

const NodeProgress = angular
  .module('nodeProgress', [])
  .component('nodeProgressView', NodeProgressView)
  .component('navItem', NavItem)
  .directive(
    'navItemProgress',
    downgradeComponent({ component: NavItemProgressComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'navItemScore',
    downgradeComponent({ component: NavItemScoreComponent }) as angular.IDirectiveFactory
  )
  .component('workgroupProgress', WorkgroupProgress);

export default NodeProgress;
