'use strict';

import * as angular from 'angular';
import MilestoneDetails from './milestoneDetails/milestoneDetails';
import MilestoneGradingView from './milestoneGradingView/milestoneGradingView';

const Milestones = angular
  .module('milestones', [])
  .component('milestoneDetails', MilestoneDetails)
  .component('milestoneGradingView', MilestoneGradingView);

export default Milestones;
