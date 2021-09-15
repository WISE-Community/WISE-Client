'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { DiscussionService } from './discussionService';
import { EditDiscussionAdvancedComponent } from './edit-discussion-advanced/edit-discussion-advanced.component';
import { DiscussionAuthoring } from './discussion-authoring/discussion-authoring.component';
import { EditDiscussionConnectedComponentsComponent } from './edit-discussion-connected-components/edit-discussion-connected-components.component';

const discussionAuthoringComponentModule = angular
  .module('discussionAuthoringComponentModule', ['pascalprecht.translate'])
  .service('DiscussionService', downgradeInjectable(DiscussionService))
  .component('editDiscussionAdvanced', EditDiscussionAdvancedComponent)
  .directive(
    'editDiscussionConnectedComponents',
    downgradeComponent({
      component: EditDiscussionConnectedComponentsComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'discussionAuthoring',
    downgradeComponent({ component: DiscussionAuthoring }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/discussion/i18n');
    }
  ]);

export default discussionAuthoringComponentModule;
