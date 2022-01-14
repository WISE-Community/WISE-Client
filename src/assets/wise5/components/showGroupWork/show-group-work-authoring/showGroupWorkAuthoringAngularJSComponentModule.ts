'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { ShowGroupWorkService } from '../showGroupWorkService';
import { ShowGroupWorkAuthoringComponent } from './show-group-work-authoring.component';
import { EditShowGroupWorkAdvancedComponent } from '../edit-show-group-work-advanced/edit-show-group-work-advanced.component';

const showGroupWorkAuthoringAngularJSComponentModule = angular
  .module('showGroupWorkAuthoringAngularJSComponentModule', [])
  .service('ShowGroupWorkService', downgradeInjectable(ShowGroupWorkService))
  .directive(
    'editShowGroupWorkAdvanced',
    downgradeComponent({
      component: EditShowGroupWorkAdvancedComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'showGroupWorkAuthoring',
    downgradeComponent({ component: ShowGroupWorkAuthoringComponent }) as angular.IDirectiveFactory
  );

export default showGroupWorkAuthoringAngularJSComponentModule;
