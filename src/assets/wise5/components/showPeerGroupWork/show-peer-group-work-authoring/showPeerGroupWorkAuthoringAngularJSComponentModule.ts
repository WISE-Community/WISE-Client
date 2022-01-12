'use strict';

import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { ShowPeerGroupWorkService } from '../showPeerGroupWorkService';

const showPeerGroupWorkAuthoringAngularJSComponentModule = angular
  .module('showPeerGroupWorkAuthoringAngularJSComponentModule', [])
  .service('ShowPeerGroupWorkService', downgradeInjectable(ShowPeerGroupWorkService));

export default showPeerGroupWorkAuthoringAngularJSComponentModule;
