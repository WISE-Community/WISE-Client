'use strict';

import { downgradeComponent } from '@angular/upgrade/static';
import * as angular from 'angular';
import MilestoneDetails from './milestoneDetails/milestoneDetails';
import MilestoneGradingView from './milestoneGradingView/milestoneGradingView';
import { MilestonesComponent } from '../../../../../app/classroom-monitor/milestones/milestones.component';

export default angular
  .module('milestones', [])
  .directive(
    'milestones',
    downgradeComponent({ component: MilestonesComponent }) as angular.IDirectiveFactory
  )
  .component('milestoneDetails', MilestoneDetails)
  .component('milestoneGradingView', MilestoneGradingView);
