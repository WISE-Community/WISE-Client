'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { ShowPeerGroupWorkService } from '../showPeerGroupWorkService';
import { ShowPeerGroupWorkStudentComponent } from './show-peer-group-work-student.component';

const showPeerGroupWorkStudentAngularJSComponentModule = angular
  .module('showPeerGroupWorkStudentAngularJSComponentModule', [])
  .service('ShowPeerGroupWorkService', downgradeInjectable(ShowPeerGroupWorkService))
  .directive(
    'showPeerGroupWorkStudent',
    downgradeComponent({
      component: ShowPeerGroupWorkStudentComponent
    }) as angular.IDirectiveFactory
  );

export default showPeerGroupWorkStudentAngularJSComponentModule;
