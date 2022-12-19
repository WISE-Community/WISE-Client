'use strict';

import { downgradeComponent } from '@angular/upgrade/static';
import * as angular from 'angular';
import { MilestonesComponent } from '../../../../../app/classroom-monitor/milestones/milestones.component';
import { MilestoneDetailsComponent } from './milestone-details/milestone-details.component';
import { MilestoneGradingViewComponent } from './milestone-grading-view/milestone-grading-view.component';

export default angular
  .module('milestones', [])
  .directive(
    'milestones',
    downgradeComponent({ component: MilestonesComponent }) as angular.IDirectiveFactory
  )
  .directive('milestoneDetails', downgradeComponent({ component: MilestoneDetailsComponent }))
  .directive(
    'milestoneGradingView',
    downgradeComponent({ component: MilestoneGradingViewComponent })
  );
