'use strict';

import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { ShowWorkService } from '../showWorkService';

const showWorkAuthoringAngularJSComponentModule = angular
  .module('showWorkAuthoringAngularJSComponentModule', [])
  .service('ShowWorkService', downgradeInjectable(ShowWorkService));

export default showWorkAuthoringAngularJSComponentModule;
