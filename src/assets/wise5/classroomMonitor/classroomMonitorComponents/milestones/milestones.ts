'use strict';

import { downgradeComponent } from '@angular/upgrade/static';
import * as angular from 'angular';
import MilestoneDetails from './milestoneDetails/milestoneDetails';
import { MilestonesComponent } from '../../../../../app/classroom-monitor/milestones/milestones.component';
import { MilestoneGradingViewComponent } from './milestone-grading-view/milestone-grading-view.component';

export default angular
  .module('milestones', [])
  .directive(
    'milestones',
    downgradeComponent({ component: MilestonesComponent }) as angular.IDirectiveFactory
  )
  .component('milestoneDetails', MilestoneDetails)
  .directive(
    'milestoneGradingView',
    downgradeComponent({ component: MilestoneGradingViewComponent })
  );
