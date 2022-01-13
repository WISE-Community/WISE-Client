'use strict';

import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { ShowMyWorkService } from '../showMyWorkService';

const showWorkAuthoringAngularJSComponentModule = angular
  .module('showWorkAuthoringAngularJSComponentModule', [])
  .service('ShowMyWorkService', downgradeInjectable(ShowMyWorkService));

export default showWorkAuthoringAngularJSComponentModule;
