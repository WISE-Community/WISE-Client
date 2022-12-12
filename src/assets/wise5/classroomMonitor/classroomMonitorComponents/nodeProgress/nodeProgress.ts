'use strict';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { NavItemScoreComponent } from './navItemScore/nav-item-score.component';
import { NavItemProgressComponent } from '../../../../../app/classroom-monitor/nav-item-progress/nav-item-progress.component';
import { NavItemComponent } from './nav-item/nav-item.component';
import { NodeProgressViewComponent } from './node-progress-view/node-progress-view.component';

const NodeProgress = angular
  .module('nodeProgress', [])
  .directive(
    'nodeProgressView',
    downgradeComponent({ component: NodeProgressViewComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'navItem',
    downgradeComponent({ component: NavItemComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'navItemProgress',
    downgradeComponent({ component: NavItemProgressComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'navItemScore',
    downgradeComponent({ component: NavItemScoreComponent }) as angular.IDirectiveFactory
  );

export default NodeProgress;
