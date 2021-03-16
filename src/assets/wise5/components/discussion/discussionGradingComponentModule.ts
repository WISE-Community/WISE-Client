'use strict';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { DiscussionGrading } from './discussion-grading/discussion-grading.component';

const discussionGradingComponentModule = angular
  .module('discussionGradingComponentModule', ['pascalprecht.translate'])
  .directive(
    'discussionGrading',
    downgradeComponent({ component: DiscussionGrading }) as angular.IDirectiveFactory
  );

export default discussionGradingComponentModule;
