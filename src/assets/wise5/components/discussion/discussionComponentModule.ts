'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { DiscussionService } from './discussionService';
import { DiscussionStudent } from './discussion-student/discussion-student.component';

const discussionComponentModule = angular
  .module('discussionComponentModule', ['pascalprecht.translate'])
  .service('DiscussionService', downgradeInjectable(DiscussionService))
  .directive(
    'discussionStudent',
    downgradeComponent({ component: DiscussionStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/discussion/i18n');
    }
  ]);

export default discussionComponentModule;
