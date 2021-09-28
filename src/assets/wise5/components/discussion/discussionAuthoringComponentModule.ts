'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { DiscussionService } from './discussionService';
import { EditDiscussionAdvancedComponent } from './edit-discussion-advanced/edit-discussion-advanced.component';
import { DiscussionAuthoring } from './discussion-authoring/discussion-authoring.component';
import { EditDiscussionConnectedComponentsComponent } from './edit-discussion-connected-components/edit-discussion-connected-components.component';

const discussionAuthoringComponentModule = angular
  .module('discussionAuthoringComponentModule', [])
  .service('DiscussionService', downgradeInjectable(DiscussionService))
  .directive(
    'discussionAuthoring',
    downgradeComponent({ component: DiscussionAuthoring }) as angular.IDirectiveFactory
  )
  .directive(
    'editDiscussionAdvanced',
    downgradeComponent({ component: EditDiscussionAdvancedComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editDiscussionConnectedComponents',
    downgradeComponent({
      component: EditDiscussionConnectedComponentsComponent
    }) as angular.IDirectiveFactory
  );

export default discussionAuthoringComponentModule;
